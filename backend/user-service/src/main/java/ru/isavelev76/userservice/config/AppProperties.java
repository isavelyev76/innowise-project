package ru.isavelev76.userservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
        String secret,
        Long expiresIn,
        Long refreshExpiresIn
) {
}
