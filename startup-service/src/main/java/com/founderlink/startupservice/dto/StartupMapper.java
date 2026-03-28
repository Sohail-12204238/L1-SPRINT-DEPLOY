package com.founderlink.startupservice.dto;

import org.springframework.stereotype.Component;

import com.founderlink.startupservice.entity.Startup;

@Component
public class StartupMapper {
	public Startup toEntity(StartupRequest request) {
		return Startup.builder()
				.name(request.getName())
				.description(request.getDescription())
				.industry(request.getIndustry())
				.problemStatement(request.getProblemStatement())
				.solution(request.getSolution())
				.fundingGoal(request.getFundingGoal())
				.stage(request.getStage())
				.build();
	}
	
	public StartupResponse toDTO(Startup startup) {
		return StartupResponse.builder()
				.id(startup.getId())
				.name(startup.getName())
				.description(startup.getDescription())
				.industry(startup.getIndustry())
				.problemStatement(startup.getProblemStatement())
				.solution(startup.getSolution())
				.fundingGoal(startup.getFundingGoal())
				.stage(startup.getStage())
				.founderEmail(startup.getFounderEmail())
				.build();
	}
}
