package ru.isavelev76.restaurantservice.requests;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 15.12.2025
 */

public record DishPriceRequest(
        @NotNull(message = "Dish id is required")
        UUID dishId
) {}
