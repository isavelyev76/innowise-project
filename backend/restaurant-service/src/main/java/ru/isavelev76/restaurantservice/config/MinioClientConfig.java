package ru.isavelev76.restaurantservice.config;

import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@RequiredArgsConstructor
@Configuration
class MinioClientConfig {
    private final MinioProperties minioProperties;

    @Bean
    MinioClient generateMinioClient() {
        try {
            return MinioClient.builder()
                    .endpoint(minioProperties.url())
                    .credentials(minioProperties.username(), minioProperties.password())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
