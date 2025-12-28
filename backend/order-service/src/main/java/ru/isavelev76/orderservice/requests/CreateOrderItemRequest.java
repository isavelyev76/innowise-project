package ru.isavelev76.orderservice.requests;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

public record CreateOrderItemRequest(
        @NotNull(message = "Dish id is required")
        UUID dishId,
        @NotNull(message = "Quantity must be provided")
        Integer quantity
) {}