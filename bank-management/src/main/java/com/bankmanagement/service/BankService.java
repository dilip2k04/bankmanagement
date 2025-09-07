package com.bankmanagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bankmanagement.model.RegistrationRequest;
import com.bankmanagement.model.Transaction;
import com.bankmanagement.model.User;
import com.bankmanagement.repository.RegistrationRequestRepository;
import com.bankmanagement.repository.TransactionRepository;
import com.bankmanagement.repository.UserRepository;

import jakarta.annotation.PostConstruct;

@Service
public class BankService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private RegistrationRequestRepository requestRepository;

    @PostConstruct
    public void initAdmin() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User("admin", "admin@123", "ADMIN", 0, "ADMIN");
            userRepository.save(admin);
        }
    }

    // ---------------- User Registration Requests ----------------
    public RegistrationRequest submitRegistrationRequest(String username, String password, String accountType) {
        if (userRepository.findByUsername(username).isPresent())
            throw new RuntimeException("User already exists!");
        RegistrationRequest req = new RegistrationRequest(username, password, accountType);
        return requestRepository.save(req);
    }

    public List<RegistrationRequest> getPendingRequests() {
        return requestRepository.findByApprovedFalse();
    }

    public User approveRequest(String requestId) {
        RegistrationRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setApproved(true);
        requestRepository.save(req);

        double initialBalance;
        switch (req.getAccountType().toUpperCase()) {
            case "SAVINGS": initialBalance = 5000; break;
            case "FIXED_DEPOSIT": initialBalance = 10000; break;
            default: initialBalance = 1000;
        }

        User user = new User(req.getUsername(), req.getPassword(), "USER", initialBalance, req.getAccountType());
        return userRepository.save(user);
    }

    public void rejectRequest(String requestId) {
        RegistrationRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        requestRepository.delete(req);
    }

    // ---------------- User Methods ----------------
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

    // ---------------- Admin Methods ----------------
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

    public User unsuspendUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        user.setSuspended(false);
        return userRepository.save(user);
    }
}
