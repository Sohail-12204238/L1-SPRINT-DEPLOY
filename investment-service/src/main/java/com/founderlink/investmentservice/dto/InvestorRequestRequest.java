package com.founderlink.investmentservice.dto;


import lombok.Data;

@Data
public class InvestorRequestRequest {

    private Long startupId;

    private String investorEmail;

    private Double proposedAmount;
}
