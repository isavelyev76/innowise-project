package ru.isavelev76.userservice.entities;

/**
 * @author Ilya Savelyev
 * @since 04.12.2025
 */

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import ru.isavelev76.userservice.entities.enums.RoleName;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "roles")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {
    @Id
    UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 100)
    RoleName name;

    @ManyToMany(mappedBy = "roles")
    Set<User> users = new HashSet<>();
}