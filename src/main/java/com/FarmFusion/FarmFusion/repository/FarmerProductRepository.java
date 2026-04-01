package com.FarmFusion.FarmFusion.repository;

import com.FarmFusion.FarmFusion.entity.FarmerProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FarmerProductRepository extends JpaRepository<FarmerProduct, Long> {

    List<FarmerProduct> findByFarmerId(Long farmerId);
}
