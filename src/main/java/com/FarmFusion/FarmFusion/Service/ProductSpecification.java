package com.FarmFusion.FarmFusion.Service;

import com.FarmFusion.FarmFusion.entity.Products;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Products> filterBy(
            String name,
            String category,
            Double minPrice,
            Double maxPrice
    ) {
        return (root, query, cb) -> {

            var predicate = cb.conjunction(); // start with "always true", keep AND-ing conditions

            // Name search (case-insensitive, partial match)
            if (name != null && !name.isBlank()) {
                predicate = cb.and(
                        predicate,
                        cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%")
                );
            }

            // Category filter (exact match, case-insensitive)
            if (category != null && !category.isBlank()) {
                predicate = cb.and(
                        predicate,
                        cb.equal(cb.lower(root.get("category")), category.toLowerCase())
                );
            }

            // Min price filter
            if (minPrice != null) {
                predicate = cb.and(
                        predicate,
                        cb.greaterThanOrEqualTo(root.get("price"), minPrice)
                );
            }

            // Max price filter
            if (maxPrice != null) {
                predicate = cb.and(
                        predicate,
                        cb.lessThanOrEqualTo(root.get("price"), maxPrice)
                );
            }

            return predicate;
        };
    }
}