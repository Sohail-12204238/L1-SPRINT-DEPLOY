package com.founderlink.investmentservice.dto;


import lombok.Data;

@Data
public class InvestmentRequest {

    private Long startupId;
    private Double amount;
}
