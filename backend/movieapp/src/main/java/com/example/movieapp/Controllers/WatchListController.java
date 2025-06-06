package com.example.movieapp.Controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.movieapp.Models.Movie;

import com.example.movieapp.Service.WatchListService;
import com.example.movieapp.dtos.WatchListItemDto;

@RestController
@RequestMapping("/api/watchlist")
public class WatchListController {
    private final WatchListService watchListService;

    public WatchListController(WatchListService watchListService) {
        this.watchListService = watchListService;
    }

    @GetMapping
    public List<WatchListItemDto> getWatchlist(@AuthenticationPrincipal OidcUser oidcUser) {
        return watchListService.getWatchlist(oidcUser.getEmail());
    }

    @PostMapping
    public ResponseEntity<Void> add(@AuthenticationPrincipal OidcUser oidcUser, @RequestBody Movie movie) {
        watchListService.addMovie(oidcUser.getEmail(), movie);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }



    @DeleteMapping("/{tmdbId}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal OidcUser oidcUser, @PathVariable Integer tmdbId) {
        watchListService.removeMovie(oidcUser.getEmail(), tmdbId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{tmdbId}")
    public ResponseEntity<Void> setLiked(@AuthenticationPrincipal OidcUser oidcUser, @PathVariable String tmdbId, @RequestParam boolean liked) {
        watchListService.setLiked(oidcUser.getEmail(), tmdbId, liked);
        return ResponseEntity.noContent().build();
    }



    
}
