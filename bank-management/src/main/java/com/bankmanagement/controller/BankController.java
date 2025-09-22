package com.bankmanagement.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bankmanagement.model.RegistrationRequest;
import com.bankmanagement.model.Transaction;
import com.bankmanagement.model.User;
import com.bankmanagement.service.BankService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class BankController {

    @Autowired
    private BankService service;

    // -------------------- User Endpoints --------------------
    @PostMapping("/register")
    public RegistrationRequest register(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String accountType) {
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Username and password are required");
        }
        if (!List.of("CHECKING", "SAVINGS", "FIXED_DEPOSIT").contains(accountType.toUpperCase())) {
            throw new IllegalArgumentException("Invalid account type");
        }
        return service.submitRegistrationRequest(username.trim(), password.trim(), accountType.toUpperCase());
    }

    @PostMapping("/login")
    public User login(
            @RequestParam String username,
            @RequestParam String password) {
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Username and password are required");
        }
        return service.login(username.trim(), password.trim());
    }

    @GetMapping("/balance/{username}")
    public double checkBalance(@PathVariable String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        return service.checkBalance(username.trim());
    }

    @GetMapping("/transactions/{username}")
    public Page<Transaction> getTransactions(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        Pageable pageable = PageRequest.of(page, size);
        return service.getTransactions(username.trim(), pageable);
    }

    @GetMapping("/transactions/{username}/csv")
    public void downloadTransactionsCsv(
            @PathVariable String username,
            HttpServletResponse response) throws IOException {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        List<Transaction> transactions = service.getTransactions(username.trim());

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=" + username.trim() + "_transactions.csv");

        PrintWriter writer = response.getWriter();
        writer.println("From,To,Amount,Date");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for (Transaction t : transactions) {
            String formattedDate = t.getDate() != null ? dateFormat.format(t.getDate()) : "";
            writer.println(String.format("%s,%s,%.2f,%s",
                    t.getFromUser() != null ? t.getFromUser() : "N/A",
                    t.getToUser() != null ? t.getToUser() : "N/A",
                    t.getAmount(),
                    formattedDate));
        }
        writer.flush();
        writer.close();
    }

    @PostMapping("/transfer")
    public String transfer(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam double amount) {
        if (from == null || from.trim().isEmpty() || to == null || to.trim().isEmpty()) {
            throw new IllegalArgumentException("Sender and receiver usernames are required");
        }
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        service.transferMoney(from.trim(), to.trim(), amount);
        return "Transfer successful!";
    }

    // -------------------- Admin Endpoints --------------------
    @GetMapping("/admin/users")
    public Page<User> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "all") String filter) {
        Pageable pageable = PageRequest.of(page, size);
        return service.getAllUsers(pageable, search.trim(), filter);
    }

    @DeleteMapping("/admin/user/{username}")
    public String deleteUser(@PathVariable String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        service.deleteUser(username.trim());
        return "User deleted successfully";
    }

    @PutMapping("/admin/user/{username}/suspend")
    public String suspendUser(@PathVariable String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        service.suspendUser(username.trim());
        return "User suspended successfully";
    }

    @PutMapping("/admin/user/{username}/unsuspend")
    public User unsuspendUser(@PathVariable String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        return service.unsuspendUser(username.trim());
    }

    // -------------------- Admin Registration Approval --------------------
   @GetMapping("/admin/requests")
    public Page<RegistrationRequest> getPendingRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "all") String filter) {
        Pageable pageable = PageRequest.of(page, size);
        return service.getPendingRequests(pageable, search.trim(), filter);
    }

    @PostMapping("/admin/request/{id}/approve")
    public User approveRequest(@PathVariable String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Request ID is required");
        }
        return service.approveRequest(id.trim());
    }

    @DeleteMapping("/admin/request/{id}/reject")
    public String rejectRequest(@PathVariable String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("Request ID is required");
        }
        service.rejectRequest(id.trim());
        return "Registration request rejected successfully";
    }
}