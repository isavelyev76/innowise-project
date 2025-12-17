package ru.isavelev76.orderservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.isavelev76.orderservice.entities.OrderItem;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 15.12.2025
 */

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
}
