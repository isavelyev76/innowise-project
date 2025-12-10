package ru.isavelev76.restaurantservice.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.isavelev76.restaurantservice.entities.Dish;
import ru.isavelev76.restaurantservice.requests.DishRequest;
import ru.isavelev76.restaurantservice.responses.DishResponse;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@Mapper(componentModel = "spring")
public interface DishMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    Dish toEntity(DishRequest request);

    @Mapping(target = "restaurant", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    void updateEntityFromRequest(DishRequest request, @MappingTarget Dish dish);

    @Mapping(target = "restaurantId", source = "restaurant.id")
    DishResponse toResponse(Dish dish);
}
