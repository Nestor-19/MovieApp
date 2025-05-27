package com.example.movieapp.Controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public List<WatchListItemDto> getWatchlist(Principal principal) {
        return watchListService.getWatchlist(principal.getName());
    }

    @PostMapping
    public ResponseEntity<Void> add(Principal principal, @RequestBody Movie movie) {
        watchListService.addMovie(principal.getName(), movie);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{tmdbId}")
    public ResponseEntity<Void> delete(Principal principal, @PathVariable Integer tmdbId) {
        watchListService.removeMovie(principal.getName(), tmdbId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{tmdbId}")
    public ResponseEntity<Void> setLiked(Principal principal, @PathVariable String tmdbId, @RequestParam boolean liked) {
        watchListService.setLiked(principal.getName(), tmdbId, liked);
        return ResponseEntity.noContent().build();
    }
    
}
