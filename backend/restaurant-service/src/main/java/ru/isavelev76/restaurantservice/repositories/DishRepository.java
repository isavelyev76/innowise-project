package ru.isavelev76.restaurantservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isavelev76.restaurantservice.entities.Dish;

import java.util.List;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@Repository
public interface DishRepository extends JpaRepository<Dish, UUID> {
    List<Dish> findAllByRestaurantId(UUID restaurantId);
    boolean existsByName(String name);
}
