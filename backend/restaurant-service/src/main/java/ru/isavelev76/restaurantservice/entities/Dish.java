package ru.isavelev76.restaurantservice.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dish")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false, length = 100)
    String name;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(nullable = false)
    Integer price;

    @Column(name = "image_url")
    String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    Restaurant restaurant;
}