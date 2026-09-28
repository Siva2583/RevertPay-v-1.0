package com.revertpay.escrow;
import com.revertpay.account.Account;
import com.revertpay.account.AccountRepository;
import com.revertpay.account.AccountService;
import com.revertpay.dto.EscrowInitiateRequest;
import com.revertpay.dto.EscrowInitiateResponse;
import com.revertpay.ledger.LedgerService;
import com.revertpay.security.JwtService;
import com.revertpay.user.Role;
import com.revertpay.user.User;
import com.revertpay.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EscrowService {
    private final EscrowTransitionService transitionService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final EscrowRepository escrowRepository;
    private final AccountService accountService;
    private final AccountRepository accountRepository;
    private final LedgerService ledgerService;
    public EscrowService(
            EscrowTransitionService transitionService, EscrowRepository escrowRepository,
            UserRepository userRepository,
            JwtService jwtService,
            AccountService accountService,
            AccountRepository accountRepository,
            LedgerService ledgerService
    ) {
        this.transitionService = transitionService;
        this.escrowRepository = escrowRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.accountService = accountService;
        this.accountRepository=accountRepository;
        this.ledgerService=ledgerService;
    }
    public EscrowInitiateResponse cancelTransaction(Long id, String token) {

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }
        EscrowTransaction transaction = escrowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Escrow transaction not found"));

        Long buyerId = jwtService.extractUserId(token);
        Long escrowBuyerId = transaction.getBuyer().getId();

        if (!buyerId.equals(escrowBuyerId)) {
            throw new RuntimeException("Mismatched Credentials!!");
        }

//        if (transaction.getStatus() != EscrowStatus.PAYMENT_INITIATED) {
//            throw new RuntimeException(
//                    "Escrow cannot be cancelled from status: " + transaction.getStatus()
//            );
//        }
        transitionService.transition(transaction,EscrowStatus.CANCELLED,escrowBuyerId,"Payment Cancelled!");
        //transaction.setStatus(EscrowStatus.CANCELLED);
        EscrowTransaction savedTransaction = escrowRepository.save(transaction);
        EscrowInitiateResponse response = new EscrowInitiateResponse();
        response.setEscrowid(savedTransaction.getId());
        response.setSellername(savedTransaction.getSeller().getName());
        response.setItemName(savedTransaction.getItemName());
        response.setAmount(savedTransaction.getAmount());
        response.setStatus(savedTransaction.getStatus());

        return response;
    }
    public EscrowInitiateResponse confirmTransaction(Long id, String token) {

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }
        EscrowTransaction transaction = escrowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Escrow transaction not found"));

        Long buyerId = jwtService.extractUserId(token);
        Long escrowBuyerId = transaction.getBuyer().getId();

        if (!buyerId.equals(escrowBuyerId)) {
            throw new RuntimeException("Mismatched Credentials!!");
        }

