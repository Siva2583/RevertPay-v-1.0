package com.revertpay.ledger;

import com.revertpay.account.Account;
import com.revertpay.account.AccountRepository;
import com.revertpay.dto.TransferRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping(value="/api/auth/")
public class LedgerController {
    private final AccountRepository accountRepository;
    private final LedgerService ledgerService;
    public LedgerController(AccountRepository accountRepository, LedgerService ledgerService){
        this.accountRepository = accountRepository;
        this.ledgerService=ledgerService;
    }
    @PostMapping(value ="/transfer")
    public String transfer(@RequestBody TransferRequest transferRequest){
        String acc1s=transferRequest.getAccount1();
        String acc2s=transferRequest.getAccount2();
        BigDecimal amount= transferRequest.getAmount();
        Long referenceId=transferRequest.getReferenceId();
        Account account1 = accountRepository
                .findByAccountNumber(acc1s)
                .orElseThrow(() -> new RuntimeException("From account not found"));

        Account account2 = accountRepository
                .findByAccountNumber(acc2s)
                .orElseThrow(() -> new RuntimeException("To account not found"));
        if(amount.compareTo(BigDecimal.ZERO) <= 0) return "Enter valid Amount!!";
        if(acc1s.equals(acc2s)){
            return "Enter different Account number!!";
        }

        ledgerService.transfer(account1, account2, amount, referenceId);
        return "Successful transfer!!!";


    }




}
