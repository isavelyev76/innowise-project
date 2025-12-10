package ru.isavelev76.restaurantservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@ConfigurationProperties(prefix = "minio")
public record MinioProperties (
        String url,
        String username,
        String password,
        String bucketName,
        String baseUrl
) {
}