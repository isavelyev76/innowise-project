package ru.isavelev76.userservice.controllers;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.isavelev76.userservice.requests.AddressRequest;
import ru.isavelev76.userservice.responses.AddressResponse;
import ru.isavelev76.userservice.security.UserDetailsImpl;
import ru.isavelev76.userservice.services.AddressService;

import java.util.List;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 07.12.2025
 */

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    private final AddressService addressService;

    @PostMapping
    @SecurityRequirement(name = "JWT")
    public ResponseEntity<AddressResponse> createAddress(@RequestBody AddressRequest addressRequest,
                                                         @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(addressService.create(addressRequest, userDetails.getId()));
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "JWT")
    public ResponseEntity<AddressResponse> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(addressService.getById(id, userDetails.getId()));
    }

    @GetMapping
    @SecurityRequirement(name = "JWT")
    public ResponseEntity<List<AddressResponse>> getAll(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(addressService.getAll(userDetails.getId()));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "JWT")
    public ResponseEntity<AddressResponse> update(
            @PathVariable UUID id,
            @RequestBody AddressRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(addressService.update(id, userDetails.getId(), request));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "JWT")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        addressService.delete(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
