package com.bankmanagement.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;
    private String fromUser;
    private String toUser;
    private double amount;
    private Date date;

    public Transaction() {}

    public Transaction(String fromUser, String toUser, double amount) {
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.amount = amount;
        this.date = new Date();
    }

    // getters & setters
    public String getId() { return id; }
    public String getFromUser() { return fromUser; }
    public String getToUser() { return toUser; }
    public double getAmount() { return amount; }
    public Date getDate() { return date; }

    public void setId(String id) { this.id = id; }
    public void setFromUser(String fromUser) { this.fromUser = fromUser; }
    public void setToUser(String toUser) { this.toUser = toUser; }
    public void setAmount(double amount) { this.amount = amount; }
    public void setDate(Date date) { this.date = date; }
}
