package ru.isavelev76.restaurantservice.requests;

import lombok.Builder;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@Builder
public record RestaurantRequest(
        String name,
        String cuisine,
        String address
) {
}