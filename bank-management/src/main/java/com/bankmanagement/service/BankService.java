package com.bankmanagement.service;

import com.bankmanagement.model.Transaction;
import com.bankmanagement.model.User;
import com.bankmanagement.repository.TransactionRepository;
import com.bankmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;

@Service
public class BankService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @PostConstruct
    public void initAdmin() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User("admin", "admin@123", "ADMIN", 0);
            userRepository.save(admin);
        }
    }

    // User methods
    public User register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("User already exists!");
        }
        User user = new User(username, password, "USER", 1000.0);
        return userRepository.save(user);
    }

    public User login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password) && !userOpt.get().isSuspended()) {
            return userOpt.get();
        }
        throw new RuntimeException("Invalid credentials or account suspended");
    }

    public double checkBalance(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return user.getBalance();
    }

    public List<Transaction> getTransactions(String username) {
        return transactionRepository.findByFromUserOrToUser(username, username);
    }

    public void transferMoney(String from, String to, double amount) {
        User sender = userRepository.findByUsername(from).orElseThrow();
        User receiver = userRepository.findByUsername(to).orElseThrow();

        if (sender.getBalance() < amount) throw new RuntimeException("Insufficient balance");

        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);

        userRepository.save(sender);
        userRepository.save(receiver);

        transactionRepository.save(new Transaction(from, to, amount));
    }

    // Admin methods
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        userRepository.delete(user);
    }

    public void suspendUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        user.setSuspended(true);
        userRepository.save(user);
    }
}
