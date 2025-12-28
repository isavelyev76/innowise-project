package ru.isavelev76.restaurantservice.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.isavelev76.restaurantservice.entities.Restaurant;
import ru.isavelev76.restaurantservice.mappers.RestaurantMapper;
import ru.isavelev76.restaurantservice.repositories.RestaurantRepository;
import ru.isavelev76.restaurantservice.repositories.specifications.RestaurantSpecificationBuilder;
import ru.isavelev76.restaurantservice.requests.RestaurantFilterRequest;
import ru.isavelev76.restaurantservice.requests.RestaurantRequest;
import ru.isavelev76.restaurantservice.responses.RestaurantResponse;

import java.util.List;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@Service
@RequiredArgsConstructor
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;
    private final RestaurantSpecificationBuilder specificationBuilder;

    @Transactional
    public RestaurantResponse create(RestaurantRequest request) {
        Restaurant restaurant = restaurantMapper.toEntity(request);
        restaurantRepository.save(restaurant);
        return restaurantMapper.toResponse(restaurant);
    }

    @Transactional(readOnly = true)
    public RestaurantResponse getById(UUID id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Restaurant not found"));
        return restaurantMapper.toResponse(restaurant);
    }

    public RestaurantResponse update(UUID id, RestaurantRequest request) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Restaurant not found"));
        restaurantMapper.updateEntityFromRequest(request, restaurant);
        return restaurantMapper.toResponse(restaurant);
    }

    @Transactional
    public void delete(UUID id) {
        if (!restaurantRepository.existsById(id)) {
            throw new EntityNotFoundException("Restaurant not found");
        }
        restaurantRepository.deleteById(id);
    }

    public List<RestaurantResponse> getFilteredRestaurants(RestaurantFilterRequest filter, Pageable pageable) {
        Specification<Restaurant> specification = specificationBuilder.build(filter);

        Page<Restaurant> restaurants = restaurantRepository.findAll(specification, pageable);

        return restaurants.stream()
                .map(restaurantMapper::toResponse)
                .toList();
    }
}
