package com.founderlink.authservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.founderlink.authservice.entity.Role;
import com.founderlink.authservice.entity.User;

@Service
public class JwtService {

	@Value("${jwt.secret}")
	private String secret;

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())

                .claim("role", user.getRoles()
                        .stream()
                        .findFirst()
                        .map(Role::getName)
                        .orElse("ROLE_USER"))

                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(getSignKey())
                .compact();
    }

    public String generateRefreshToken(String username) {
		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // 7 days expiry
				.signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
	}

	public String getUsernameFromToken(String token) {
		return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody().getSubject();
	}

	public boolean isTokenExpired(String token) {
		return getClaimsFromToken(token).getExpiration().before(new Date());
	}

	private Claims getClaimsFromToken(String token) {
		return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody();
	}

	public String getRoleFromToken(String token) {
		return (String) getClaimsFromToken(token).get("role");
	}
}
