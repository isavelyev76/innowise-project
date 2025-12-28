package ru.isavelev76.userservice.requests;

import jakarta.validation.constraints.NotBlank;

/**
 * @author Ilya Savelyev
 * @since 09.11.2025
 */

public record RefreshRequest(
        @NotBlank(message = "Refresh token is required")
        String token
) {
}
