package com.ecobazzar.ecobazzar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecobazzar.ecobazzar.model.CartItem;

public interface CartRepository extends JpaRepository<CartItem, Long> {
	
	List<CartItem> findByUserId(Long id);

}
