package ru.isavelev76.orderservice.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.isavelev76.orderservice.requests.PaymentRequest;
import ru.isavelev76.orderservice.responses.PaymentResponse;
import ru.isavelev76.orderservice.services.PaymentService;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 19.12.2025
 */

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    @PreAuthorize("@orderSecurityService.isOrderOwner(#id, authentication)")
    @PostMapping("/order/{id}/payment")
    public ResponseEntity<PaymentResponse> create(@PathVariable("id") UUID id,
                                                  @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.create(request, id));
    }

    @PreAuthorize("@orderSecurityService.canViewPayment(#id, authentication)")
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok().body(paymentService.findById(id));
    }
}
