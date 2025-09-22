package com.bankmanagement.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.bankmanagement.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Page<User> findAll(Pageable pageable);
    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
    Page<User> findBySuspended(boolean suspended, Pageable pageable);
    Page<User> findByRole(String role, Pageable pageable);
}