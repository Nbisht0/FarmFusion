package com.FarmFusion.FarmFusion.repository;

import com.FarmFusion.FarmFusion.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    // Get all addresses belonging to a specific user
    List<Address> findByUserId(Long userId);

}