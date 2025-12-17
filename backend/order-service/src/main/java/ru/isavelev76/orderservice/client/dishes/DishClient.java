package ru.isavelev76.orderservice.client.dishes;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import ru.isavelev76.orderservice.client.model.DishPriceRequest;
import ru.isavelev76.orderservice.client.model.DishPriceResponse;

import java.util.List;

/**
 * @author Ilya Savelyev
 * @since 14.12.2025
 */

@FeignClient(
        name = "dishes-api",
        url = "${app.dishes-api.url}"
)
public interface DishClient  {

    @PostMapping("/prices")
    List<DishPriceResponse> getPrices(@RequestBody List<DishPriceRequest> requests);
}
