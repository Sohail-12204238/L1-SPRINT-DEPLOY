package com.founderlink.investmentservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InvestorRequestRequest {

    @NotNull(message = "Startup ID is required")
    private Long startupId;

    @NotBlank(message = "Investor email is required")
    @Email(message = "Invalid email format")
    private String investorEmail;

    @NotNull(message = "Proposed amount is required")
    @Min(value = 1, message = "Proposed amount must be greater than 0")
    private Double proposedAmount;

    private String message;
}