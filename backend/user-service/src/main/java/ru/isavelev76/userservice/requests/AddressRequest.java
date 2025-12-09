package ru.isavelev76.userservice.requests;

import jakarta.validation.constraints.NotBlank;

public record AddressRequest(
        // TODO: если указать поле, но не заполнять его, то операция будет успешной (НЕВЕРНО)
        @NotBlank(message = "Street is required")
        String street,
        @NotBlank(message = "City is required")
        String city,
        String zip,
        @NotBlank(message = "State is required")
        String state,
        @NotBlank(message = "Country is required")
        String country
) {
}
