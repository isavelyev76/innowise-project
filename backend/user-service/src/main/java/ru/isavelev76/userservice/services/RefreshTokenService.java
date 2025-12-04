package ru.isavelev76.userservice.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.isavelev76.userservice.config.AppProperties;
import ru.isavelev76.userservice.entities.RefreshToken;
import ru.isavelev76.userservice.entities.User;
import ru.isavelev76.userservice.exceptions.RefreshTokenOrCredentialsNotValidException;
import ru.isavelev76.userservice.mappers.AuthMapper;
import ru.isavelev76.userservice.repositories.RefreshTokenRepository;
import ru.isavelev76.userservice.requests.RefreshRequest;
import ru.isavelev76.userservice.responses.AuthResponse;
import ru.isavelev76.userservice.security.JWTUtil;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 08.11.2025
 */

@RequiredArgsConstructor
@Service
public class RefreshTokenService {

    private final AppProperties appProperties;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthMapper authMapper;
    private final JWTUtil jwtUtil;

    @Transactional
    public AuthResponse refreshToken (RefreshRequest refreshRequest) {
        Optional<RefreshToken> token = findByToken(refreshRequest.token());

        if (token.isEmpty() || isRefreshExpired(token.get())) {
            throw new RefreshTokenOrCredentialsNotValidException("Invalid refresh token");
        }

        User user = token.get().getUser();
        String newAccessToken = jwtUtil.generateToken(user);
        deleteByUser(user);
        String newRefreshToken = createRefreshToken(user);

        return authMapper.toAuthResponse(user, newAccessToken, newRefreshToken, "Access token refreshed");
    }

    @Transactional
    public String createRefreshToken(User user) {
        RefreshToken refreshToken = refreshTokenRepository.findByUserId(user.getId())
                .orElse(new RefreshToken());

        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiresAt(Instant.now().plus(appProperties.refreshExpiresIn(), ChronoUnit.MINUTES));

        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }

    @Transactional(readOnly = true)
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional(readOnly = true)
    public boolean isRefreshExpired(RefreshToken token) {
        return token.getExpiresAt().isBefore(Instant.now());
    }

    @Transactional
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
