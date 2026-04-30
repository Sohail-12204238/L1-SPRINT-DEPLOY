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
    public TeamResponse requestJoin(String userEmail, JoinRequest request) {
        StartupResponse startup;
        try {
            startup = startupClient.getStartup(request.getStartupId());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Startup not found");
        }

        if (repository.findByStartupIdAndUserEmail(request.getStartupId(), userEmail).isPresent()) {
            throw new BadRequestException("Request already exists or user is already part of team");
        }

        Team team = new Team();
        team.setStartupId(request.getStartupId());
        team.setFounderEmail(startup.getFounderEmail());
        team.setUserEmail(userEmail);
        team.setRole(TeamRole.ENGINEERING_LEAD); // Default role, can be customized later
        team.setStatus(TeamStatus.REQUEST_PENDING);

        Team saved = repository.save(team);

        sendEvent(
                "TEAM_JOIN_REQUESTED",
                startup.getFounderEmail(),
                userEmail + " has requested to join your startup",
                saved.getId()
        );

        return mapper.toDTO(saved);
    }

    @Override
    public TeamResponse respondToTeam(Long teamId, boolean accept, String userEmail) {
        Team team = repository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team record not found"));

        boolean wasInvited = team.getStatus() == TeamStatus.INVITED;

        // If it's an invite (founder -> cofounder), the cofounder must respond
        if (wasInvited) {
            if (!team.getUserEmail().equals(userEmail)) {
                throw new UnauthorizedException("Not authorized to respond to this invite");
            }
        } 
        // If it's a request (cofounder -> founder), the founder must respond
        else if (team.getStatus() == TeamStatus.REQUEST_PENDING) {
            if (!team.getFounderEmail().equals(userEmail)) {
                throw new UnauthorizedException("Not authorized to respond to this request");
            }
        } else {
            throw new BadRequestException("Cannot respond to this team record");
        }

        if (accept) {
            team.setStatus(TeamStatus.ACCEPTED);
            team.setJoinedAt(LocalDateTime.now());
            Team saved = repository.save(team);
            
            // Notify the other party
            String notifyEmail = wasInvited ? team.getFounderEmail() : team.getUserEmail();
            sendEvent("TEAM_ACCEPTED", notifyEmail, "Team request accepted", saved.getId());
            return mapper.toDTO(saved);
        } else {
            team.setStatus(TeamStatus.REJECTED);
            Team saved = repository.save(team);
            return mapper.toDTO(saved);
        }
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