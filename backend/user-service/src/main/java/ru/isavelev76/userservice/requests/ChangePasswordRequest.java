package ru.isavelev76.userservice.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "Old password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String oldPassword,
        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String newPassword,
        @NotBlank(message = "Confirm password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String confirmPassword
) {}