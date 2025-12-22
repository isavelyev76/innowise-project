package ru.isavelev76.orderservice.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.isavelev76.orderservice.repositories.OrderRepository;
import ru.isavelev76.orderservice.repositories.PaymentRepository;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 21.12.2025
 */

@RequiredArgsConstructor
@Service
public class OrderSecurityService {
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public boolean isOrderOwner(UUID orderId, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());

        return orderRepository.existsByIdAndUserId(orderId, userId);
    }

    public boolean canViewPayment(UUID paymentId, Authentication authentication) {
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return true;
        }

        UUID userId = UUID.fromString(authentication.getName());
        return paymentRepository.canUserAccessPayment(paymentId, userId);
    }
}
