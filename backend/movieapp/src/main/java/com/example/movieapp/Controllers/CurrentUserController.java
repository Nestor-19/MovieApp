package com.example.movieapp.Controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CurrentUserController {
    
    @GetMapping("/api/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal OidcUser user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
            Map.of(
                "email",  user.getEmail(),
                "firstName", user.getGivenName(),
                "lastName", user.getFamilyName()
            )
        );
    }
}
