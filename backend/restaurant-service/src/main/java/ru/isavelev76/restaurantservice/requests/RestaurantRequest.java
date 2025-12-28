package ru.isavelev76.restaurantservice.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@Builder
public record RestaurantRequest(
        @NotBlank(message = "Restaurant name is required")
        String name,
        @NotBlank(message = "Cuisine is required")
        String cuisine,
        @NotBlank(message = "Address is required")
        String address
) {
}