package com.founderlink.notificationservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {

    private String type;      // USER_CREATED, INVESTMENT_ACCEPTED
    private String email;     // receiver
    private String message;   // message
    private Long userId;
}
