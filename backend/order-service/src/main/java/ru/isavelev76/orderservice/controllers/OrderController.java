package ru.isavelev76.orderservice.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.isavelev76.orderservice.requests.CreateOrderRequest;
import ru.isavelev76.orderservice.requests.UpdateOrderStatusRequest;
import ru.isavelev76.orderservice.responses.OrderResponse;
import ru.isavelev76.orderservice.services.OrderService;

import java.util.List;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping
    public ResponseEntity<OrderResponse> create(@RequestBody @Valid CreateOrderRequest request,
                                                Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(userId, request));
    }

    @PreAuthorize("hasRole('ADMIN') || @orderSecurityService.isOrderOwner(#orderId, authentication)")
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getById(@PathVariable("orderId") UUID orderId) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getById(orderId));
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getMyOrders(userId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAll() {
        return ResponseEntity.ok().body(orderService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable("id") UUID id,
                                                      @RequestBody @Valid UpdateOrderStatusRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.updateStatus(id, request.status()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
