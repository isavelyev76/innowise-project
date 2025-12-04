package ru.isavelev76.userservice.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.isavelev76.userservice.requests.AuthRequest;
import ru.isavelev76.userservice.requests.RefreshRequest;
import ru.isavelev76.userservice.requests.groups.OnLoginByEmail;
import ru.isavelev76.userservice.requests.groups.OnRegister;
import ru.isavelev76.userservice.responses.AuthResponse;
import ru.isavelev76.userservice.services.AuthService;
import ru.isavelev76.userservice.services.RefreshTokenService;

/**
 * @author Ilya Savelyev
 * @since 03.12.2025
 */

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginByEmail(@Validated(OnLoginByEmail.class) @RequestBody AuthRequest loginRequest) {
        AuthResponse response = authService.loginByEmail(loginRequest);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Validated(OnRegister.class) @RequestBody AuthRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshRequest refreshRequest) {
        AuthResponse response = refreshTokenService.refreshToken(refreshRequest);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
