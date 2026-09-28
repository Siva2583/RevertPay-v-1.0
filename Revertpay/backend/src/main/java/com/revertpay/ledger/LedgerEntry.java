package com.revertpay.ledger;
import com.revertpay.account.Account;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@NoArgsConstructor
@Entity
@Getter
@Setter
public class LedgerEntry {
    @PrePersist
    public void prePersist(){
        this.createdAt = LocalDateTime.now();
    }
    @ManyToOne
    @NonNull
    private Account account;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long entry_id;
    public LedgerEntry(Account account) {
        this.account = account;
    }
    @Enumerated(EnumType.STRING)
    @NonNull
    private Type type;
    @NonNull
    private BigDecimal amount;
    private LocalDateTime createdAt;
    private long reference_id;



}
