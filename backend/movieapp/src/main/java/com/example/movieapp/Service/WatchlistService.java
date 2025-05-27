package com.example.movieapp.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.movieapp.Models.User;
import com.example.movieapp.Models.WatchListItem;
import com.example.movieapp.Repository.MovieRepo;
import com.example.movieapp.Repository.UserRepo;

@Service
public class WatchlistService {
    private final UserRepo userRepo;
    private final MovieRepo movieRepo;

    public WatchlistService(UserRepo userRepo, MovieRepo movieRepo) {
        this.userRepo = userRepo;
        this.movieRepo = movieRepo;
    }

    public List<WatchListItem> getWatchlist(String userEmail) {
        User user = userRepo.findById(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getWatchlist();
    }

    @Transactional
    public void addMovie(String userEmail, Integer tmdbId) {
        User user = userRepo.findById(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        movieRepo.findById(tmdbId)
            .orElseThrow(() -> new RuntimeException("Movie not found"));

        boolean exists = user.getWatchlist().stream()
            .anyMatch(item -> item.getMovieid().equals(tmdbId.toString()));
        
        if (!exists) {
            user.getWatchlist().add(new WatchListItem(tmdbId.toString(), null));
            userRepo.save(user);
        }
    }

    @Transactional
    public void removeMovie(String userEmail, Integer tmdbId) {
        User user = userRepo.findById(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.getWatchlist().removeIf(item -> item.getMovieid().equals(tmdbId.toString()));
        userRepo.save(user);
    }

    @Transactional
    public void setLiked(String userEmail, String tmdbId, boolean liked) {
        User user = userRepo.findById(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.getWatchlist().stream()
            .filter(item -> item.getMovieid().equals(tmdbId))
            .findFirst()
            .ifPresent(item -> item.setLiked(liked));
        userRepo.save(user);
    }
}
