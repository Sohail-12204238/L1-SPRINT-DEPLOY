package com.founderlink.investmentservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.founderlink.investmentservice.config.RabbitMQConstants;
import com.founderlink.investmentservice.dto.*;
import com.founderlink.investmentservice.entity.*;
import com.founderlink.investmentservice.event.NotificationEvent;
import com.founderlink.investmentservice.feign.StartupClient;
import com.founderlink.investmentservice.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {

    private final InvestmentRepository repository;
    private final InvestmentMapper mapper;

    private final InvestorRequestRepository requestRepository;
    private final InvestorRequestMapper requestMapper;

    private final RabbitTemplate rabbitTemplate;
    private final StartupClient startupClient;

    // ===================== INVESTMENT =====================

    @Override
    public InvestmentResponse createInvestment(String investorEmail, InvestmentRequest request) {

        Investment investment = mapper.toEntity(request);

        investment.setInvestorEmail(investorEmail);
        investment.setStatus(InvestmentStatus.PENDING);
        investment.setCreatedAt(LocalDateTime.now());

        Investment saved = repository.save(investment);

        // 🔥 SAFE FEIGN CALL
        try {
            String founderEmail = startupClient
                    .getStartup(request.getStartupId())
                    .getFounderEmail();

            sendEvent(
                    "INVESTMENT_CREATED",
                    founderEmail,
                    "New investment of ₹" + request.getAmount(),
                    saved.getId()
            );

        } catch (Exception e) {
            System.out.println("Feign/Notification failed: " + e.getMessage());
        }

        return mapper.toDTO(saved);
    }

    @Override
    public List<InvestmentResponse> getByInvestorEmail(String email) {
        return repository.findByInvestorEmail(email)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public List<InvestmentResponse> getByStartupWithOwnerCheck(Long startupId, String founderEmail) {

        try {
            String actualFounder = startupClient
                    .getStartup(startupId)
                    .getFounderEmail();

            if (!actualFounder.equals(founderEmail)) {
                throw new RuntimeException("Unauthorized");
            }

        } catch (Exception e) {
            throw new RuntimeException("Startup verification failed");
        }

        return repository.findByStartupId(startupId)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public InvestmentResponse approveInvestment(Long id, String founderEmail) {

        Investment investment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Investment not found"));

        // 🔥 OWNER VALIDATION
        try {
            String actualFounder = startupClient
                    .getStartup(investment.getStartupId())
                    .getFounderEmail();

            if (!actualFounder.equals(founderEmail)) {
                throw new RuntimeException("Unauthorized");
            }

        } catch (Exception e) {
            throw new RuntimeException("Startup verification failed");
        }

        if (investment.getStatus() != InvestmentStatus.PENDING) {
            throw new RuntimeException("Already processed");
        }

        investment.setStatus(InvestmentStatus.APPROVED);
        Investment saved = repository.save(investment);

        try {
            sendEvent(
                    "INVESTMENT_APPROVED",
                    investment.getInvestorEmail(),
                    "Your investment has been approved",
                    investment.getId()
            );
        } catch (Exception e) {
            System.out.println("Notification failed: " + e.getMessage());
        }

        return mapper.toDTO(saved);
    }

    @Override
    public InvestmentResponse rejectInvestment(Long id, String founderEmail) {

        Investment investment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Investment not found"));

        // 🔥 OWNER VALIDATION
        try {
            String actualFounder = startupClient
                    .getStartup(investment.getStartupId())
                    .getFounderEmail();

            if (!actualFounder.equals(founderEmail)) {
                throw new RuntimeException("Unauthorized");
            }

        } catch (Exception e) {
            throw new RuntimeException("Startup verification failed");
        }

        if (investment.getStatus() != InvestmentStatus.PENDING) {
            throw new RuntimeException("Already processed");
        }

        investment.setStatus(InvestmentStatus.REJECTED);
        Investment saved = repository.save(investment);

        try {
            sendEvent(
                    "INVESTMENT_REJECTED",
                    investment.getInvestorEmail(),
                    "Your investment has been rejected",
                    investment.getId()
            );
        } catch (Exception e) {
            System.out.println("Notification failed: " + e.getMessage());
        }

        return mapper.toDTO(saved);
    }

    // ===================== INVESTOR REQUEST =====================

    @Override
    public InvestorRequestResponse sendRequest(String founderEmail, InvestorRequestRequest request) {

        if (requestRepository.existsByStartupIdAndInvestorEmail(
                request.getStartupId(), request.getInvestorEmail())) {
            throw new RuntimeException("Already requested");
        }

        InvestorRequest entity = InvestorRequest.builder()
                .startupId(request.getStartupId())
                .founderEmail(founderEmail)
                .investorEmail(request.getInvestorEmail())
                .proposedAmount(request.getProposedAmount())
                .status(RequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        InvestorRequest saved = requestRepository.save(entity);

        try {
            sendEvent(
                    "REQUEST_SENT",
                    request.getInvestorEmail(),
                    "A founder invited you to invest",
                    saved.getId()
            );
        } catch (Exception e) {
            System.out.println("Notification failed: " + e.getMessage());
        }

        return requestMapper.toDTO(saved);
    }

    @Override
    public List<InvestorRequestResponse> getRequestsForInvestor(String email) {
        return requestRepository.findByInvestorEmail(email)
                .stream()
                .map(requestMapper::toDTO)
                .toList();
    }

    @Override
    public InvestorRequestResponse respond(Long id, String investorEmail, boolean accept) {

        InvestorRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getInvestorEmail().equals(investorEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        request.setStatus(accept ? RequestStatus.ACCEPTED : RequestStatus.REJECTED);
        InvestorRequest saved = requestRepository.save(request);

        // 🔥 CREATE INVESTMENT IF ACCEPTED
        if (accept) {
            Investment investment = Investment.builder()
                    .startupId(request.getStartupId())
                    .investorEmail(investorEmail)
                    .amount(request.getProposedAmount())
                    .status(InvestmentStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            repository.save(investment);
        }

        try {
            sendEvent(
                    accept ? "REQUEST_ACCEPTED" : "REQUEST_REJECTED",
                    request.getFounderEmail(),
                    accept ? "Investor accepted your request" : "Investor rejected your request",
                    saved.getId()
            );
        } catch (Exception e) {
            System.out.println("Notification failed: " + e.getMessage());
        }

        return requestMapper.toDTO(saved);
    }

    // ===================== COMMON EVENT =====================

    @Override
    public void sendEvent(String type, String email, String message, Long referenceId) {

        NotificationEvent event = new NotificationEvent(type, email, message, referenceId);

        rabbitTemplate.convertAndSend(
                RabbitMQConstants.EXCHANGE,
                RabbitMQConstants.ROUTING_KEY,
                event
        );
    }
}