package ru.isavelev76.restaurantservice.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.isavelev76.restaurantservice.entities.Dish;
import ru.isavelev76.restaurantservice.entities.Restaurant;
import ru.isavelev76.restaurantservice.mappers.DishMapper;
import ru.isavelev76.restaurantservice.repositories.DishRepository;
import ru.isavelev76.restaurantservice.repositories.RestaurantRepository;
import jakarta.persistence.EntityNotFoundException;
import ru.isavelev76.restaurantservice.requests.DishPriceRequest;
import ru.isavelev76.restaurantservice.requests.DishRequest;
import ru.isavelev76.restaurantservice.responses.DishPriceResponse;
import ru.isavelev76.restaurantservice.responses.DishResponse;

import java.util.List;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@Service
@RequiredArgsConstructor
public class DishService {
    private final DishRepository dishRepository;
    private final RestaurantRepository restaurantRepository;
    private final DishMediaService mediaService;
    private final DishMapper dishMapper;
    private final DishMediaService dishMediaService;

    @Transactional
    public DishResponse createDish(DishRequest request, MultipartFile imageFile) {
        Restaurant restaurant = restaurantRepository.findById(request.restaurantId()).orElseThrow(() -> new EntityNotFoundException("Restaurant not found"));
        Dish dish = dishMapper.toEntity(request);
        dish.setRestaurant(restaurant);
        dishRepository.save(dish);
        if (imageFile != null && !imageFile.isEmpty()) {
            mediaService.uploadDishImage(imageFile, dish);
        }
        return dishMapper.toResponse(dish);
    }

    @Transactional(readOnly = true)
    public DishResponse getById(UUID id) {
        Dish dish = dishRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Dish not found"));
        return dishMapper.toResponse(dish);
    }

    @Transactional(readOnly = true)
    public List<DishResponse> getAllByRestaurant(UUID restaurantId) {
        return dishRepository.findAllByRestaurantId(restaurantId).stream().map(dishMapper::toResponse).toList();
    }

    @Transactional
    public DishResponse updateDish(UUID dishId, DishRequest request, MultipartFile imageFile) {
        Dish dish = dishRepository.findById(dishId).orElseThrow(() -> new EntityNotFoundException("Dish not found"));
        dishMapper.updateEntityFromRequest(request, dish);
        if (imageFile != null && !imageFile.isEmpty()) {
            if (dish.getImageUrl() != null) {
                mediaService.deleteDishImage(dish);
            }
            mediaService.uploadDishImage(imageFile, dish);
        }
        return dishMapper.toResponse(dish);
    }

    @Transactional
    public void delete(UUID id) {
        if (!dishRepository.existsById(id)) {
            throw new EntityNotFoundException("Dish not found");
        }

        Dish dish = dishRepository.findById(id).orElseThrow();
        dishMediaService.deleteDishImage(dish);
        dishRepository.deleteById(id);
    }

    public List<DishPriceResponse> getPrices(List<DishPriceRequest> requests) {
        return requests.stream()
                .map(req -> {
                    Dish dish = dishRepository.findById(req.dishId())
                            .orElseThrow(() -> new EntityNotFoundException("Dish not found: " + req.dishId()));
                    return new DishPriceResponse(dish.getId(), dish.getPrice());
                })
                .toList();
    }

}