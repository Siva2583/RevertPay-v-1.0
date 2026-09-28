package com.revertpay.user;

import com.revertpay.account.Account;
import com.revertpay.account.AccountService;
import com.revertpay.ledger.LedgerEntry;
import com.revertpay.ledger.LedgerEntryRepository;
import com.revertpay.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.hibernate.boot.model.internal.BinderHelper;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final AccountService accountService;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final JwtService jwtService;

    public UserController(
            UserRepository userRepository,
            AccountService accountService,
            LedgerEntryRepository ledgerEntryRepository,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.accountService = accountService;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.jwtService = jwtService;
    }

    @GetMapping("/me")
    public Map<String, Object> getMyAccount(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization token missing");
        }

        String token = authHeader.substring(7);

        Long userId = jwtService.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountService
                .findByAccountNumber("ACC" + userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        List<LedgerEntry> ledger =
                ledgerEntryRepository.findByAccountId(account.getId());

        BigDecimal debits=new BigDecimal(0);
        BigDecimal credits=new BigDecimal(0);

        for (LedgerEntry entry : ledger) {
            if (entry.getType().name().equals("CREDIT")) {
                credits = credits.add(entry.getAmount());
            } else {
                debits = debits.add(entry.getAmount());
            }
        }

        BigDecimal balance = credits.subtract(debits);

        Map<String, Object> response = new HashMap<>();

        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("name", user.getName());
        response.put("balance", balance);

        Map<String, Object> accountData = new HashMap<>();
        accountData.put("id", account.getId());
        accountData.put("accountNumber", account.getAccountNumber());
        accountData.put("ownerId", account.getOwnerId());
        accountData.put("ownerType", account.getOwnerType());

        response.put("account", accountData);
        response.put("ledger", ledger);

        return response;
    }
}