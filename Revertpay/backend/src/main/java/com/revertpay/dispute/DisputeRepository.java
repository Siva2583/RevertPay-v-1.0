package com.revertpay.dispute;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DisputeRepository extends JpaRepository<Dispute,Long> {
}
