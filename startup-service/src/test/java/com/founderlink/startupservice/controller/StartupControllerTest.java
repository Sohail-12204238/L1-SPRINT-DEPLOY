package com.founderlink.startupservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.founderlink.startupservice.dto.*;
import com.founderlink.startupservice.service.StartupService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@WebMvcTest(StartupController.class)
class StartupControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StartupService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(authorities = "ROLE_FOUNDER")
    void testCreateStartup() throws Exception {

        StartupRequest request = new StartupRequest();
        request.setName("Test Startup");
        request.setDescription("This is a test startup description that is long enough.");
        request.setIndustry("Tech");
        request.setProblemStatement("This is a test problem statement that is long enough.");
        request.setSolution("This is a test solution that is long enough.");
        request.setFundingGoal(100000.0);
        request.setStage(com.founderlink.startupservice.entity.StartupStage.IDEA);

        StartupResponse response = StartupResponse.builder()
                .id(1L)
                .name("Test Startup")
                .build();

        when(service.createStartup(anyString(), any(StartupRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/startups")
                .with(csrf())
                .header("X-User", "founder@gmail.com")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Startup"));
    }

    @Test
    @WithMockUser
    void testGetStartup() throws Exception {

        StartupResponse response = StartupResponse.builder()
                .id(1L)
                .name("Demo")
                .build();

        when(service.getStartupById(1L)).thenReturn(response);

        mockMvc.perform(get("/startups/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Demo"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_FOUNDER")
    void testDeleteStartup() throws Exception {

        mockMvc.perform(delete("/startups/1")
                .with(csrf())
                .header("X-User", "founder@gmail.com"))
                .andExpect(status().isOk());
    }
}