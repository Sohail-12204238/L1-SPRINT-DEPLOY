package com.founderlink.userservice.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;


import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.founderlink.userservice.dto.UserRequest;
import com.founderlink.userservice.dto.UserResponse;
import com.founderlink.userservice.service.UserService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    // CREATE PROFILE
    @Test
    void testCreateProfile() throws Exception {
        UserRequest request = new UserRequest();
        request.setName("Test User");
        request.setSkills("Java, Spring, React");
        request.setExperience("5 years of software development");
        request.setBio("A passionate software engineer building startup platforms.");

        when(userService.createProfile(anyString(), anyString(), any()))
                .thenReturn(new UserResponse());

        mockMvc.perform(post("/users")
                .header("X-User", "test@mail.com")
                .header("X-Role", "ROLE_INVESTOR")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    // UPDATE PROFILE
    @Test
    void testUpdateProfile() throws Exception {
        UserRequest request = new UserRequest();
        request.setName("Updated User");
        request.setSkills("Java, AWS, Python");
        request.setExperience("7 years of experience");
        request.setBio("Updated bio for the user profile test.");

        when(userService.updateProfile(anyLong(), anyString(), any()))
                .thenReturn(new UserResponse());

        mockMvc.perform(put("/users/1")
                .header("X-User", "test@mail.com")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    // VIEW PROFILE
    @Test
    void testViewProfile() throws Exception {
        when(userService.viewProfile(1L)).thenReturn(new UserResponse());

        mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk());
    }

    // GET INVESTORS
    @Test
    void testGetInvestors() throws Exception {
        when(userService.getInvestors()).thenReturn(java.util.List.of(new UserResponse()));

        mockMvc.perform(get("/users/investors"))
                .andExpect(status().isOk());
    }

    // GET BY EMAIL
    @Test
    void testGetByEmail() throws Exception {
        when(userService.getByEmail("test@mail.com"))
                .thenReturn(new UserResponse());

        mockMvc.perform(get("/users/email/test@mail.com"))
                .andExpect(status().isOk());
    }
    
    @Test
    void testViewProfile_NotFound() throws Exception {
        when(userService.viewProfile(1L))
                .thenThrow(new RuntimeException("User Not Found"));

        mockMvc.perform(get("/users/1"))
                .andExpect(status().isInternalServerError());
    }
}