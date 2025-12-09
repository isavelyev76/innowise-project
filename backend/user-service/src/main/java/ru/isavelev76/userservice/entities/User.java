package ru.isavelev76.userservice.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import ru.isavelev76.userservice.entities.enums.UserStatus;

import java.util.*;

/**
 * @author Ilya Savelyev
 * @since 02.12.2025
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User extends AuditingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    UUID id;

    @Column(name = "email", unique = true, nullable = false)
    String email;

    @Column(name = "full_name", nullable = false)
    String fullName;

    @Column(name = "password_hash", nullable = false)
    String passwordHash;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Address> addresses = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    Set<Role> roles = new HashSet<>();
}
