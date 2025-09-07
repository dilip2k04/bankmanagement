package com.bankmanagement.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
        @RequestParam String accountType)
 {
        // Submits registration request for admin approval
        return service.submitRegistrationRequest(username, password, accountType);
    }

    @PostMapping("/login")
    public User login(
            @RequestParam String username,
            @RequestParam String password) {
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

    @GetMapping("/transactions/{username}/csv")
    public void downloadTransactionsCsv(
            @PathVariable String username,
            HttpServletResponse response) throws IOException {
        List<Transaction> transactions = service.getTransactions(username);

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=transactions.csv");

        PrintWriter writer = response.getWriter();
        writer.println("From,To,Amount,Date");
        for (Transaction t : transactions) {
            writer.println(t.getFromUser() + "," + t.getToUser() + "," + t.getAmount() + "," + t.getDate());
        }
        writer.flush();
        writer.close();
    }

    @PostMapping("/transfer")
    public String transfer(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam double amount) {
        service.transferMoney(from, to, amount);
        return "Transfer successful!";
    }

    // -------------------- Admin Endpoints --------------------
    @GetMapping("/admin/users")
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    @DeleteMapping("/admin/user/{username}")
    public String deleteUser(@PathVariable String username) {
        service.deleteUser(username);
        return "User deleted successfully";
    }

    @PutMapping("/admin/user/{username}/suspend")
    public String suspendUser(@PathVariable String username) {
        service.suspendUser(username);
        return "User suspended successfully";
    }

    @PutMapping("/admin/user/{username}/unsuspend")
    public User unsuspendUser(@PathVariable String username) {
        return service.unsuspendUser(username);
    }

    // -------------------- Admin Registration Approval --------------------
    @GetMapping("/admin/requests")
    public List<RegistrationRequest> getPendingRequests() {
        return service.getPendingRequests();
    }

    @PostMapping("/admin/request/{id}/approve")
    public User approveRequest(@PathVariable String id) {
        return service.approveRequest(id);
    }

    @DeleteMapping("/admin/request/{id}/reject")
    public String rejectRequest(@PathVariable String id) {
        service.rejectRequest(id);
        return "Registration request rejected successfully";
    }
}
