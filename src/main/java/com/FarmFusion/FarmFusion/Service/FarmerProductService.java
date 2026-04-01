package com.FarmFusion.FarmFusion.Service;

import com.FarmFusion.FarmFusion.entity.FarmerProduct;
import com.FarmFusion.FarmFusion.repository.FarmerProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmerProductService {

    private final FarmerProductRepository repo;

    public FarmerProductService(FarmerProductRepository repo) {
        this.repo = repo;
    }

    public FarmerProduct add(FarmerProduct product) {
        return repo.save(product);
    }

    public List<FarmerProduct> getByFarmer(Long farmerId) {
        return repo.findByFarmerId(farmerId);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
    
}
