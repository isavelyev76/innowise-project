package ru.isavelev76.orderservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Ilya Savelyev
 * @since 12.12.2025
 */

@ConfigurationProperties(prefix = "app")
public record AppProperties(
        String secret,
        String internalToken,
        DishesApi dishesApi,
        RestaurantApi restaurantApi) {
    record DishesApi(
            String url
    ) {
    }

    record RestaurantApi(
            String url
    ){
    }
}
