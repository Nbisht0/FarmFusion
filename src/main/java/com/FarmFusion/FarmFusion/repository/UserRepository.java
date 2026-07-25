package com.FarmFusion.FarmFusion.repository;

import com.FarmFusion.FarmFusion.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByName(String name);

    // Used by AdminService to list all farmers (or any role) for the admin dashboard
    List<User> findByRole(String role);
}