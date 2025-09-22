package com.bankmanagement.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.bankmanagement.model.Transaction;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByFromUserOrToUser(String fromUser, String toUser);
    Page<Transaction> findByFromUserOrToUser(String fromUser, String toUser, Pageable pageable);
}