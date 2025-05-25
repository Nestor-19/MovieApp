package com.example.movieapp.Config;


import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@RestController
public class OAuth2CallbackController {

    private final ClientRegistrationRepository clientRegistrationRepository;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public OAuth2CallbackController(ClientRegistrationRepository clientRegistrationRepository,
                                    OAuth2AuthorizedClientService authorizedClientService) {
        this.clientRegistrationRepository = clientRegistrationRepository;
        this.authorizedClientService = authorizedClientService;
    }

    @RequestMapping("/login/oauth2/code/google")
    public ResponseEntity<String> handleGoogleCallback(@RequestParam("code") String code) {
        // Get your Google OAuth2 Client Registration
        ClientRegistration clientRegistration = clientRegistrationRepository.findByRegistrationId("google");

        // Send POST request to Google's token endpoint to exchange the authorization code for an access token
        String tokenEndpoint = "https://oauth2.googleapis.com/token";
        String clientId = clientRegistration.getClientId();
        String clientSecret = clientRegistration.getClientSecret();

        // Prepare the body for the POST request
        String body = "code=" + code +
                "&client_id=" + clientId +
                "&client_secret=" + clientSecret +
                "&redirect_uri=" + clientRegistration.getRedirectUri() +
                "&grant_type=authorization_code";

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(tokenEndpoint, body, String.class);

        // Parse the access token from the response
        String accessToken = parseAccessToken(responseEntity.getBody());

        // Use the access token to retrieve user info
        String userInfoEndpoint = "https://www.googleapis.com/oauth2/v2/userinfo";
        String userInfoResponse = restTemplate.getForObject(userInfoEndpoint + "?access_token=" + accessToken, String.class);

        // Parse user info, create user entity, and authenticate the user
        // After this, redirect the user to your dashboard page
        return ResponseEntity.status(302).header("Location", "http://localhost:3000/dashboard").build();
    }

    private String parseAccessToken(String responseBody) {
        // Parse the response to extract the access token
        // (In production, use a JSON library like Jackson to deserialize the response)
        return responseBody.split("&")[0].split("=")[1];
    }
}
