package com.founderlink.investmentservice.dto;


import java.time.LocalDateTime;

import com.founderlink.investmentservice.entity.RequestStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class InvestorRequestResponse {

    public InvestorRequestResponse() {
	}

	private Long id;

    private Long startupId;

    private String founderEmail;

    private String investorEmail;

    private Double proposedAmount;

    private RequestStatus status;

    private LocalDateTime createdAt;
}
