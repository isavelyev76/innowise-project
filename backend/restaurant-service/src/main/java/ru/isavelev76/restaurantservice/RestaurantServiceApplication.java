package ru.isavelev76.restaurantservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import ru.isavelev76.restaurantservice.config.AppProperties;
import ru.isavelev76.restaurantservice.config.MinioProperties;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@EnableConfigurationProperties({AppProperties.class, MinioProperties.class})
@SpringBootApplication
public class RestaurantServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestaurantServiceApplication.class, args);
    }

}
