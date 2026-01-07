package ru.isavelev76.userservice.responses;

import ru.isavelev76.userservice.entities.enums.UserStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String fullName,
        String email,
        UserStatus status,
        List<String> roles,
        Instant createdAt,
        Instant updatedAt
) {
}
