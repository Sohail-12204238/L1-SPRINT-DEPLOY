package com.founderlink.userservice.event;


import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationEvent {
    private String type;
    private String email;
    private String message;
    private Long referenceId;
}
