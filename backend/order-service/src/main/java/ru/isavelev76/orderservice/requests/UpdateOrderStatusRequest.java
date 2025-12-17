package ru.isavelev76.orderservice.requests;

import ru.isavelev76.orderservice.entities.enums.OrderStatus;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

public record UpdateOrderStatusRequest(
        OrderStatus status
) {
}
