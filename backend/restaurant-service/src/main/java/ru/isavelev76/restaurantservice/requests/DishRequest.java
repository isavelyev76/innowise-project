package ru.isavelev76.restaurantservice.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

public record DishRequest(
        @NotBlank(message = "Dish name must not be blank")
        String name,

        @Size(max = 255, message = "Maximum number of characters is 255")
        String description,

        @NotNull(message = "Price must be provided")
        @Min(value = 0, message = "Price must be positive")
        Integer price,

        @NotNull(message = "Restaurant ID must be provided")
        UUID restaurantId
) {}
