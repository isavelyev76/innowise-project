package ru.isavelev76.orderservice.responses;

import ru.isavelev76.orderservice.entities.enums.OrderStatus;
import ru.isavelev76.orderservice.entities.enums.PaymentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

public record OrderResponse(
        UUID id,
        OrderStatus status,
        LocalDateTime orderDate,
        Integer totalPrice,
        UUID userId,
        UUID restaurantId,
        PaymentStatus paymentStatus
) {}