package com.capgemini.notificationservice.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.capgemini.notificationservice.entity.Notification;
import com.capgemini.notificationservice.service.NotificationService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    // Get all notifications for a user
    @GetMapping()
    @PreAuthorize("hasAnyRole('ROLE_FOUNDER','ROLE_INVESTOR','ROLE_COFOUNDER')")
    public List<Notification> getNotifications(HttpServletRequest request) {

        String email = request.getHeader("X-User");

        return service.getNotificationsByEmail(email);
    }

    // Mark notification as read
    @PutMapping("/read/{id}")
    @PreAuthorize("hasAnyRole('ROLE_FOUNDER','ROLE_INVESTOR','ROLE_COFOUNDER')")
    public String markAsRead(@PathVariable Long id, HttpServletRequest request) {

        String email = request.getHeader("X-User");

        service.markAsRead(id, email);

        return "Notification marked as read";
    }
}