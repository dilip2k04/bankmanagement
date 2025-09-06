package com.bankmanagement.repository;

import com.bankmanagement.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByFromUserOrToUser(String fromUser, String toUser);
}
