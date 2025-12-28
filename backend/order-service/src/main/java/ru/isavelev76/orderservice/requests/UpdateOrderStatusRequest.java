package ru.isavelev76.orderservice.requests;

import jakarta.validation.constraints.NotNull;
import ru.isavelev76.orderservice.entities.enums.OrderStatus;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

public record UpdateOrderStatusRequest(
        @NotNull(message = "Order status is required")
        OrderStatus status
) {
}
