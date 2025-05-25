package com.example.movieapp.Config;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class GoogleAuthenticationProvider implements AuthenticationProvider {

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String googleToken = (String) authentication.getPrincipal();

        // TODO: Verify Google token using Google's OAuth API
        if (!isValidGoogleToken(googleToken)) {
            throw new RuntimeException("Invalid Google token");
        }

        return new UsernamePasswordAuthenticationToken(googleToken, null, null);
    }

    private boolean isValidGoogleToken(String token) {
        // Implement actual Google token validation (e.g., via Google API)
        return token != null && !token.isEmpty();
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
