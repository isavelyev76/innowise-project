package ru.isavelev76.userservice.responses;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String fullName,
        String email,
        List<String> roles,
        Instant createdAt,
        Instant updatedAt
) {
}
