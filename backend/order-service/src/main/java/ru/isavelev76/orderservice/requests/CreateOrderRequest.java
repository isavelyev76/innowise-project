package ru.isavelev76.orderservice.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

// TODO: надо проверить будет ли работать
public record CreateOrderRequest(
        @NotNull(message = "Restaurant id is required")
        UUID restaurantId,
        @NotEmpty(message = "List of dishes is required")
        List<@Valid CreateOrderItemRequest> items
) {}
