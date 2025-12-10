package ru.isavelev76.restaurantservice.responses;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

public record DishResponse(
        UUID id,
        String name,
        String description,
        Integer price,
        String imageUrl,
        UUID restaurantId
) { }
