package ru.isavelev76.userservice.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.isavelev76.userservice.requests.ChangePasswordRequest;
import ru.isavelev76.userservice.requests.UserUpdateFullNameRequest;
import ru.isavelev76.userservice.responses.UserResponse;
import ru.isavelev76.userservice.security.UserDetailsImpl;
import ru.isavelev76.userservice.services.UserService;

/**
 * @author Ilya Savelyev
 * @since 08.12.2025
 */

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    @SecurityRequirement(name = "JWT")
    public ResponseEntity<UserResponse> getMe(
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(userService.getMe(user.getId()));
    }

    @PutMapping("/me/fullname")
    @SecurityRequirement(name = "JWT")
    public ResponseEntity<UserResponse> updateFullName(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestBody UserUpdateFullNameRequest request) {
        return ResponseEntity.ok(userService.updateFullName(user.getId(), request));
    }

    @PatchMapping("/me/deactivate")
    @SecurityRequirement(name = "JWT")
    public ResponseEntity<Void> deactivate(
            @AuthenticationPrincipal UserDetailsImpl user) {
        userService.deactivate(user.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/me/activate")
    @SecurityRequirement(name = "JWT")
    public ResponseEntity<Void> activate(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        userService.activate(userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/password")
    @SecurityRequirement(name = "JWT")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody @Valid ChangePasswordRequest request
    ) {
        userService.changePassword(userDetails.getId(), request);
        return ResponseEntity.noContent().build();
    }
}
