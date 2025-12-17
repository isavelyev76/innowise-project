package ru.isavelev76.orderservice.client.restaurants;

import feign.FeignException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

@Service
@RequiredArgsConstructor
public class RestaurantServiceClient {
    private final RestaurantClient restaurantClient;

    @CircuitBreaker(name = "external-api-breaker")
    @Retry(name = "external-api-retry")
    public void checkRestaurantExists(UUID id){
        try {
            restaurantClient.findRestaurantById(id);
        } catch (FeignException.NotFound e) {
            throw new EntityNotFoundException("Restaurant not found: " + id);
        }
    }
}
