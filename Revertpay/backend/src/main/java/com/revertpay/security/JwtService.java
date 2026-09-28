package com.revertpay.security;

import com.revertpay.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;
    public SecretKey getSecretKey(){
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {

        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60))
                .signWith(getSecretKey())
                .compact();
    }
    public Claims extractClaims(String token){
        Claims claim=Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claim;


    }
    public Long extractUserId(String token){
        Claims claim=extractClaims(token);
        return Long.parseLong(claim.getSubject());
    }
    public boolean isTokenValid(String token) {
        try {

            Claims claim = extractClaims(token);

            System.out.println("JWT SUBJECT: " + claim.getSubject());
            System.out.println("JWT EXPIRATION: " + claim.getExpiration());
            System.out.println("CURRENT TIME: " + new Date());

            return claim.getExpiration().after(new Date());

        } catch (Exception e) {

            System.out.println("========== JWT ERROR ==========");
            e.printStackTrace();
            System.out.println("===============================");

            return false;
        }
    }
}