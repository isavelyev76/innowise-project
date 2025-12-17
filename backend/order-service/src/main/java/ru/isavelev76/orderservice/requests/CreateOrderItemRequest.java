package ru.isavelev76.orderservice.requests;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

public record CreateOrderItemRequest(
        UUID dishId,
        int quantity
) {}