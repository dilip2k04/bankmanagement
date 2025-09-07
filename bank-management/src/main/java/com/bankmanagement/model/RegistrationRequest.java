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
    private boolean approved;

    public RegistrationRequest() {}

    public RegistrationRequest(String username, String password, String accountType) {
        this.username = username;
        this.password = password;
        this.accountType = accountType;
        this.approved = false;
    }

    // getters & setters
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getAccountType() { return accountType; }
    public boolean isApproved() { return approved; }

    public void setId(String id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
    public void setApproved(boolean approved) { this.approved = approved; }
}
