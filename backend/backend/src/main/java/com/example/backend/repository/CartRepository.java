package com.example.backend.repository;

import com.example.backend.entity.Cart;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    @EntityGraph(attributePaths = "cartItems")
    Optional<Cart> findByUser(User user);
}