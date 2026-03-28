package com.capgemini.notificationservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.capgemini.notificationservice.entity.Notification;
import com.capgemini.notificationservice.exception.UnauthorizedException;
import com.capgemini.notificationservice.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificatioServiceImpl implements NotificationService {

    private final NotificationRepository repository;

    @Override
    public List<Notification> getNotificationsByEmail(String email) {
        return repository.findByUserEmail(email);
    }

    @Override
    public void markAsRead(Long id, String email) {
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUserEmail().equals(email)) {
            throw new UnauthorizedException("Not allowed");
        }

        notification.setRead(true);
        repository.save(notification);
    }

}