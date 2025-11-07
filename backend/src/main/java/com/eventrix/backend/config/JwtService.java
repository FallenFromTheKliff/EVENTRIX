package com.eventrix.backend.config;

import com.eventrix.backend.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.*;

@Service
public class JwtService {
    private static final String SECRET_KEY =
            "YOUR256BITSECRETYOUR256BITSECRETYOUR256BITSECRET";

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    public String extractEmail(String token) {
        return Jwts.parserBuilder().setSigningKey(getSignKey()).build()
                .parseClaimsJws(token)
                .getBody().getSubject();
    }
    public String extractRole(String token) {
        return (String) Jwts.parserBuilder().setSigningKey(getSignKey()).build()
                .parseClaimsJws(token)
                .getBody().get("role");
    }
}
