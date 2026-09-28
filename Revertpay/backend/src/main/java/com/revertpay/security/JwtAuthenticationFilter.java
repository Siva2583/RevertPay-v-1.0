package com.revertpay.security;

import com.revertpay.user.User;
import com.revertpay.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        System.out.println("========== JWT FILTER HIT ==========");
        System.out.println("REQUEST: " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");

        System.out.println("AUTH HEADER: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("NO VALID BEARER HEADER");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        System.out.println("TOKEN RECEIVED: " + token);

        boolean valid = jwtService.isTokenValid(token);

        System.out.println("TOKEN VALID: " + valid);

        if (valid) {

            Long userId = jwtService.extractUserId(token);

            System.out.println("USER ID FROM TOKEN: " + userId);

            Optional<User> user = userRepository.findById(userId);

            System.out.println("USER FOUND: " + user.isPresent());

            if (user.isPresent()) {

                User actualUser = user.get();

                System.out.println("AUTHENTICATING USER: "
                        + actualUser.getEmail());

                System.out.println("ROLE: "
                        + actualUser.getRole());

                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                "ROLE_" + actualUser.getRole().name()
                        );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                actualUser,
                                null,
                                List.of(authority)
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

                System.out.println("AUTHENTICATION SUCCESSFULLY SET!");
            }
        }

        System.out.println("====================================");

        filterChain.doFilter(request, response);
    }
}