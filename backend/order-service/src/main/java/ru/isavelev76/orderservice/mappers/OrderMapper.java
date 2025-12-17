package ru.isavelev76.orderservice.mappers;

import org.mapstruct.Mapper;
import ru.isavelev76.orderservice.entities.Order;
import ru.isavelev76.orderservice.responses.OrderResponse;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

@Mapper(componentModel = "spring")
public interface OrderMapper {


    OrderResponse toResponse(Order order);
}
