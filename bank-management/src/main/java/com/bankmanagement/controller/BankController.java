package com.bankmanagement.controller;

import com.bankmanagement.model.Transaction;
import com.bankmanagement.model.User;
import com.bankmanagement.service.BankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class BankController {

    @Autowired
    private BankService service;

    // User endpoints
    @PostMapping("/register")
    public User register(@RequestParam String username, @RequestParam String password) {
        return service.register(username, password);
    }

    @PostMapping("/login")
    public User login(@RequestParam String username, @RequestParam String password) {
        return service.login(username, password);
    }

    @GetMapping("/balance/{username}")
    public double checkBalance(@PathVariable String username) {
        return service.checkBalance(username);
    }

    @GetMapping("/transactions/{username}")
    public List<Transaction> getTransactions(@PathVariable String username) {
        return service.getTransactions(username);
    }

    @PostMapping("/transfer")
    public String transfer(@RequestParam String from, @RequestParam String to, @RequestParam double amount) {
        service.transferMoney(from, to, amount);
        return "Transfer successful!";
    }

    // Admin endpoints
    @GetMapping("/admin/users")
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    @DeleteMapping("/admin/user/{username}")
    public String deleteUser(@PathVariable String username) {
        service.deleteUser(username);
        return "User deleted";
    }

    @PutMapping("/admin/user/{username}/suspend")
    public String suspendUser(@PathVariable String username) {
        service.suspendUser(username);
        return "User suspended";
    }
}
