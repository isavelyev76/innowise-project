package ru.isavelev76.userservice.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ru.isavelev76.userservice.config.AppProperties;
import ru.isavelev76.userservice.entities.User;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 02.12.2025
 */

@RequiredArgsConstructor
@Component
public class JWTUtil {
    private final AppProperties appProperties;

    public String generateToken(User user) {
        Date expirationDate = Date.from(ZonedDateTime.now().plusMinutes(appProperties.expiresIn()).toInstant());

        return JWT.create()
                .withSubject(user.getId().toString())
                //.withJWTId(UUID.randomUUID().toString())
                .withIssuedAt(new Date())
                .withExpiresAt(expirationDate)
                .withIssuer("isavelev76")
                .sign(Algorithm.HMAC256(appProperties.secret()));
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
