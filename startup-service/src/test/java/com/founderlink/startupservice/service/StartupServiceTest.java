package com.founderlink.startupservice.service;

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

import com.founderlink.startupservice.dto.StartupMapper;
import com.founderlink.startupservice.dto.StartupRequest;
import com.founderlink.startupservice.dto.StartupResponse;
import com.founderlink.startupservice.entity.Startup;
import com.founderlink.startupservice.entity.StartupStatus;
import com.founderlink.startupservice.exception.StartupNotFoundException;
import com.founderlink.startupservice.repository.StartupRepository;

@ExtendWith(MockitoExtension.class)
class StartupServiceTest {

    @Mock
    private StartupRepository repository;

    @Mock
    private StartupMapper mapper;

    @InjectMocks
    private StartupServiceImpl service;

    private Startup startup;
    private StartupRequest request;
    private StartupResponse response;

    @BeforeEach
    void setUp() {
        startup = new Startup();
        startup.setId(1L);
        startup.setName("Test Startup");
        startup.setFounderEmail("founder@test.com");
        startup.setStatus(StartupStatus.PENDING);

        request = new StartupRequest();
        request.setName("Test Startup");

        response = new StartupResponse();
        response.setId(1L);
        response.setName("Test Startup");
        response.setFounderEmail("founder@test.com");
    }

    @Test
    void createStartup_Success() {
        when(mapper.toEntity(any(StartupRequest.class))).thenReturn(startup);
        when(repository.save(any(Startup.class))).thenReturn(startup);
        when(mapper.toDTO(any(Startup.class))).thenReturn(response);

        StartupResponse result = service.createStartup("founder@test.com", request);

        assertNotNull(result);
        assertEquals("Test Startup", result.getName());
        verify(repository, times(1)).save(any(Startup.class));
    }

    @Test
    void getStartupById_Success() {
        when(repository.findById(1L)).thenReturn(Optional.of(startup));
        when(mapper.toDTO(startup)).thenReturn(response);

        StartupResponse result = service.getStartupById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getStartupById_NotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(StartupNotFoundException.class, () -> service.getStartupById(1L));
    }

    @Test
    void updateStartup_Success() {
        when(repository.findById(1L)).thenReturn(Optional.of(startup));
        when(repository.save(any(Startup.class))).thenReturn(startup);
        when(mapper.toDTO(any(Startup.class))).thenReturn(response);

        StartupResponse result = service.updateStartupById(1L, "founder@test.com", request);

        assertNotNull(result);
        verify(repository, times(1)).save(any(Startup.class));
    }

    @Test
    void updateStartup_WrongOwner() {
        when(repository.findById(1L)).thenReturn(Optional.of(startup));

        assertThrows(RuntimeException.class, () -> 
            service.updateStartupById(1L, "wrong@test.com", request));
    }

    @Test
    void approveStartup_Success() {
        when(repository.findById(1L)).thenReturn(Optional.of(startup));
        when(repository.save(any(Startup.class))).thenReturn(startup);
        when(mapper.toDTO(any(Startup.class))).thenReturn(response);

        StartupResponse result = service.approveStartup(1L);

        assertNotNull(result);
        assertEquals(StartupStatus.LIVE, startup.getStatus());
    }
}
