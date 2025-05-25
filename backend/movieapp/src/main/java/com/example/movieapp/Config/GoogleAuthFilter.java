package com.example.movieapp.Config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

public class GoogleAuthFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;

    public GoogleAuthFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
        setFilterProcessesUrl("/api/auth/google"); // Custom endpoint for Google authentication
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String googleToken = request.getHeader("Authorization");
        if (googleToken == null || !googleToken.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Google token");
        }

        googleToken = googleToken.replace("Bearer ", "");
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(googleToken, null);
        return authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        logger.info("Google authentication successful! User: " + authResult.getName());

        // You can add any additional logic here like generating a JWT token or user session
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");

        // Example response could include user information or a JWT
        response.getWriter().write("{\"message\":\"Authentication successful\",\"user\":\"" + authResult.getName() + "\"}");
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        logger.error("Authentication failed: " + failed.getMessage());

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        // You can send back a more descriptive error message
        response.getWriter().write("{\"message\":\"Authentication failed\", \"error\": \"" + failed.getMessage() + "\"}");
    }
}
