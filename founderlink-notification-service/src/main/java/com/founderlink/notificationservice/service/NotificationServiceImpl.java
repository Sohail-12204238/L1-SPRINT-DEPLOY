package com.founderlink.notificationservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.founderlink.notificationservice.entity.Notification;
import com.founderlink.notificationservice.exception.UnauthorizedException;
import com.founderlink.notificationservice.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

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