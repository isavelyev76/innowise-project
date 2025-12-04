package ru.isavelev76.userservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isavelev76.userservice.entities.User;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByFullName(String fullName);
    boolean existsByEmail(String email);

    boolean existsByFullName(String fullName);

    Optional<User> findByEmail(String email);}
