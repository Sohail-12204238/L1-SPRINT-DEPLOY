package com.founderlink.userservice.service;


import java.util.List;

import com.founderlink.userservice.dto.UserRequest;
import com.founderlink.userservice.dto.UserResponse;

public interface UserService {
	
	UserResponse createProfile(String email, String roleHeader, UserRequest request);
	UserResponse updateProfile(Long id, String email, UserRequest request);
	UserResponse viewProfile(Long id);
	List<UserResponse> getInvestors();
	UserResponse getByEmail(String email);
}
