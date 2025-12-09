package ru.isavelev76.userservice.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.isavelev76.userservice.entities.User;
import ru.isavelev76.userservice.entities.enums.UserStatus;
import ru.isavelev76.userservice.exceptions.PasswordMatchException;
import ru.isavelev76.userservice.mappers.UserMapper;
import ru.isavelev76.userservice.repositories.UserRepository;
import ru.isavelev76.userservice.requests.ChangePasswordRequest;
import ru.isavelev76.userservice.requests.UserUpdateFullNameRequest;
import ru.isavelev76.userservice.responses.UserResponse;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 08.12.2025
 */

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserResponse getMe(UUID userId) {
        User user = getActiveUser(userId);
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateFullName(UUID userId, UserUpdateFullNameRequest request) {
        User user = getActiveUser(userId);

        user.setFullName(request.fullName());

        return userMapper.toResponse(user);
    }

    @Transactional
    public void deactivate(UUID userId) {
        User user = getActiveUser(userId);
        user.setStatus(UserStatus.DEACTIVATED);
    }

    @Transactional
    public void activate(UUID userId) {
        User user = userRepository.findByIdAndStatus(userId, UserStatus.DEACTIVATED)
                .orElseThrow(() -> new EntityNotFoundException("User not found or already active"));

        user.setStatus(UserStatus.ACTIVE);
    }

    private User getActiveUser(UUID id) {
        return userRepository.findByIdAndStatus(id, UserStatus.ACTIVE)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = getActiveUser(userId);

        if (!passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new PasswordMatchException("Passwords do not match");
        }

        String newHash = passwordEncoder.encode(request.newPassword());
        user.setPasswordHash(newHash);
        // TODO: сделать отдельный запрос
        userRepository.save(user);
    }
}
