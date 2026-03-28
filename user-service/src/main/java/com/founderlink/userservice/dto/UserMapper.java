package com.founderlink.userservice.dto;


import org.springframework.stereotype.Component;

import com.founderlink.userservice.entity.User;

@Component
public class UserMapper {
	public User toEntity(UserRequest request) {
		User user = new User();
		user.setName(request.getName());
		user.setSkills(request.getSkills());
		user.setExperience(request.getExperience());
		user.setBio(request.getBio());
		user.setPortfolioLinks(request.getPortfolioLinks());
		return user;
	}
	
	public UserResponse toDTO(User user) {
		UserResponse response = new UserResponse();
		response.setId(user.getId());
		response.setName(user.getName());
		response.setEmail(user.getEmail());
		response.setSkills(user.getSkills());
		response.setExperience(user.getExperience());
		response.setBio(user.getBio());
		response.setPortfolioLinks(user.getPortfolioLinks());
		response.setCreatedAt(user.getCreatedAt());
		return response;
	}
	
}
