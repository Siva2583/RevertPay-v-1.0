package com.revertpay.dto;

import com.revertpay.account.Account;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TransferRequest {
    @NotBlank
    String account1;
    @NotBlank
    String account2;

    private BigDecimal amount;

    private long referenceId;


}
