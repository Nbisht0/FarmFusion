package com.FarmFusion.FarmFusion.repository; //package name of this repository

import com.FarmFusion.FarmFusion.entity.User; //so we can connect database users
import org.springframework.data.jpa.repository.JpaRepository; //Jparepository : a spring data jpa interface that gives you CRUD operations

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByEmail(String email); //Jparepository<user , long > means
    Optional<User> findByName(String name);
    //user : the entity it manages // long : type of ID



}
