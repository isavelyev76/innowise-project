package ru.isavelev76.userservice.responses;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public record AuthResponse(
        @JsonProperty("user")
        UserResponse userResponse,
        @JsonProperty("access_token")
        String accessToken,
        @JsonProperty("refresh_token")
        String refreshToken,
        String message
) {
}