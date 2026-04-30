package com.founderlink.userservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.founderlink.userservice.dto.UserMapper;
import com.founderlink.userservice.dto.UserRequest;
import com.founderlink.userservice.dto.UserResponse;
import com.founderlink.userservice.entity.Role;
import com.founderlink.userservice.entity.User;
import com.founderlink.userservice.event.NotificationEvent;
import com.founderlink.userservice.exception.UserNotFoundException;
import com.founderlink.userservice.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
	private final UserRepository userRepository;
	private final UserMapper userMapper;
	private final RabbitTemplate rabbitTemplate;
	
	
	@Override
	public UserResponse createProfile(String email, String roleHeader, UserRequest request) {

	    if (userRepository.findByEmail(email).isPresent()) {
	        throw new RuntimeException("Profile already exists");
	    }

	    User user = userMapper.toEntity(request);

	    user.setEmail(email);
	    user.setCreatedAt(LocalDateTime.now());

	    user.setRole(Role.valueOf(roleHeader));

	    User saved = userRepository.save(user);

	    sendEvent(
	        "USER_CREATED",
	        saved.getEmail(),
	        "Your profile has been created successfully",
	        saved.getId()
	    );

	    return userMapper.toDTO(saved);
	}
	
	@Override
	public UserResponse updateProfile(Long id, String email, UserRequest request) {

	    User fetchedUser = userRepository.findById(id)
	            .orElseThrow(() -> new UserNotFoundException("User Not Found"));

	    // OWNERSHIP CHECK
	    if (!fetchedUser.getEmail().equals(email)) {
	        throw new RuntimeException("You can update only your profile");
	    }

	    fetchedUser.setName(request.getName());
	    fetchedUser.setSkills(request.getSkills());
	    fetchedUser.setExperience(request.getExperience());
	    fetchedUser.setBio(request.getBio());
	    fetchedUser.setPortfolioLinks(request.getPortfolioLinks());

	    return userMapper.toDTO(userRepository.save(fetchedUser));
	}
	
	@Override
	public UserResponse viewProfile(Long id) {
		return userMapper.toDTO(userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User Not Found")));
	}
	
	@Override
	public List<UserResponse> getInvestors() {
	    return userRepository.findByRole(Role.ROLE_INVESTOR)
	            .stream()
	            .map(userMapper::toDTO)
	            .toList();
	}

	@Override
	public List<UserResponse> getCofounders() {
	    return userRepository.findByRole(Role.ROLE_COFOUNDER)
	            .stream()
	            .map(userMapper::toDTO)
	            .toList();
	}
	
	@Override
	public UserResponse getByEmail(String email) {
	    return userMapper.toDTO(
	        userRepository.findByEmail(email)
	            .orElseThrow(() -> new UserNotFoundException("User not found"))
	    );
	}
	
	private void sendEvent(String type, String email, String message, Long id) {
	    try {
	        NotificationEvent event = new NotificationEvent(type, email, message, id);

	        rabbitTemplate.convertAndSend(
	                "notification.exchange",
	                "notification.routing.key",
	                event
	        );
	    } catch (Exception e) {
	        System.out.println("Notification failed: " + e.getMessage());
	    }
	}
	
}
