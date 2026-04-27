package com.founderlink.investmentservice.dto;


import org.springframework.stereotype.Component;

import com.founderlink.investmentservice.entity.InvestorRequest;

@Component
public class InvestorRequestMapper {

    public InvestorRequestResponse toDTO(InvestorRequest entity) {
        return InvestorRequestResponse.builder()
                .id(entity.getId())
                .startupId(entity.getStartupId())
                .founderEmail(entity.getFounderEmail())
                .investorEmail(entity.getInvestorEmail())
                .proposedAmount(entity.getProposedAmount())
                .status(entity.getStatus())
                .message(entity.getMessage())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}