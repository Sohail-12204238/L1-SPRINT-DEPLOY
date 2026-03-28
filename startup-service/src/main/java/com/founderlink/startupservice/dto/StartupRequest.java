package com.founderlink.startupservice.dto;

import com.founderlink.startupservice.entity.StartupStage;

import lombok.Data;

@Data
public class StartupRequest {
	private String name;
    private String description;
    private String industry;
    private String problemStatement;
    private String solution;
    private Double fundingGoal;
    private StartupStage stage;
}
