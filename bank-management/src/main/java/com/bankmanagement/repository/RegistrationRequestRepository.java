package com.bankmanagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.bankmanagement.model.RegistrationRequest;

public interface RegistrationRequestRepository extends MongoRepository<RegistrationRequest, String> {
    Page<RegistrationRequest> findByApprovedFalse(Pageable pageable);
    Page<RegistrationRequest> findByApprovedFalseAndUsernameContainingIgnoreCase(String username, Pageable pageable);
    Page<RegistrationRequest> findByApprovedFalseAndAccountType(String accountType, Pageable pageable);
}