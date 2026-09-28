package com.revertpay.account;

import com.revertpay.ledger.LedgerService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class AccountService {

    private final AccountRepository acc_repo;
    private final LedgerService ledgerService;

    public AccountService(
            AccountRepository acc_repo,
            LedgerService ledgerService
    ) {
        this.acc_repo = acc_repo;
        this.ledgerService = ledgerService;
    }

    public void createEscrowHoldingAccount() {

        System.out.println("========== ESCROW STARTUP CHECK ==========");

        boolean exists =
                acc_repo.existsByAccountNumber("ESCROW_HOLDING");

        System.out.println("ESCROW EXISTS: " + exists);

        if (!exists) {

            System.out.println("CREATING ESCROW ACCOUNT...");

            Account account = new Account();

            account.setOwnerType(OwnerType.SYSTEM);
            account.setOwnerId(0L);
            account.setAccountNumber("ESCROW_HOLDING");

            Account savedAccount = acc_repo.save(account);

            System.out.println(
                    "ESCROW CREATED WITH ID: " + savedAccount.getId()
            );

        } else {
            System.out.println("ESCROW ALREADY EXISTS");
        }

        System.out.println("==========================================");
    }


    public Optional<Account> findByAccountNumber(String accountNumber) {
        return acc_repo.findByAccountNumber(accountNumber);
    }

    public Account saveAccount(Account account) {
        return acc_repo.save(account);
    }

    public Account createAccount(
            OwnerType ownerType,
            Long ownerId,
            String accountNumber
    ) {

        System.out.println("CREATE ACCOUNT METHOD HIT");

        Account account = new Account();

        account.setOwnerType(ownerType);
        account.setOwnerId(ownerId);
        account.setAccountNumber(accountNumber);

        Account savedAccount = acc_repo.save(account);

        System.out.println(
                "ACCOUNT SAVED WITH ID: " + savedAccount.getId()
        );

        // Give newly created USER accounts demo funding
        if (ownerType == OwnerType.USER) {

            Account escrowHoldingAccount =
                    acc_repo.findByAccountNumber("ESCROW_HOLDING")
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "ESCROW_HOLDING account not found"
                                    )
                            );

            ledgerService.transfer(
                    escrowHoldingAccount,
                    savedAccount,new BigDecimal(5000),
                    savedAccount.getId()
            );

            System.out.println(
                    "INITIAL FUNDING: ₹5000 CREDITED TO ACCOUNT "
                            + savedAccount.getAccountNumber()
            );
        }

        return savedAccount;
    }
}