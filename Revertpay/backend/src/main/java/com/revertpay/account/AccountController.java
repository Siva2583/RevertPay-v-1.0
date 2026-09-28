package com.revertpay.account;

import com.revertpay.ledger.LedgerEntry;
import com.revertpay.ledger.LedgerEntryRepository;
import com.revertpay.ledger.Type;
import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @PostConstruct
    public void init() {
        System.out.println(" ACCOUNT CONTROLLER CREATED");
    }

    private final AccountService accountService;
    private final LedgerEntryRepository ledgerEntryRepository;


    public AccountController(AccountService accountService, LedgerEntryRepository ledgerEntryRepository) {
        this.accountService = accountService;
        this.ledgerEntryRepository = ledgerEntryRepository;
    }

    @GetMapping("/{acc_no}")
    public Optional<Account> findAcc(@PathVariable String acc_no) {
        System.out.println("ACCOUNT CONTROLLER HIT: " + acc_no);
        return accountService.findByAccountNumber(acc_no);
    }
    @GetMapping("/{acc_no}/ledger")
    public List<LedgerEntry> getLedger(@PathVariable String acc_no) {

        Account account = accountService
                .findByAccountNumber(acc_no)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return ledgerEntryRepository.findByAccountId(account.getId());
    }
    @GetMapping("/{acc_no}/balance")
    public BigDecimal findBalance(@PathVariable String acc_no) {
        System.out.println("ACCOUNT CONTROLLER HIT: " + acc_no);
        Optional<Account> account= accountService.findByAccountNumber(acc_no);
        Long id=accountService.findByAccountNumber(acc_no).get().getId();
        List<LedgerEntry> entries=ledgerEntryRepository.findByAccountId(id);
        BigDecimal debit=new BigDecimal(0);
        BigDecimal credit=new BigDecimal(0);
        for(LedgerEntry l:entries){
            if (l.getType() == Type.DEBIT) {
                debit = debit.add(l.getAmount());
            } else {
                credit = credit.add(l.getAmount());
            }

        }
        BigDecimal balance=credit.subtract(debit);
        return balance;

    }

    @PostMapping("/new")
    public Account saveAccount(@RequestBody Account account) {
        return accountService.saveAccount(account);
    }
}