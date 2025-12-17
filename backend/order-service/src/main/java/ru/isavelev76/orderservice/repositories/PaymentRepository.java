package ru.isavelev76.orderservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isavelev76.orderservice.entities.Payment;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 15.12.2025
 */

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
}
