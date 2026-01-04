package ru.isavelev76.orderservice.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.isavelev76.orderservice.entities.Order;
import ru.isavelev76.orderservice.entities.enums.PaymentStatus;
import ru.isavelev76.orderservice.responses.OrderResponse;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "paymentStatus", expression = "java(mapPaymentStatus(order))")
    OrderResponse toResponse(Order order);

    default PaymentStatus mapPaymentStatus(Order order) {
        if (order.getPayments() == null || order.getPayments().isEmpty()) {
            return PaymentStatus.PENDING;
        }

        boolean isPaid = order.getPayments().stream()
                .anyMatch(payment -> payment.getStatus() == PaymentStatus.PAID);

        return isPaid ? PaymentStatus.PAID : PaymentStatus.PENDING;
    }

}
