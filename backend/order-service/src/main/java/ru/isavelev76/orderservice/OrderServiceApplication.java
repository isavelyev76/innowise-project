package ru.isavelev76.orderservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.openfeign.EnableFeignClients;
import ru.isavelev76.orderservice.config.AppProperties;

/**
 * @author Ilya Savelyev
 * @since 12.12.2025
 */

@EnableFeignClients(basePackages = "ru.isavelev76.orderservice.client")
@EnableConfigurationProperties({AppProperties.class})
@SpringBootApplication
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }

}
