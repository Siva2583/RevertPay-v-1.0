package com.revertpay.ledger;

import com.revertpay.account.Account;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service

public class LedgerService {

    private LedgerEntryRepository ledgerEntryRepository;

    public LedgerService(LedgerEntryRepository ledgerEntryRepository) {
        this.ledgerEntryRepository = ledgerEntryRepository;
    }
    public void doDebit(Account account, BigDecimal amount, long referenceId){
        LedgerEntry ledgerEntry=new LedgerEntry();
        ledgerEntry.setType(Type.DEBIT);
        ledgerEntry.setAccount(account);
        ledgerEntry.setAmount(amount);
        ledgerEntry.setReference_id(referenceId);
        ledgerEntryRepository.save(ledgerEntry);

    }
    public void doCredit(Account account,BigDecimal amount,long referenceId){
        LedgerEntry ledgerEntry=new LedgerEntry();
        ledgerEntry.setAccount(account);
        ledgerEntry.setType(Type.CREDIT);
        ledgerEntry.setAmount(amount);
        ledgerEntry.setReference_id(referenceId);
        ledgerEntryRepository.save(ledgerEntry);

    }
    @Transactional
    public void transfer(Account account1, Account account2, BigDecimal amount, long referenceId){

        doDebit(account1,amount,referenceId);
        doCredit(account2,amount,referenceId);
    }

}