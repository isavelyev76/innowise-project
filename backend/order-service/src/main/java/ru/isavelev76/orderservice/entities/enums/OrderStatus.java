package ru.isavelev76.orderservice.entities.enums;

/**
 * @author Ilya Savelyev
 * @since 12.12.2025
 */

public enum OrderStatus {
    PLACED,
    COOKING,
    READY,
    DELIVERED,
    CANCELLED;

    public boolean canTransitionTo(OrderStatus target) {
        return switch (this) {
            case PLACED -> target == COOKING || target == CANCELLED;
            case COOKING -> target == READY || target == CANCELLED;
            case READY -> target == DELIVERED || target == CANCELLED;
            default -> false;
        };
    }
}
