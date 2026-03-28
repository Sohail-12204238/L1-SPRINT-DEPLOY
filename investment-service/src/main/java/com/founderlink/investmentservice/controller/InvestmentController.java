package com.founderlink.investmentservice.controller;


import com.founderlink.investmentservice.dto.*;
import com.founderlink.investmentservice.service.InvestmentService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService service;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_INVESTOR')")
    public ResponseEntity<InvestmentResponse> create(
            @RequestBody InvestmentRequest request,
            HttpServletRequest httpRequest) {

        String email = httpRequest.getHeader("X-User");
        return ResponseEntity.ok(service.createInvestment(email, request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ROLE_INVESTOR')")
    public ResponseEntity<List<InvestmentResponse>> getMyInvestments(
            HttpServletRequest httpRequest) {

        String email = httpRequest.getHeader("X-User");
        return ResponseEntity.ok(service.getByInvestorEmail(email));
    }

    @GetMapping("/startup/{startupId}")
    @PreAuthorize("hasAuthority('ROLE_FOUNDER')")
    public ResponseEntity<List<InvestmentResponse>> getByStartup(
            @PathVariable Long startupId,
            HttpServletRequest httpRequest) {

        String email = httpRequest.getHeader("X-User");
        return ResponseEntity.ok(service.getByStartupWithOwnerCheck(startupId, email));
    }
    
 // APPROVE
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_FOUNDER')")
    public ResponseEntity<InvestmentResponse> approve(
            @PathVariable Long id,
            HttpServletRequest request) {

        String founderEmail = request.getHeader("X-User");

        return ResponseEntity.ok(service.approveInvestment(id, founderEmail));
    }

    // REJECT
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ROLE_FOUNDER')")
    public ResponseEntity<InvestmentResponse> reject(
            @PathVariable Long id,
            HttpServletRequest request) {

        String founderEmail = request.getHeader("X-User");

        return ResponseEntity.ok(service.rejectInvestment(id, founderEmail));
    }
    
    
    @PostMapping("/investment-requests")
    @PreAuthorize("hasAuthority('ROLE_FOUNDER')")
    public ResponseEntity<InvestorRequestResponse> sendRequest(
            @RequestBody InvestorRequestRequest request,
            HttpServletRequest httpRequest) {

        String founderEmail = httpRequest.getHeader("X-User");

        return ResponseEntity.ok(service.sendRequest(founderEmail, request));
    }
    
    @GetMapping("/investment-requests")
    @PreAuthorize("hasAuthority('ROLE_INVESTOR')")
    public ResponseEntity<List<InvestorRequestResponse>> getRequests(
            HttpServletRequest httpRequest) {

        String email = httpRequest.getHeader("X-User");

        return ResponseEntity.ok(service.getRequestsForInvestor(email));
    }
    
    @PutMapping("/investment-requests/respond/{id}")
    @PreAuthorize("hasAuthority('ROLE_INVESTOR')")
    public ResponseEntity<InvestorRequestResponse> respond(
            @PathVariable Long id,
            @RequestParam boolean accept,
            HttpServletRequest httpRequest) {

        String email = httpRequest.getHeader("X-User");

        return ResponseEntity.ok(service.respond(id, email, accept));
    }
}