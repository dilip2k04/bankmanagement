package com.bankmanagement.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.bankmanagement.model.RegistrationRequest;

public interface RegistrationRequestRepository extends MongoRepository<RegistrationRequest, String> {
    List<RegistrationRequest> findByApprovedFalse();
}
