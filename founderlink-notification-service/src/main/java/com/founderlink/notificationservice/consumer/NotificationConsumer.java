package com.founderlink.notificationservice.consumer;

import java.time.LocalDateTime;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.founderlink.notificationservice.dto.NotificationEvent;
import com.founderlink.notificationservice.entity.Notification;
import com.founderlink.notificationservice.repository.NotificationRepository;
import com.founderlink.notificationservice.service.EmailService;

import lombok.RequiredArgsConstructor;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationRepository repository;
    private final EmailService emailService;   

    @RabbitListener(queues = "notification.queue")
    public void consume(NotificationEvent event) {
    	
    	System.out.println("🔥 Received event: " + event);

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