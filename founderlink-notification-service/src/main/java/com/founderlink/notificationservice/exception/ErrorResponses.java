package com.founderlink.notificationservice.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ErrorResponses {

	private LocalDateTime localDateTime;
	private int status;
	private String error;
	private String message;
	private String path;
	
}
