package com.revertpay.ledger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry,Long> {
    public List<LedgerEntry> findByAccountId(Long id);

}
