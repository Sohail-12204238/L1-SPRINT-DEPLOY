package com.founderlink.startupservice.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.founderlink.startupservice.dto.StartupMapper;
import com.founderlink.startupservice.dto.StartupRequest;
import com.founderlink.startupservice.dto.StartupResponse;
import com.founderlink.startupservice.entity.Startup;
import com.founderlink.startupservice.exception.StartupNotFoundException;
import com.founderlink.startupservice.repository.StartupRepository;

@Service
public class StartupServiceImpl implements StartupService{
	
	private final StartupMapper mapper;
	private final StartupRepository repository;
	public StartupServiceImpl(StartupMapper mapper, StartupRepository repository) {
		this.mapper = mapper;
		this.repository = repository;
	}

	@Override
	public StartupResponse createStartup(String founderEmail, StartupRequest request) {

	    Startup startup = mapper.toEntity(request);

	    startup.setFounderEmail(founderEmail);
	    startup.setCreatedAt(LocalDateTime.now());

	    Startup saved = repository.save(startup);

	    return mapper.toDTO(saved);
	}


	@Override
	public StartupResponse getStartupById(Long id) {
		return mapper.toDTO(repository.findById(id).orElseThrow(() -> new StartupNotFoundException("Startup Not Found")));
	}

	@Override
	public StartupResponse updateStartupById(Long id, String email, StartupRequest request) {

	    Startup existing = repository.findById(id)
	            .orElseThrow(() -> new StartupNotFoundException("Startup Not Found"));

	    // 🔒 OWNER VALIDATION
	    if (!existing.getFounderEmail().equals(email)) {
	        throw new RuntimeException("You are not allowed to update this startup");
	    }

	    existing.setName(request.getName());
	    existing.setDescription(request.getDescription());
	    existing.setIndustry(request.getIndustry());
	    existing.setProblemStatement(request.getProblemStatement());
	    existing.setSolution(request.getSolution());
	    existing.setFundingGoal(request.getFundingGoal());
	    existing.setStage(request.getStage());

	    return mapper.toDTO(repository.save(existing)); // ✅ FIXED
	}

	@Override
	public List<StartupResponse> getAllStartups() {
		return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
	}

	@Override
	public void deleteStartupById(Long id, String email) {

	    Startup existing = repository.findById(id)
	            .orElseThrow(() -> new StartupNotFoundException("Startup Not Found"));

	    // 🔒 OWNER VALIDATION
	    if (!existing.getFounderEmail().equals(email)) {
	        throw new RuntimeException("You are not allowed to delete this startup");
	    }

	    repository.delete(existing);
	}
	
	@Override
    public List<StartupResponse> getStartupsByFounder(String founderEmail) {

        List<Startup> startups = repository.findByFounderEmail(founderEmail);
        return startups.stream().map(mapper::toDTO).collect(Collectors.toList());
    }
}
