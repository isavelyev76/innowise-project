package ru.isavelev76.userservice.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import ru.isavelev76.userservice.requests.groups.OnLoginByEmail;
import ru.isavelev76.userservice.requests.groups.OnRegister;

/**
 * @author Ilya Savelyev
 * @since 03.12.2025
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthRequest {
        @NotBlank(message = "Username is required", groups = OnRegister.class)
        @Size(min = 3, max = 100, message = "Username must be between 3 and 30 characters", groups = OnRegister.class)
        private String fullName;

        @NotBlank(message = "Email is required", groups = {OnRegister.class, OnLoginByEmail.class})
        @Email(message = "Invalid email format", groups = {OnRegister.class, OnLoginByEmail.class})
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @NotBlank(message = "Confirm Password is required", groups = OnRegister.class)
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String confirmPassword;
}