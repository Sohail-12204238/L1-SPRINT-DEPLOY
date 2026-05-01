package com.founderlink.teamservice.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import com.founderlink.teamservice.dto.*;
import com.founderlink.teamservice.entity.*;
import com.founderlink.teamservice.exception.*;
import com.founderlink.teamservice.feign.StartupClient;
import com.founderlink.teamservice.repository.TeamRepository;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock
    private TeamRepository repository;

    @Mock
    private TeamMapper mapper;

    @Mock
    private StartupClient startupClient;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private TeamServiceImpl service;

    private Team team;
    private StartupResponse startup;
    private InviteRequest inviteRequest;
    private TeamResponse response;

    @BeforeEach
    void setUp() {
        team = new Team();
        team.setId(1L);
        team.setStartupId(10L);
        team.setFounderEmail("founder@test.com");
        team.setUserEmail("user@test.com");
        team.setStatus(TeamStatus.INVITED);

        startup = new StartupResponse();
        startup.setId(10L);
        startup.setFounderEmail("founder@test.com");

        inviteRequest = new InviteRequest();
        inviteRequest.setStartupId(10L);
        inviteRequest.setUserEmail("user@test.com");

        response = new TeamResponse();
        response.setId(1L);
    }

    @Test
    void invite_Success() {
        when(startupClient.getStartup(10L)).thenReturn(startup);
        when(repository.findByStartupIdAndUserEmail(10L, "user@test.com")).thenReturn(Optional.empty());
        when(mapper.toEntity(any(InviteRequest.class), anyString())).thenReturn(team);
        when(repository.save(any(Team.class))).thenReturn(team);
        when(mapper.toDTO(any(Team.class))).thenReturn(response);

        TeamResponse result = service.invite("founder@test.com", inviteRequest);

        assertNotNull(result);
        verify(repository, times(1)).save(any(Team.class));
    }

    @Test
    void invite_NotYourStartup() {
        when(startupClient.getStartup(10L)).thenReturn(startup);

        assertThrows(UnauthorizedException.class, () -> 
            service.invite("other@test.com", inviteRequest));
    }

    @Test
    void requestJoin_Success() {
        JoinRequest joinRequest = new JoinRequest();
        joinRequest.setStartupId(10L);

        when(startupClient.getStartup(10L)).thenReturn(startup);
        when(repository.findByStartupIdAndUserEmail(10L, "user@test.com")).thenReturn(Optional.empty());
        when(repository.save(any(Team.class))).thenReturn(team);
        when(mapper.toDTO(any(Team.class))).thenReturn(response);

        TeamResponse result = service.requestJoin("user@test.com", joinRequest);

        assertNotNull(result);
        verify(repository, times(1)).save(any(Team.class));
    }

    @Test
    void respondToTeam_AcceptInvite() {
        when(repository.findById(1L)).thenReturn(Optional.of(team));
        when(repository.save(any(Team.class))).thenReturn(team);
        when(mapper.toDTO(any(Team.class))).thenReturn(response);

        TeamResponse result = service.respondToTeam(1L, true, "user@test.com");

        assertNotNull(result);
        assertEquals(TeamStatus.ACCEPTED, team.getStatus());
    }

    @Test
    void respondToTeam_RejectRequest() {
        team.setStatus(TeamStatus.REQUEST_PENDING);
        when(repository.findById(1L)).thenReturn(Optional.of(team));
        when(repository.save(any(Team.class))).thenReturn(team);
        when(mapper.toDTO(any(Team.class))).thenReturn(response);

        TeamResponse result = service.respondToTeam(1L, false, "founder@test.com");

        assertNotNull(result);
        assertEquals(TeamStatus.REJECTED, team.getStatus());
    }
}
