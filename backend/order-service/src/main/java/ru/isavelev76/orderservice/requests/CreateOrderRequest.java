package ru.isavelev76.orderservice.requests;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

public record CreateOrderRequest(
        @NotNull
        UUID restaurantId,
        String paymentMethod,
        List<CreateOrderItemRequest> items
) {}
