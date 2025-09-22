package com.bankmanagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.bankmanagement.model.RegistrationRequest;
import com.bankmanagement.model.Transaction;
import com.bankmanagement.model.User;
import com.bankmanagement.repository.RegistrationRequestRepository;
import com.bankmanagement.repository.TransactionRepository;
import com.bankmanagement.repository.UserRepository;

@Service
public class BankService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RegistrationRequestRepository requestRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public RegistrationRequest submitRegistrationRequest(String username, String password, String accountType) {
        RegistrationRequest request = new RegistrationRequest();
        request.setUsername(username);
        request.setPassword(password);
        request.setAccountType(accountType);
        request.setInitialBalance(accountType.equals("SAVINGS") ? 5000 : 0);
        request.setApproved(false);
        return requestRepository.save(request);
    }

    public User login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        throw new RuntimeException("Invalid credentials");
    }

    public double checkBalance(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(User::getBalance).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Transaction> getTransactions(String username) {
        return transactionRepository.findByFromUserOrToUser(username, username);
    }

    public Page<Transaction> getTransactions(String username, Pageable pageable) {
        return transactionRepository.findByFromUserOrToUser(username, username, pageable);
    }

    public void transferMoney(String from, String to, double amount) {
        Optional<User> fromUser = userRepository.findByUsername(from);
        Optional<User> toUser = userRepository.findByUsername(to);
        if (!fromUser.isPresent() || !toUser.isPresent()) {
            throw new RuntimeException("User not found");
        }
        if (fromUser.get().getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }
        fromUser.get().setBalance(fromUser.get().getBalance() - amount);
        toUser.get().setBalance(toUser.get().getBalance() + amount);
        userRepository.save(fromUser.get());
        userRepository.save(toUser.get());

        Transaction transaction = new Transaction();
        transaction.setFromUser(from);
        transaction.setToUser(to);
        transaction.setAmount(amount);
        transaction.setDate(new java.util.Date());
        transactionRepository.save(transaction);
    }

    public Page<User> getAllUsers(Pageable pageable, String search, String filter) {
        if (!search.isEmpty()) {
            return userRepository.findByUsernameContainingIgnoreCase(search, pageable);
        }
        if (!filter.equals("all")) {
            if (filter.equals("active")) {
                return userRepository.findBySuspended(false, pageable);
            } else if (filter.equals("suspended")) {
                return userRepository.findBySuspended(true, pageable);
            } else {
                return userRepository.findByRole(filter, pageable);
            }
        }
        return userRepository.findAll(pageable);
    }

    public void deleteUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (!user.isPresent()) {
            throw new RuntimeException("User not found");
        }
        userRepository.delete(user.get());
    }

    public void suspendUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (!user.isPresent()) {
            throw new RuntimeException("User not found");
        }
        user.get().setSuspended(true);
        userRepository.save(user.get());
    }

    public User unsuspendUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (!user.isPresent()) {
            throw new RuntimeException("User not found");
        }
        user.get().setSuspended(false);
        return userRepository.save(user.get());
    }

    public Page<RegistrationRequest> getPendingRequests(Pageable pageable, String search, String filter) {
        if (!search.isEmpty()) {
            return requestRepository.findByApprovedFalseAndUsernameContainingIgnoreCase(search, pageable);
        }
        if (!filter.equals("all")) {
            return requestRepository.findByApprovedFalseAndAccountType(filter, pageable);
        }
        return requestRepository.findByApprovedFalse(pageable);
    }

    public User approveRequest(String id) {
        Optional<RegistrationRequest> request = requestRepository.findById(id);
        if (!request.isPresent()) {
            throw new RuntimeException("Request not found");
        }
        RegistrationRequest req = request.get();
        req.setApproved(true);
        requestRepository.save(req);

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(req.getPassword());
        user.setRole("USER");
        user.setAccountType(req.getAccountType());
        user.setBalance(req.getInitialBalance());
        return userRepository.save(user);
    }

    public void rejectRequest(String id) {
        Optional<RegistrationRequest> request = requestRepository.findById(id);
        if (!request.isPresent()) {
            throw new RuntimeException("Request not found");
        }
        requestRepository.delete(request.get());
    }
}