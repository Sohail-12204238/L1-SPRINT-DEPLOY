package com.capgemini.notificationservice.consumer;

import java.time.LocalDateTime;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.capgemini.notificationservice.dto.NotificationEvent;
import com.capgemini.notificationservice.entity.Notification;
import com.capgemini.notificationservice.repository.NotificationRepository;
import com.capgemini.notificationservice.service.EmailService;

import lombok.RequiredArgsConstructor;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationRepository repository;
    private final EmailService emailService;   

    @RabbitListener(queues = "notification.queue")
    public void consume(NotificationEvent event) {

        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .userEmail(event.getEmail())
                .message(event.getMessage())
                .type(event.getType())
                .isRead(false)
                .status("SENT")
                .createdAt(LocalDateTime.now())
                .build();

        repository.save(notification);

        emailService.sendEmail(
                event.getEmail(),
                "FounderLink Notification: " + event.getType(),
                event.getMessage()
        );

        System.out.println("✅ Notification processed: " + event);
    }
}