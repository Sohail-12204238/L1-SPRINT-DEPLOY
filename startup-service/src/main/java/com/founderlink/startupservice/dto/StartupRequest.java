package com.founderlink.startupservice.dto;

import com.founderlink.startupservice.entity.StartupStage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class StartupRequest {

    @NotBlank(message = "Startup name is required")
    @Size(min = 3, max = 100, message = "Startup name must be between 3 and 100 characters")
    private String name;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;

    @NotBlank(message = "Industry is required")
    private String industry;

    @NotBlank(message = "Problem statement is required")
    @Size(min = 10, message = "Problem statement must be at least 10 characters")
    private String problemStatement;

    @NotBlank(message = "Solution is required")
    @Size(min = 10, message = "Solution must be at least 10 characters")
    private String solution;

    @NotNull(message = "Funding goal is required")
    @Positive(message = "Funding goal must be greater than 0")
    private Double fundingGoal;

    @NotNull(message = "Startup stage is required")
    private StartupStage stage;
}