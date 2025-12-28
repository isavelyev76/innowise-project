package ru.isavelev76.restaurantservice.requests;

/**
 * @author Ilya Savelyev
 * @since 23.12.2025
 */

public record RestaurantFilterRequest(
        String name,
        String address,
        String cuisine
) {
}
