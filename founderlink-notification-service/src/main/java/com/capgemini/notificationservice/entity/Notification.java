package com.capgemini.notificationservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String userEmail;

    private String message;

    private String type; // USER_CREATED, INVESTMENT_ACCEPTED, etc.

    private boolean isRead;

    private String status; // SENT / FAILED

    private LocalDateTime createdAt;
}