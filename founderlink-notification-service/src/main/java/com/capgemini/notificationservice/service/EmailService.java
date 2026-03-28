package com.capgemini.notificationservice.service;


import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String message) {

        try {
            SimpleMailMessage mail = new SimpleMailMessage();

            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(
                    "Hello,\n\n" +
                    message +
                    "\n\nRegards,\nFounderLink Team"
            );

            mailSender.send(mail);

            System.out.println("✅ Email sent to: " + to);

        } catch (Exception e) {
            System.out.println("❌ Email failed: " + e.getMessage());
        }
    }
}
