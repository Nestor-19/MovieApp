package com.example.movieapp.Controllers;


import com.example.movieapp.Models.Movie;
import com.example.movieapp.Repository.MovieRepo;
import com.example.movieapp.Service.MovieService;
import com.example.movieapp.dtos.ActorsListDto;
import com.example.movieapp.dtos.MovieDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {


    @Autowired
    private MovieRepo movieRepo;
    @Autowired
    private MovieService movieService;


    @PostMapping("/storeMovies")
    public ResponseEntity<?> storeMovies(@RequestBody List<MovieDto> allMovies) {
        movieService.addMovies(allMovies);
        return ResponseEntity.ok("Movies stored successfully");
    }
    @PostMapping("/filterMovies")
    public ResponseEntity<?> filterMovies() {
        try {
            movieService.matchActorsToMovies();
            return ResponseEntity.ok("Actors' filmographies updated with matching movies.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while filtering movies: " + e.getMessage());
        }
    }



}
