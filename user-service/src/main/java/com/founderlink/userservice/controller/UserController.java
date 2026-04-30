package com.founderlink.userservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.founderlink.userservice.dto.UserRequest;
import com.founderlink.userservice.dto.UserResponse;
import com.founderlink.userservice.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/users")
public class UserController {
	private final UserService userService;
	public UserController(UserService userService) {
		super();
		this.userService = userService;
	}
	
	@PostMapping
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<UserResponse> createProfile(
	        @Valid @RequestBody UserRequest request,
	        HttpServletRequest httpRequest) {

	    String email = httpRequest.getHeader("X-User");
	    String role = httpRequest.getHeader("X-Role");

	    return ResponseEntity.ok(userService.createProfile(email, role, request));
	}
	
	@PutMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<UserResponse> updateProfile(
	        @PathVariable Long id,
	        @Valid @RequestBody UserRequest request,
	        HttpServletRequest httpRequest) {

	    String email = httpRequest.getHeader("X-User");

	    return ResponseEntity.ok(userService.updateProfile(id, email, request));
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<UserResponse> viewProfile(@PathVariable Long id){
		return ResponseEntity.ok(userService.viewProfile(id));
	}
	
	@GetMapping("/investors")
	@PreAuthorize("hasAuthority('ROLE_FOUNDER') or hasAuthority('ROLE_INVESTOR')")
	public ResponseEntity<List<UserResponse>> getInvestors() {
	    return ResponseEntity.ok(userService.getInvestors());
	}

	@GetMapping("/cofounders")
	@PreAuthorize("hasAuthority('ROLE_FOUNDER') or hasAuthority('ROLE_COFOUNDER')")
	public ResponseEntity<List<UserResponse>> getCofounders() {
	    return ResponseEntity.ok(userService.getCofounders());
	}
	
	@GetMapping("/email/{email}")
	@PreAuthorize("hasAuthority('ROLE_FOUNDER') or hasAuthority('ROLE_INVESTOR')")
	public ResponseEntity<UserResponse> getByEmail(@PathVariable String email) {
	    return ResponseEntity.ok(userService.getByEmail(email));
	}
}
