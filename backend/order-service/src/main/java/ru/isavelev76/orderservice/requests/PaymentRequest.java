package ru.isavelev76.orderservice.requests;

import jakarta.validation.constraints.NotBlank;

/**
 * @author Ilya Savelyev
 * @since 19.12.2025
 */

public record PaymentRequest (
        @NotBlank(message = "Payment method is required")
        String method
){
}
