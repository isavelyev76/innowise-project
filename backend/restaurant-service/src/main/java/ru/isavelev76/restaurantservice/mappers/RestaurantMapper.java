package ru.isavelev76.restaurantservice.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.isavelev76.restaurantservice.entities.Restaurant;
import ru.isavelev76.restaurantservice.requests.RestaurantRequest;
import ru.isavelev76.restaurantservice.responses.RestaurantResponse;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@Mapper(componentModel = "spring")
public interface RestaurantMapper {

    @Mapping(target = "id", ignore = true)
    Restaurant toEntity(RestaurantRequest request);

    RestaurantResponse toResponse(Restaurant restaurant);

    void updateEntityFromRequest(RestaurantRequest request, @MappingTarget Restaurant restaurant);
}