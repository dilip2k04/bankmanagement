package com.bankmanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String role;   // "USER" or "ADMIN"
    private double balance;
    private boolean suspended;

    public User() {}

    public User(String username, String password, String role, double balance) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.balance = balance;
        this.suspended = false;
    }

    // getters and setters...
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
    public double getBalance() { return balance; }
    public boolean isSuspended() { return suspended; }

    public void setId(String id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(String role) { this.role = role; }
    public void setBalance(double balance) { this.balance = balance; }
    public void setSuspended(boolean suspended) { this.suspended = suspended; }
}
