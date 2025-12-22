package ru.isavelev76.orderservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.isavelev76.orderservice.entities.Order;
import ru.isavelev76.orderservice.entities.Payment;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 15.12.2025
 */

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    boolean existsByOrder(Order order);

    @Query("""
        select count(p) > 0
        from Payment p
        join p.order o
        where p.id = :paymentId
          and o.userId = :userId
    """)
    boolean canUserAccessPayment(
            @Param("paymentId") UUID paymentId,
            @Param("userId") UUID userId
    );
}