package ru.isavelev76.orderservice.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.isavelev76.orderservice.client.dishes.DishServiceClient;
import ru.isavelev76.orderservice.client.restaurants.RestaurantServiceClient;
import ru.isavelev76.orderservice.entities.Order;
import ru.isavelev76.orderservice.entities.OrderItem;
import ru.isavelev76.orderservice.entities.enums.OrderStatus;
import ru.isavelev76.orderservice.mappers.OrderMapper;
import ru.isavelev76.orderservice.repositories.OrderRepository;
import ru.isavelev76.orderservice.requests.CreateOrderItemRequest;
import ru.isavelev76.orderservice.requests.CreateOrderRequest;
import ru.isavelev76.orderservice.responses.OrderResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

@RequiredArgsConstructor
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final RestaurantServiceClient restaurantServiceClient;
    private final DishServiceClient dishServiceClient;

    @Transactional
    public OrderResponse placeOrder(UUID userId, CreateOrderRequest request) {

        restaurantServiceClient.checkRestaurantExists(request.restaurantId());

        // 2. Получение блюд + цен (REST)
        Map<UUID, Integer> dishPrices =
                dishServiceClient.getPrices(request.items());

        // 3. Создание Order
        Order order = new Order();
        order.setUserId(userId);
        order.setRestaurantId(request.restaurantId());
        order.setStatus(OrderStatus.PLACED);
        order.setOrderDate(LocalDateTime.now());

        int totalPrice = 0;

        for (CreateOrderItemRequest item : request.items()) {
            int price = dishPrices.get(item.dishId());

            OrderItem orderItem = new OrderItem();
            orderItem.setDishId(item.dishId());
            orderItem.setQuantity(item.quantity());
            orderItem.setPrice(price);
            orderItem.setOrder(order);

            order.getOrderItems().add(orderItem);
            totalPrice += price * item.quantity();
        }

        order.setTotalPrice(totalPrice);

        orderRepository.save(order);

        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(UUID userId) {
        return orderRepository.findAllByUserId(userId).stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAll() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    // TODO: протестировать функционал, возможно не будет обновляться база
    @Transactional
    public OrderResponse updateStatus(UUID id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if (!order.getStatus().canTransitionTo(status)) {
            throw new IllegalStateException(
                    "Cannot change status from " + order.getStatus() + " to " + status
            );
        }

        order.setStatus(status);
        return orderMapper.toResponse(order);
    }

    @Transactional
    public void delete(UUID id) {
        if (!orderRepository.existsById(id)) {
            throw new EntityNotFoundException("Order not found");
        }
        orderRepository.deleteById(id);
    }
}
