package ru.isavelev76.userservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.isavelev76.userservice.entities.User;
import ru.isavelev76.userservice.entities.enums.UserStatus;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByFullName(String fullName);
    boolean existsByEmail(String email);

    boolean existsByFullName(String fullName);

    Optional<User> findByEmail(String email);

    Optional<User> findByIdAndStatus(UUID id, UserStatus status);

    @Query("select u from User u left join fetch u.roles where u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") UUID id);
}