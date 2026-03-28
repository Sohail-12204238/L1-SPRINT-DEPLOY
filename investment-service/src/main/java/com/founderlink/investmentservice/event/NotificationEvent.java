package com.founderlink.investmentservice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationEvent {
	private String type;
	private String email;
	private String message;
	private Long userId;
}
