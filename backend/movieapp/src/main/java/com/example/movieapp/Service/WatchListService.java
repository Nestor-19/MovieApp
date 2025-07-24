package com.example.movieapp.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.movieapp.Dtos.WatchListItemDto;
import com.example.movieapp.Models.Movie;
import com.example.movieapp.Models.User;
import com.example.movieapp.Models.WatchListItem;
import com.example.movieapp.Repository.MovieRepo;
import com.example.movieapp.Repository.UserRepo;

@Service
public class WatchListService {
    private final UserRepo userRepo;
    private final MovieRepo movieRepo;

    public WatchListService(UserRepo userRepo, MovieRepo movieRepo) {
        this.userRepo = userRepo;
        this.movieRepo = movieRepo;
    }


    public List<WatchListItemDto> getWatchlist(String userEmail) {
        User user = userRepo.findById(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getWatchlist().stream()
            .map(item -> {
                Integer tmdbId = Integer.valueOf(item.getMovieid());
                Movie movie = movieRepo.findById(tmdbId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Movie %d not found".formatted(tmdbId)));

            return new WatchListItemDto(
                movie.getDescription(),
                movie.getImage(),
                item.getLiked(),             
                movie.getRating(),
                movie.getRunTime(),
                movie.getTitle(),
                item.getMovieid()           
            );
        })
        .collect(Collectors.toList());
    }

    @Transactional
    public void addMovie(String userEmail, Movie movie) {
        System.out.println(userEmail);
        User user = userRepo.findById(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));


        final Integer tmdbId = movie.getTmdbId();

        if (!movieRepo.existsById(tmdbId)) {
            movieRepo.save(movie);
        }

        boolean wishlistExists = user.getWishlist().stream()
                .anyMatch(item -> item.getMovieid().equals(tmdbId));
        
        boolean watchlistExists = user.getWatchlist().stream()
                .anyMatch(item -> item.getMovieid().equals(tmdbId));
        
        if (!watchlistExists && !wishlistExists) {
            ArrayList<WatchListItem> usersLists = user.getWatchlist();
            usersLists.add(new WatchListItem(tmdbId, null));
            user.setWatchlist(usersLists);
            userRepo.save(user);
        } 
        
        if (wishlistExists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Movie exists in your wishlist!"
            );
        }else{
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Movie already exists in your watchlist"
            );
        }
    }

    @Transactional
    public void removeMovie(String userEmail, Integer tmdbId) {
        User user = userRepo.findById(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.getWatchlist().removeIf(item -> item.getMovieid().equals(tmdbId));
        userRepo.save(user);
    }

    @Transactional
    public void setLiked(String userEmail, Integer tmdbId, boolean liked) {
        User user = userRepo.findById(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.getWatchlist().stream()
            .filter(item -> item.getMovieid().equals(tmdbId))
            .findFirst()
            .ifPresent(item -> item.setLiked(liked));
        userRepo.save(user);
    }
}
