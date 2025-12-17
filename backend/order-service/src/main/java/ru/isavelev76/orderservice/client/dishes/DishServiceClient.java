package ru.isavelev76.orderservice.client.dishes;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.isavelev76.orderservice.client.model.DishPriceRequest;
import ru.isavelev76.orderservice.client.model.DishPriceResponse;
import ru.isavelev76.orderservice.requests.CreateOrderItemRequest;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

@Service
@RequiredArgsConstructor
public class DishServiceClient {

    private final DishClient dishClient;

    @CircuitBreaker(name = "external-api-breaker")
    @Retry(name = "external-api-retry")
    public Map<UUID, Integer> getPrices(List<CreateOrderItemRequest> items) {
        List<DishPriceRequest> requests = items.stream()
                .map(i -> new DishPriceRequest(i.dishId()))
                .toList();

        return dishClient.getPrices(requests).stream()
                .collect(Collectors.toMap(
                        DishPriceResponse::dishId,
                        DishPriceResponse::price
                ));
    }
}