package ru.isavelev76.orderservice.client.restaurants;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ru.isavelev76.orderservice.client.model.RestaurantApiResponse;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 13.12.2025
 */

@FeignClient(
        name = "restaurant-api",
        url = "${app.restaurant-api.url}"
)
public interface RestaurantClient {

    @GetMapping("/{id}")
    RestaurantApiResponse findRestaurantById(@PathVariable("id") UUID id);
}
