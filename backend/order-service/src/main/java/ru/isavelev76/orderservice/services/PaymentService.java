package ru.isavelev76.orderservice.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.isavelev76.orderservice.entities.Order;
import ru.isavelev76.orderservice.entities.Payment;
import ru.isavelev76.orderservice.entities.enums.PaymentStatus;
import ru.isavelev76.orderservice.mappers.PaymentMapper;
import ru.isavelev76.orderservice.repositories.OrderRepository;
import ru.isavelev76.orderservice.repositories.PaymentRepository;
import ru.isavelev76.orderservice.requests.PaymentRequest;
import ru.isavelev76.orderservice.responses.PaymentResponse;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 19.12.2025
 */

@RequiredArgsConstructor
@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public PaymentResponse findById(UUID id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Payment with id: " + id + " not found")
        );

        return paymentMapper.toResponse(payment);
    }

    @Transactional
    public PaymentResponse create(PaymentRequest request, UUID orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new EntityNotFoundException("Order with id: " + orderId + " not found")
        );

        if (paymentRepository.existsByOrder(order)) {
            throw new IllegalStateException(
                    "Payment already exists for order: " + orderId
            );
        }

        Payment payment = new Payment();
        payment.setMethod(request.method());
        payment.setAmount(order.getTotalPrice());
        // TODO можно сделать PENDING и через пару секунд менять статус на PAID
        payment.setStatus(PaymentStatus.PAID);
        payment.setOrder(order);

        paymentRepository.save(payment);

        return paymentMapper.toResponse(payment);
    }
}
