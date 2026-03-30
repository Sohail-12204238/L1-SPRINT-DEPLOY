package com.founderlink.notificationservice.service;

import java.util.List;

import com.founderlink.notificationservice.entity.Notification;

public interface NotificationService {

	List<Notification> getNotificationsByEmail(String email);
	
	void markAsRead(Long id, String email);
}
