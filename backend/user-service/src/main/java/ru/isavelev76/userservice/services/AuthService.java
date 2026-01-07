package ru.isavelev76.userservice.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.isavelev76.userservice.entities.Role;
import ru.isavelev76.userservice.entities.User;
import ru.isavelev76.userservice.entities.enums.RoleName;
import ru.isavelev76.userservice.entities.enums.UserStatus;
import ru.isavelev76.userservice.exceptions.RefreshTokenOrCredentialsNotValidException;
import ru.isavelev76.userservice.exceptions.UserAlreadyExistsException;
import ru.isavelev76.userservice.mappers.AuthMapper;
import ru.isavelev76.userservice.repositories.RoleRepository;
import ru.isavelev76.userservice.repositories.UserRepository;
import ru.isavelev76.userservice.requests.AuthRequest;
import ru.isavelev76.userservice.responses.AuthResponse;
import ru.isavelev76.userservice.security.JWTUtil;

import java.util.Set;

/**
 * @author Ilya Savelyev
 * @since 03.12.2025
 */

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final AuthMapper authMapper;
    private final JWTUtil jwtUtil;

    public AuthResponse register(AuthRequest registerRequest) {

        User user = createUser(authMapper.toEntity(registerRequest));
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user);

        AuthResponse response = authMapper.toAuthResponse(user, accessToken, refreshToken, "User registered successfully");
        log.info("New user registered: {}", user.getEmail());

        return response;
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("User with this email is already exist");
        } else if (userRepository.existsByFullName(user.getFullName())) {
            throw new UserAlreadyExistsException("User with this username is already exist");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        Role customerRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new IllegalStateException("Default role CUSTOMER not found"));
        user.setRoles(Set.of(customerRole));
        user.setStatus(UserStatus.ACTIVE);

        return userRepository.save(user);
    }

    public AuthResponse loginByEmail(AuthRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RefreshTokenOrCredentialsNotValidException("User not found"));

        return getAuthResponseResponseEntity(loginRequest, user);
    }

    private AuthResponse getAuthResponseResponseEntity(AuthRequest loginRequest, User user) {
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new RefreshTokenOrCredentialsNotValidException("Invalid credentials");
        }

        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user);

        return authMapper.toAuthResponse(user, accessToken, refreshToken, "Login successful");
    }
}
