package com.founderlink.teamservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.founderlink.teamservice.config.RabbitMQConstants;
import com.founderlink.teamservice.dto.*;
import com.founderlink.teamservice.entity.*;
import com.founderlink.teamservice.event.NotificationEvent;
import com.founderlink.teamservice.exception.*;
import com.founderlink.teamservice.feign.StartupClient;
import com.founderlink.teamservice.repository.TeamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository repository;
    private final TeamMapper mapper;
    private final StartupClient startupClient;
    private final RabbitTemplate rabbitTemplate;

    @Override
    public TeamResponse invite(String founderEmail, InviteRequest request) {

        // 🔒 Validate startup + owner
        StartupResponse startup;
        try {
            startup = startupClient.getStartup(request.getStartupId());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Startup not found");
        }

        if (!startup.getFounderEmail().equals(founderEmail)) {
            throw new UnauthorizedException("Not your startup");
        }

        if (repository.findByStartupIdAndUserEmail(
                request.getStartupId(),
                request.getUserEmail()).isPresent()) {

            throw new BadRequestException("User already part of team");
        }

        Team team = mapper.toEntity(request, founderEmail);
        team.setStatus(TeamStatus.INVITED);

        Team saved = repository.save(team);

        sendEvent(
                "TEAM_INVITE_SENT",
                request.getUserEmail(),
                "You have been invited to join a startup",
                saved.getId()
        );

        return mapper.toDTO(saved);
    }

    @Override
    public TeamResponse join(String userEmail, JoinRequest request) {

        Team team = repository.findByStartupIdAndUserEmail(
                request.getStartupId(),
                userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        if (team.getStatus() == TeamStatus.ACCEPTED) {
            throw new BadRequestException("Already joined");
        }

        if (team.getStatus() != TeamStatus.INVITED) {
            throw new BadRequestException("Invalid invitation");
        }

        team.setStatus(TeamStatus.ACCEPTED);
        team.setJoinedAt(LocalDateTime.now());

        Team saved = repository.save(team);

        // 🔔 Notify founder
        sendEvent(
                "TEAM_JOINED",
                team.getFounderEmail(),
                "A user joined your startup team",
                saved.getId()
        );

        return mapper.toDTO(saved);
    }

    @Override
    public List<TeamResponse> getTeamByStartup(Long startupId, String email) {

        StartupResponse startup;
        try {
            startup = startupClient.getStartup(startupId);
        } catch (Exception e) {
            throw new ResourceNotFoundException("Startup not found");
        }

        String founder = startup.getFounderEmail();

        boolean isMember = repository
                .findByStartupIdAndUserEmail(startupId, email)
                .isPresent();

        if (!founder.equals(email) && !isMember) {
            throw new UnauthorizedException("Not allowed to view team");
        }

        return repository.findByStartupId(startupId)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public List<TeamResponse> getMyTeams(String email) {
        return repository.findByUserEmail(email)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    private void sendEvent(String type, String email, String message, Long id) {

        try {
            NotificationEvent event = new NotificationEvent(type, email, message, id);

            rabbitTemplate.convertAndSend(
                    RabbitMQConstants.EXCHANGE,
                    RabbitMQConstants.ROUTING_KEY,
                    event
            );
        } catch (Exception e) {
            System.out.println("Notification failed: " + e.getMessage());
        }
    }
}