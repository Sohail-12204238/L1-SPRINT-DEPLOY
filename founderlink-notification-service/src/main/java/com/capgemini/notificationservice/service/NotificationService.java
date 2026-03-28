package com.capgemini.notificationservice.service;

import java.util.List;

import com.capgemini.notificationservice.entity.Notification;

public interface NotificationService {

	List<Notification> getNotificationsByEmail(String email);
	
	void markAsRead(Long id, String email);
}
