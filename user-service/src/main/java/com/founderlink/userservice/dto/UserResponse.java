package com.founderlink.userservice.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserResponse {
	private Long id;
	private String name;
	private String email;
	private String skills;
	private String experience;
	private String bio;
	private String portfolioLinks;
	private LocalDateTime createdAt;
}
