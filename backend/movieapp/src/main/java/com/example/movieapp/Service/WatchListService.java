package com.example.movieapp.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.movieapp.Models.Movie;
import com.example.movieapp.Models.User;
import com.example.movieapp.Models.WatchListItem;
import com.example.movieapp.Repository.MovieRepo;
import com.example.movieapp.Repository.UserRepo;
import com.example.movieapp.dtos.WatchListItemDto;

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

        List<String> ids = user.getWatchlist().stream()
            .map(item -> String.valueOf(Integer.valueOf(item.getMovieid())))
            .toList();

        if (ids.isEmpty()) {
            return List.of();
        }

        List<Movie> movies = movieRepo.findAllById(ids);

        Map<Integer, Boolean> likedMap = user.getWatchlist().stream()
            .collect(Collectors.toMap(
                item -> Integer.valueOf(item.getMovieid()),
                WatchListItem::getLiked,
                (a, b) -> a));

        return movies.stream()
                .map(m -> new WatchListItemDto(
                        m.getDescription(),             // description
                        m.getImage(),                   // image
                        likedMap.get(m.getTmdbId()),   // liked
                        m.getRating(),                 // rating
                        m.getRunTime(),                // runTime
                        m.getTitle(),                  // title
                        String.valueOf(m.getTmdbId())  // tmdbId
                ))
                .toList();

    }

    @Transactional
    public void addMovie(String userEmail, Movie movie) {
        System.out.println(userEmail);
        User user = userRepo.findById(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));


        final String tmdbId = movie.getTmdbId();

        if (!movieRepo.existsById(tmdbId)) {
            movieRepo.save(movie);
        }

        boolean exists = user.getWatchlist().stream()
            .anyMatch(item -> item.getMovieid().equals(tmdbId));
        
        if (!exists) {
            ArrayList<WatchListItem> usersLists = user.getWatchlist();
            usersLists.add(new WatchListItem(tmdbId, null));
            user.setWatchlist(usersLists);
            userRepo.save(user);
        } else{
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
