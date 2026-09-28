package com.revertpay.account;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name="accounts")
@NoArgsConstructor
@RequiredArgsConstructor
@Setter
@Getter

public class Account {
    @PrePersist
    public void prePersist(){
        this.createdAt=LocalDateTime.now();
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    @NonNull
    private OwnerType ownerType;
    @NonNull
    @Column(nullable = false)
    private Long ownerId;
    @NonNull
    @Column(nullable = false,unique = true)
    private String accountNumber;
    @Column(nullable = false)
    private LocalDateTime createdAt;



//    @Column(nullable = false)
//    @NonNull
//    private String acc_name;
//    @Column(nullable = false,unique = true)
//    @NonNull
//    private String acc_email;
//    @Column(nullable = false)
//    private Long balance=0L;


}
