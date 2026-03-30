package com.founderlink.startupservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.founderlink.startupservice.dto.StartupRequest;
import com.founderlink.startupservice.dto.StartupResponse;
import com.founderlink.startupservice.service.StartupService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/startups")
public class StartupController {
	private final StartupService service;
	public StartupController(StartupService service) {
		this.service = service;
	}
	
	@PostMapping
	@PreAuthorize("hasAuthority('ROLE_FOUNDER')")
	public ResponseEntity<StartupResponse> createStartup(
	        @Valid @RequestBody StartupRequest request,
	        HttpServletRequest httpRequest) {

	    String email = httpRequest.getHeader("X-User");

	    return ResponseEntity.ok(service.createStartup(email, request));
	}

	@GetMapping("/{id}")
    public ResponseEntity<StartupResponse> getStartup(@PathVariable Long id) {
        return ResponseEntity.ok(service.getStartupById(id));
    }

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/all")
    public ResponseEntity<List<StartupResponse>> getAll() {
        return ResponseEntity.ok(service.getAllStartups());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_FOUNDER')")
    public ResponseEntity<StartupResponse> update(
            @PathVariable Long id,
            @RequestBody StartupRequest request,
            HttpServletRequest httpRequest) {

        String email = httpRequest.getHeader("X-User");

        return ResponseEntity.ok(service.updateStartupById(id, email, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_FOUNDER')")
    public ResponseEntity<String> delete(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {

        String email = httpRequest.getHeader("X-User");

        service.deleteStartupById(id, email);
        return ResponseEntity.ok("Deleted successfully");
    }
    
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ROLE_FOUNDER')")
    public ResponseEntity<List<StartupResponse>> getMyStartups(HttpServletRequest request) {
        String email = request.getHeader("X-User");
        return ResponseEntity.ok(service.getStartupsByFounder(email));
    }
	
}
