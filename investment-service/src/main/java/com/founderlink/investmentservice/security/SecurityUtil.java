package com.founderlink.investmentservice.security;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    public String getCurrentUser(HttpServletRequest request) {
        return request.getHeader("X-User");
    }

    public String getCurrentRole(HttpServletRequest request) {
        return request.getHeader("X-Role");
    }

    public boolean isAdmin(HttpServletRequest request) {
        return "ROLE_ADMIN".equals(getCurrentRole(request));
    }
}
