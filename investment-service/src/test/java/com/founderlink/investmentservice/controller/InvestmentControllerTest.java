package com.founderlink.investmentservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.founderlink.investmentservice.dto.*;
import com.founderlink.investmentservice.service.InvestmentService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InvestmentController.class)
@AutoConfigureMockMvc(addFilters = false) // 🔥 disables security
class InvestmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvestmentService service;

    @Autowired
    private ObjectMapper objectMapper;

    private final String EMAIL = "test@gmail.com";

    // ================= CREATE =================

    @Test
    void testCreateInvestment() throws Exception {

        InvestmentRequest request = new InvestmentRequest();
        request.setStartupId(1L);
        request.setAmount(10000.0);

        InvestmentResponse response = new InvestmentResponse();
        response.setId(1L);

        when(service.createInvestment(anyString(), any())).thenReturn(response);

        mockMvc.perform(post("/investments")
                .header("X-User", EMAIL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));

        verify(service).createInvestment(eq(EMAIL), any());
    }

    // ================= GET MY =================

    @Test
    void testGetMyInvestments() throws Exception {

        when(service.getByInvestorEmail(anyString()))
                .thenReturn(List.of(new InvestmentResponse()));

        mockMvc.perform(get("/investments/my")
                .header("X-User", EMAIL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        verify(service).getByInvestorEmail(EMAIL);
    }

    // ================= GET BY STARTUP =================

    @Test
    void testGetByStartup() throws Exception {

        when(service.getByStartupWithOwnerCheck(anyLong(), anyString()))
                .thenReturn(List.of(new InvestmentResponse()));

        mockMvc.perform(get("/investments/startup/1")
                .header("X-User", EMAIL))
                .andExpect(status().isOk());

        verify(service).getByStartupWithOwnerCheck(1L, EMAIL);
    }

    // ================= APPROVE =================

    @Test
    void testApproveInvestment() throws Exception {

        InvestmentResponse response = new InvestmentResponse();

        when(service.approveInvestment(anyLong(), anyString()))
                .thenReturn(response);

        mockMvc.perform(put("/investments/1/approve")
                .header("X-User", EMAIL))
                .andExpect(status().isOk());

        verify(service).approveInvestment(1L, EMAIL);
    }

    // ================= REJECT =================

    @Test
    void testRejectInvestment() throws Exception {

        InvestmentResponse response = new InvestmentResponse();

        when(service.rejectInvestment(anyLong(), anyString()))
                .thenReturn(response);

        mockMvc.perform(put("/investments/1/reject")
                .header("X-User", EMAIL))
                .andExpect(status().isOk());

        verify(service).rejectInvestment(1L, EMAIL);
    }

    // ================= SEND REQUEST =================

    @Test
    void testSendRequest() throws Exception {

        InvestorRequestRequest request = new InvestorRequestRequest();
        request.setStartupId(1L);
        request.setInvestorEmail("inv@gmail.com");

        InvestorRequestResponse response = new InvestorRequestResponse();

        when(service.sendRequest(anyString(), any()))
                .thenReturn(response);

        mockMvc.perform(post("/investments/investment-requests")
                .header("X-User", EMAIL)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(service).sendRequest(eq(EMAIL), any());
    }

    // ================= GET REQUESTS =================

    @Test
    void testGetRequests() throws Exception {

        when(service.getRequestsForInvestor(anyString()))
                .thenReturn(List.of(new InvestorRequestResponse()));

        mockMvc.perform(get("/investments/investment-requests")
                .header("X-User", EMAIL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        verify(service).getRequestsForInvestor(EMAIL);
    }

    // ================= RESPOND =================

    @Test
    void testRespondRequest() throws Exception {

        InvestorRequestResponse response = new InvestorRequestResponse();

        when(service.respond(anyLong(), anyString(), anyBoolean()))
                .thenReturn(response);

        mockMvc.perform(put("/investments/investment-requests/respond/1")
                .param("accept", "true")
                .header("X-User", EMAIL))
                .andExpect(status().isOk());

        verify(service).respond(1L, EMAIL, true);
    }
}