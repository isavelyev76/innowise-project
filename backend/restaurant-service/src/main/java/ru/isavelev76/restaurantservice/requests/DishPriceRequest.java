package ru.isavelev76.restaurantservice.requests;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 15.12.2025
 */

public record DishPriceRequest(
        UUID dishId
) {}
