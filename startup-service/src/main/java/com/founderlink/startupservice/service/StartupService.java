package com.founderlink.startupservice.service;

import java.util.List;

import com.founderlink.startupservice.dto.StartupRequest;
import com.founderlink.startupservice.dto.StartupResponse;

public interface StartupService {
	StartupResponse createStartup(String founderEmail, StartupRequest request);
	StartupResponse getStartupById(Long id);
	StartupResponse updateStartupById(Long id, String email, StartupRequest request);
	List<StartupResponse> getAllStartups();
	void deleteStartupById(Long id, String email);
	List<StartupResponse> getStartupsByFounder(String founderEmail);
}
