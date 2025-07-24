package com.example.movieapp.Gateway;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;


@RestController
@RequestMapping("/api/recommendations")
public class RecommendationGatewayController {
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${reco.fastapi.base-url}")
    private String recoServiceBase;

    @PostMapping
    public ResponseEntity<?> forward(@RequestBody Map<String, Object> body) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        String url = recoServiceBase + "/recommend";

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            return ResponseEntity
                    .status(response.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response.getBody());
        } catch (HttpStatusCodeException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ex.getResponseBodyAsString());
        }
        
    }

}
