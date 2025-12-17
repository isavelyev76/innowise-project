package ru.isavelev76.orderservice.client.model;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 15.12.2025
 */

public record DishPriceResponse(
        UUID dishId,
        Integer price
) {
}
