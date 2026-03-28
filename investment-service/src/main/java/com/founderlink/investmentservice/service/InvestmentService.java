package com.founderlink.investmentservice.service;


import com.founderlink.investmentservice.dto.InvestmentRequest;
import com.founderlink.investmentservice.dto.InvestorRequestRequest;
import com.founderlink.investmentservice.dto.InvestorRequestResponse;
import com.founderlink.investmentservice.dto.InvestmentResponse;

import java.util.List;

public interface InvestmentService {

    // ===================== INVESTMENT =====================

    InvestmentResponse createInvestment(String investorEmail, InvestmentRequest request);

    List<InvestmentResponse> getByInvestorEmail(String email);

    List<InvestmentResponse> getByStartupWithOwnerCheck(Long startupId, String founderEmail);

    InvestmentResponse approveInvestment(Long id, String founderEmail);

    InvestmentResponse rejectInvestment(Long id, String founderEmail);


    // ===================== INVESTOR REQUEST =====================

    InvestorRequestResponse sendRequest(String founderEmail, InvestorRequestRequest request);

    List<InvestorRequestResponse> getRequestsForInvestor(String email);

    InvestorRequestResponse respond(Long id, String investorEmail, boolean accept);
    
    // ======================NOTIFICATION SERVICE ====================
    
    void sendEvent(String type, String email, String message, Long userId);
}