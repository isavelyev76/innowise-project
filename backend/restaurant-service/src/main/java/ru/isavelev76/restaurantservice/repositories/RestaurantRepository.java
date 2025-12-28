package ru.isavelev76.restaurantservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import ru.isavelev76.restaurantservice.entities.Restaurant;

import java.util.Optional;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, UUID>, JpaSpecificationExecutor<Restaurant> {
    Optional<Restaurant> findByName(String name);
}