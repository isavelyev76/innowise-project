package ru.isavelev76.orderservice.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ru.isavelev76.orderservice.config.AppProperties;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@RequiredArgsConstructor
@Component
public class JWTUtil {
    private final AppProperties appProperties;

    public List<String> getRoles(DecodedJWT jwt) {
        return jwt.getClaim("roles").asList(String.class);
    }

    public UUID getUserIdFromJWT(DecodedJWT jwt) {
        return UUID.fromString(jwt.getSubject());
    }

    public DecodedJWT verifyToken(String token) {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(appProperties.secret()))
                .withIssuer("isavelev76")
                .build();
        return verifier.verify(token);
    }

    public boolean isTokenExpired(DecodedJWT jwt) {
        return jwt.getExpiresAt().before(new Date());
    }
}