package ru.isavelev76.userservice.entities;

/**
 * @author Ilya Savelyev
 * @since 04.12.2025
 */

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "address")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(nullable = false)
    String street;

    @Column(nullable = false)
    String city;

    @Column
    String zip;

    @Column(nullable = false)
    String state;

    @Column(nullable = false)
    String country;
}
