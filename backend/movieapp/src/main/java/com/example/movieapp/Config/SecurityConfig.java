package com.example.movieapp.Config;

import com.example.movieapp.Models.User;
import com.example.movieapp.Repository.UserRepo;
import com.example.movieapp.Service.CurrentUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;

import java.util.ArrayList;
import java.util.List;
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CurrentUserService currentUserService;
    private final UserRepo userRepo;

    @Autowired
    public SecurityConfig(CurrentUserService currentUserService, UserRepo userRepo) {
        this.currentUserService = currentUserService;
        this.userRepo = userRepo;
    }

    @Bean
    public AuthenticationManager authenticationManager(GoogleAuthenticationProvider googleAuthProvider) {
        return new ProviderManager(List.of(googleAuthProvider));
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF protection (be careful with this)
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**","/api/movies").permitAll() // Allow OPTIONS requests
                        .requestMatchers("/api/watchlist/**").authenticated()
                        .anyRequest().authenticated() // Ensure other requests require authentication
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler((request, response, authentication) -> {
                            // After successful login, access the authenticated OAuth2 user
                            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

                            // Extract user details (e.g., from Google)
                            String username = oAuth2User.getName();
                            String email = (String) oAuth2User.getAttributes().get("email");
                            String givenName = (String) oAuth2User.getAttributes().get("given_name");
                            String familyName = (String) oAuth2User.getAttributes().get("family_name");

                            // Check if the user already exists in your database
                            User user = userRepo.getUserByEmail(email);
                            if (user == null) {
                                // If user doesn't exist, create a new user
                                user = new User();
                                user.setFirstname(givenName);
                                user.setLastname(familyName);
                                user.setEmail(email);
                                user.setCredits(20);
                                user.setWatchlist(new ArrayList<>());
                                userRepo.save(user);
                            }else{
                                System.out.println("User exists");
                            }

                            // Optionally, store the current user in a custom context if necessary
                            currentUserService.setCurrentUser(user);

                            // Redirect to your dashboard after successful login
                            response.sendRedirect("http://localhost:3000/dashboard");
                        })
                );
        return http.build();
    }
}
