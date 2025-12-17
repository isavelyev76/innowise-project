package ru.isavelev76.orderservice.entities.enums;

/**
 * @author Ilya Savelyev
 * @since 12.12.2025
 */

public enum PaymentStatus {
    PENDING,
    PAID,
    FAILED,
    REFUNDED;

    public boolean canTransitionTo(PaymentStatus target) {
        return switch (this) {
            case PENDING -> target == PAID || target == FAILED;
            case PAID -> target == REFUNDED;
            default -> false;
        };
    }
}
