package ru.isavelev76.orderservice.responses;

import ru.isavelev76.orderservice.entities.enums.PaymentStatus;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 19.12.2025
 */

public record PaymentResponse(
        UUID id,
        String method,
        Integer amount,
        PaymentStatus status,
        UUID orderId
) {
}
