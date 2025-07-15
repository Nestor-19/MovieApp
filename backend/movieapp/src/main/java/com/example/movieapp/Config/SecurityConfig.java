package com.example.movieapp.Config;

import com.example.movieapp.Models.User;
import com.example.movieapp.Repository.UserRepo;
import com.example.movieapp.Service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import java.util.ArrayList;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CurrentUserService currentUserService;
    private final UserRepo userRepo;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
                .requestMatchers("/api/watchlist/**").authenticated()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(new DefaultOAuth2UserService())
                )
                .successHandler((req, res, auth) -> {

                    OAuth2User oauthUser = (OAuth2User) auth.getPrincipal();
                    String email      = oauthUser.getAttribute("email");
                    String givenName  = oauthUser.getAttribute("given_name");
                    String familyName = oauthUser.getAttribute("family_name");

                    User user = userRepo.getUserByEmail(email);
                    if (user == null) {
                        user = new User();
                        user.setFirstname(givenName);
                        user.setLastname(familyName);
                        user.setEmail(email);
                        user.setWatchlist(new ArrayList<>());
                        userRepo.save(user);
                    }
                    currentUserService.setCurrentUser(user);

                    res.sendRedirect("http://localhost:3000/dashboard");
                })
            );

        return http.build();
    }
}
