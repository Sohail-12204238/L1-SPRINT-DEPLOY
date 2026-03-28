package com.founderlink.userservice.dto;


import lombok.Data;

@Data
public class UserRequest {
	private String name;
	private String skills;
	private String experience;
	private String bio;
	private String portfolioLinks;
}