//        if (transaction.getStatus() != EscrowStatus.PAYMENT_INITIATED) {
//            throw new RuntimeException(
//                    "Escrow cannot be confirmed from status: " + transaction.getStatus()
//            );
//        }
//        transaction.setStatus(EscrowStatus.CREATED);
        transitionService.transition(transaction,EscrowStatus.CREATED,escrowBuyerId,"Payment Initiated!");
        EscrowTransaction savedTransaction = escrowRepository.save(transaction);
        EscrowInitiateResponse response = new EscrowInitiateResponse();
        response.setEscrowid(savedTransaction.getId());
        response.setSellername(savedTransaction.getSeller().getName());
        response.setItemName(savedTransaction.getItemName());
        response.setAmount(savedTransaction.getAmount());
        response.setStatus(savedTransaction.getStatus());

        return response;
    }

    public EscrowInitiateResponse transactionRequest(
            EscrowInitiateRequest req,
            String token,
            String idempotencyKey
    ) {

        Optional<Account> account =
                accountService.findByAccountNumber(req.getSellerAccountNumber());

        Account sellerAccount = account.orElseThrow(
                () -> new RuntimeException("Seller account not found")
        );

        Long sellerId = sellerAccount.getOwnerId();

        BigDecimal amount = req.getAmount();
        String itemName = req.getItemName();

        EscrowInitiateResponse res = new EscrowInitiateResponse();

        if (!jwtService.isTokenValid(token)) {
            return res;
        }

        Long buyerId = jwtService.extractUserId(token);

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Invalid Buyer Creds!!"));

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Invalid Seller Creds!!"));

        if (seller.getRole() != Role.SELLER) {
            throw new RuntimeException("Selected user is not a seller");
        }

        if (buyerId.equals(sellerId)) {
            throw new RuntimeException("Buyer cannot be the seller");
        }

        if (buyer.getRole() != Role.BUYER) {
            throw new RuntimeException("Only buyers can initiate escrow");
        }

        EscrowTransaction escrowTransaction = new EscrowTransaction();
        escrowTransaction.setBuyer(buyer);
        escrowTransaction.setSeller(seller);
        escrowTransaction.setItemName(itemName);
        escrowTransaction.setAmount(amount);
        escrowTransaction.setStatus(EscrowStatus.PAYMENT_INITIATED);
        escrowTransaction.setCreatedAt(LocalDateTime.now());
        escrowTransaction.setIdempotencyKey(idempotencyKey);
        LocalDateTime now = LocalDateTime.now();
        escrowTransaction.setCreatedAt(now);
        escrowTransaction.setConfirmationDeadline(now.plusSeconds(40));

        EscrowTransaction savedEscrow = escrowRepository.save(escrowTransaction);
        Long eid=savedEscrow.getId();
        res.setEscrowid(eid);
        res.setStatus(savedEscrow.getStatus());
        res.setSellername(seller.getName());
        res.setAmount(savedEscrow.getAmount());
        res.setItemName(savedEscrow.getItemName());
        checkExpiry(eid);
        return res;
    }
    public String checkExpiry(Long id) {
        EscrowTransaction transaction = escrowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invalid!!"));

        LocalDateTime deadline = transaction.getConfirmationDeadline();

        if (deadline != null && LocalDateTime.now().isAfter(deadline)) {
            transitionService.transition(
                    transaction,
                    EscrowStatus.EXPIRED,null,"Expired Session"
            );
            escrowRepository.save(transaction);
            return "Expired!!";
        }

        return "Valid!!";
    }
    @Transactional
    public EscrowInitiateResponse fundTransaction(Long id, String token) {
        EscrowInitiateResponse res=new EscrowInitiateResponse();
        if(!(jwtService.isTokenValid(token))){
            throw new RuntimeException("Invalid Token!!");
        }
        EscrowTransaction transaction =escrowRepository.findById(id).orElseThrow(()-> new RuntimeException("Invalid Transaction!!"));
        Long token_id=jwtService.extractUserId(token);
        Long transaction_id=transaction.getBuyer().getId();
        if(!token_id.equals(transaction_id)){
            throw new RuntimeException("Invalid matching!!");
        }
//        if(!(transaction.getStatus()==EscrowStatus.CREATED)){
//            throw new RuntimeException("Payment Rejected!!");
//        }
        Account buyer=accountRepository.findByAccountNumber("ACC"+token_id).orElseThrow(()->new RuntimeException("Invalid Creds!!"));
        Account escrow_acc=accountRepository.findByAccountNumber("ESCROW_HOLDING").orElseThrow(()->new RuntimeException("No escrow!!"));
        BigDecimal amount=transaction.getAmount();

        ledgerService.transfer(buyer,escrow_acc,amount,transaction.getId());
        //transaction.setStatus(EscrowStatus.FUNDED);
        transitionService.transition(transaction,EscrowStatus.FUNDED,token_id,"Funded Successfully!");
        escrowRepository.save(transaction);
        res.setEscrowid(id);
        res.setSellername(transaction.getSeller().getName());
        res.setItemName(transaction.getItemName());
        res.setAmount(amount);
        res.setStatus(transaction.getStatus());
        return res;
    }

    public void shipTransaction(Long id, String token) {
        if(!jwtService.isTokenValid(token)) throw new RuntimeException("Invalid Token!!");
        Long t_sellerid= jwtService.extractUserId(token);
        EscrowTransaction transaction=escrowRepository.findById(id).orElseThrow(()-> new RuntimeException("No Escrow Found!!"));
        Long esc_sellerid=transaction.getSeller().getId();
        if(!t_sellerid.equals(esc_sellerid)) throw new RuntimeException("Invalid Mathc!!");
//        if(transaction.getStatus() != EscrowStatus.FUNDED) {
//            throw new RuntimeException("Escrow cannot be shipped!!");
//        }
//        transaction.setStatus(EscrowStatus.SHIPPED);
        transitionService.transition(transaction,EscrowStatus.SHIPPED,t_sellerid,"Shipment Done Successfully!!");
        LocalDateTime present=LocalDateTime.now();
        transaction.setShippedAt(present);
        transaction.setAutoReleaseAt(present.plusMinutes(5));
        escrowRepository.save(transaction);

    }

    public List<EscrowTransaction> getTransactions(String token,String role) {
        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid Token!!");
        }
        Long id = jwtService.extractUserId(token);
        if(role.equals("seller")){
            return escrowRepository.findBySellerId(id);
        }
        //Long buyerId= jwtService.extractUserId(token);
        return escrowRepository.findByBuyerId(id);
    }
    @Transactional
    public void confirmEscrow(Long id, String token) {
        Long tokenId= jwtService.extractUserId(token);
        EscrowTransaction transaction=escrowRepository.findById(id).orElseThrow(()->new RuntimeException("Invalid Escrow!!"));

        Long buyerId = transaction.getBuyer().getId();
        Long sellerId = transaction.getSeller().getId();
        Account seller=accountRepository.findByAccountNumber("ACC"+sellerId).orElseThrow(()->new RuntimeException());
        if (!buyerId.equals(tokenId)) {
            throw new RuntimeException("Invalid Credentials!!");
        }
//        if(transaction.getStatus() != EscrowStatus.SHIPPED) {
//            throw new RuntimeException("Escrow cannot be shipped!!");
//        }

        Account escrow=accountRepository.findByAccountNumber("ESCROW_HOLDING").orElseThrow(()->new RuntimeException("No Escrow!!"));
        ledgerService.transfer(escrow,seller,transaction.getAmount(),transaction.getId());
        //transaction.setStatus(EscrowStatus.RELEASED);
        transitionService.transition(transaction,EscrowStatus.RELEASED, tokenId,"Funds Released Successfully!");
        escrowRepository.save(transaction);



    }
}
