package ru.isavelev76.userservice.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.isavelev76.userservice.entities.enums.UserStatus;

public record AuthResponse(
        @JsonProperty("user")
        UserResponse userResponse,
        @JsonProperty("access_token")
        String accessToken,
        @JsonProperty("refresh_token")
        String refreshToken,
        UserStatus status,
        String message
) {
}