package ru.isavelev76.userservice.responses;

import java.util.UUID;

public record AddressResponse(
        UUID id,
        UUID userId,
        String street,
        String city,
        String zip,
        String state,
        String country
) {
}
