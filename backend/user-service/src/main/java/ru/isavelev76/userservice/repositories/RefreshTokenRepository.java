package ru.isavelev76.userservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isavelev76.userservice.entities.RefreshToken;
import ru.isavelev76.userservice.entities.User;


import java.util.Optional;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 08.11.2025
 */

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByUserId(UUID userId);
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}
