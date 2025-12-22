package ru.isavelev76.orderservice.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.isavelev76.orderservice.entities.Payment;
import ru.isavelev76.orderservice.requests.PaymentRequest;
import ru.isavelev76.orderservice.responses.PaymentResponse;

/**
 * @author Ilya Savelyev
 * @since 19.12.2025
 */

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(target = "orderId", source = "payment.order.id")
    PaymentResponse toResponse(Payment payment);

    @Mapping(target = "id", ignore = true)
    Payment toEntity(PaymentRequest request);
}
