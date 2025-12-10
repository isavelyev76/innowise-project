package ru.isavelev76.restaurantservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@ConfigurationProperties(prefix = "app")
public record AppProperties (
        String secret
) {
}