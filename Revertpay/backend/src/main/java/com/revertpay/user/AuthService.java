package com.revertpay.user;

import com.revertpay.account.Account;
import com.revertpay.account.AccountService;
import com.revertpay.account.OwnerType;
import com.revertpay.dto.LoginRequest;
import com.revertpay.dto.RegisterRequest;
import com.revertpay.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AccountService accountService;

    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User(request.getName(),
                request.getEmail(),
                hashedPassword
        );

        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        System.out.println("USER SAVED: " + savedUser.getId());

        Account createdAccount = accountService.createAccount(
                OwnerType.USER,
                savedUser.getId(),
                "ACC" + savedUser.getId()
        );

        System.out.println(
                "ACCOUNT CREATED: " + createdAccount.getAccountNumber()
        );
    }

    public String verify(LoginRequest loginRequest) {

        User user = userRepository
                .findByEmail(loginRequest.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        boolean passwordMatches =
                passwordEncoder.matches(
                        loginRequest.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtService.generateToken(user);
    }
}