package ru.isavelev76.restaurantservice.repositories.specifications;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import ru.isavelev76.restaurantservice.entities.Restaurant;
import ru.isavelev76.restaurantservice.requests.RestaurantFilterRequest;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Ilya Savelyev
 * @since 23.12.2025
 */

@Component
public class RestaurantSpecificationBuilder {

    public Specification<Restaurant> build(RestaurantFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.name() != null && !filter.name().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + filter.name().toLowerCase() + "%"
                        )
                );
            }

            if (filter.address() != null && !filter.address().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("address")),
                                "%" + filter.address().toLowerCase() + "%"
                        )
                );
            }

            if (filter.cuisine() != null && !filter.cuisine().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("cuisine")),
                                "%" + filter.cuisine().toLowerCase() + "%"
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
