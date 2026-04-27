package com.founderlink.userservice.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;


import static org.mockito.ArgumentMatchers.any;
import org.mockito.*;

import org.springframework.amqp.rabbit.core.RabbitTemplate;

import com.founderlink.userservice.dto.UserMapper;
import com.founderlink.userservice.dto.UserRequest;
import com.founderlink.userservice.dto.UserResponse;
import com.founderlink.userservice.entity.Role;
import com.founderlink.userservice.entity.User;
import com.founderlink.userservice.exception.UserNotFoundException;

import com.founderlink.userservice.repository.UserRepository;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private UserRequest request;
    private UserResponse response;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@mail.com");
        user.setRole(Role.ROLE_INVESTOR);
        user.setCreatedAt(LocalDateTime.now());

        request = new UserRequest();
        request.setName("Test User");

        response = new UserResponse();
        response.setEmail("test@mail.com");
    }

    // CREATE PROFILE SUCCESS
    @Test
    void testCreateProfile_Success() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.empty());
        when(userMapper.toEntity(request)).thenReturn(user);
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toDTO(user)).thenReturn(response);

        UserResponse result = userService.createProfile("test@mail.com", "ROLE_INVESTOR", request);

        assertNotNull(result);
        assertEquals("test@mail.com", result.getEmail());

        
    }

    // CREATE PROFILE - ALREADY EXISTS
    @Test
    void testCreateProfile_AlreadyExists() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () ->
                userService.createProfile("test@mail.com", "ROLE_INVESTOR", request));
    }

    // UPDATE PROFILE SUCCESS
    @Test
    void testUpdateProfile_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toDTO(user)).thenReturn(response);

        UserResponse result = userService.updateProfile(1L, "test@mail.com", request);

        assertNotNull(result);
        verify(userRepository, times(1)).save(user);
    }

    // UPDATE PROFILE - USER NOT FOUND
    @Test
    void testUpdateProfile_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () ->
                userService.updateProfile(1L, "test@mail.com", request));
    }

    // UPDATE PROFILE - WRONG USER
    @Test
    void testUpdateProfile_WrongUser() {
        user.setEmail("other@mail.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () ->
                userService.updateProfile(1L, "test@mail.com", request));
    }

    // VIEW PROFILE
    @Test
    void testViewProfile_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toDTO(user)).thenReturn(response);

        UserResponse result = userService.viewProfile(1L);

        assertNotNull(result);
    }

    // VIEW PROFILE NOT FOUND
    @Test
    void testViewProfile_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () ->
                userService.viewProfile(1L));
    }

    // GET INVESTORS
    @Test
    void testGetInvestors() {
        List<User> users = List.of(user);

        when(userRepository.findByRole(Role.ROLE_INVESTOR)).thenReturn(users);
        when(userMapper.toDTO(user)).thenReturn(response);

        List<UserResponse> result = userService.getInvestors();

        assertEquals(1, result.size());
    }

    // GET BY EMAIL
    @Test
    void testGetByEmail_Success() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.of(user));
        when(userMapper.toDTO(user)).thenReturn(response);

        UserResponse result = userService.getByEmail("test@mail.com");

        assertNotNull(result);
    }

    // GET BY EMAIL NOT FOUND
    @Test
    void testGetByEmail_NotFound() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () ->
                userService.getByEmail("test@mail.com"));
    }
    
 // INVALID ROLE TEST
    @Test
    void testCreateProfile_InvalidRole() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(Optional.empty());
        when(userMapper.toEntity(request)).thenReturn(user);

        assertThrows(IllegalArgumentException.class, () ->
                userService.createProfile("test@mail.com", "INVALID_ROLE", request));
    }
    
    
 // EMPTY INVESTORS LIST
    @Test
    void testGetInvestors_Empty() {
        when(userRepository.findByRole(Role.ROLE_INVESTOR)).thenReturn(List.of());

        List<UserResponse> result = userService.getInvestors();

        assertTrue(result.isEmpty());
    }
    
 
}