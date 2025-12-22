package ru.isavelev76.orderservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isavelev76.orderservice.entities.Order;

import java.util.List;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findAllByUserId(UUID userId);

    boolean existsByIdAndUserId(UUID orderId, UUID userId);
}
