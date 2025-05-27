package com.example.movieapp.Controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.movieapp.Models.WatchListItem;

import com.example.movieapp.Service.WatchlistService;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {
    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public List<WatchListItem> getWatchlist(Principal principal) {
        return watchlistService.getWatchlist(principal.getName());
    }

    @PostMapping
    public ResponseEntity<Void> add(Principal principal, @RequestParam Integer tmdbId) {
        watchlistService.addMovie(principal.getName(), tmdbId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{tmdbId}")
    public ResponseEntity<Void> delete(Principal principal, @PathVariable Integer tmdbId) {
        watchlistService.removeMovie(principal.getName(), tmdbId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{tmdbId}")
    public ResponseEntity<Void> setLiked(Principal principal, @PathVariable String tmdbId, @RequestParam boolean liked) {
        watchlistService.setLiked(principal.getName(), tmdbId, liked);
        return ResponseEntity.noContent().build();
    }
    
}
