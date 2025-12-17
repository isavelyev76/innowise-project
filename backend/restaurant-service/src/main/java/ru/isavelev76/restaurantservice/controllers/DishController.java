package ru.isavelev76.restaurantservice.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.isavelev76.restaurantservice.requests.DishPriceRequest;
import ru.isavelev76.restaurantservice.requests.DishRequest;
import ru.isavelev76.restaurantservice.responses.DishPriceResponse;
import ru.isavelev76.restaurantservice.responses.DishResponse;
import ru.isavelev76.restaurantservice.services.DishMediaService;
import ru.isavelev76.restaurantservice.services.DishService;

import java.util.List;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@RestController
@RequestMapping("/api/dishes")
@RequiredArgsConstructor
public class DishController {
    private final DishService dishService;
    private final DishMediaService dishMediaService;

    @GetMapping("/{id}")
    public ResponseEntity<DishResponse> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(dishService.getById(id));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<DishResponse>> getAllByRestaurant(@PathVariable("restaurantId") UUID restaurantId) {
        return ResponseEntity.ok(dishService.getAllByRestaurant(restaurantId));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<DishResponse> createDish(@Valid @RequestPart("dish") DishRequest dishRequest,
                                                   @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        DishResponse response = dishService.createDish(dishRequest, imageFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DishResponse> updateDish(@PathVariable("id") UUID id,
                                                   @Valid @RequestPart("dish") DishRequest dishRequest,
                                                   @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        DishResponse response = dishService.updateDish(id, dishRequest, imageFile);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        dishService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/media/{fileName:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable("fileName") String fileName) {
        try {
           byte[] bytes = dishMediaService.getDishImage(fileName);

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(bytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('INTERNAL')")
    @PostMapping("/prices")
    public ResponseEntity<List<DishPriceResponse>> getDishPrices(
            @RequestBody List<DishPriceRequest> requests
    ) {
        return ResponseEntity.ok(dishService.getPrices(requests));
    }

}