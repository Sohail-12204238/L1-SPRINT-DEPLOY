package com.founderlink.investmentservice.dto;


import com.founderlink.investmentservice.entity.InvestmentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestmentResponse {

    private Long id;
    private Long startupId;
    private String investorEmail;
    private Double amount;
    private InvestmentStatus status;
}
