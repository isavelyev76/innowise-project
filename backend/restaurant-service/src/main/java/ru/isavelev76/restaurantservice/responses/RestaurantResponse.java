package ru.isavelev76.restaurantservice.responses;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

public record RestaurantResponse(
        String id,
        String name,
        String cuisine,
        String address
) {
}