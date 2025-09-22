package com.bankmanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "registration_requests")
public class RegistrationRequest {

    @Id
    private String id;
    private String username;
    private String password;
    private String accountType;
    private double initialBalance; // New field
    private boolean approved;

    public RegistrationRequest() {}

    public RegistrationRequest(String username, String password, String accountType) {
        this.username = username;
        this.password = password;
        this.accountType = accountType;
        this.approved = false;
        // Set initialBalance based on accountType
        switch (accountType.toUpperCase()) {
            case "SAVINGS":
                this.initialBalance = 5000;
                break;
            case "FIXED_DEPOSIT":
                this.initialBalance = 10000;
                break;
            default:
                this.initialBalance = 1000;
        }
    }

    // Getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
    public double getInitialBalance() { return initialBalance; }
    public void setInitialBalance(double initialBalance) { this.initialBalance = initialBalance; }
    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }
}