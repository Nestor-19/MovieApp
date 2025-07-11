package com.example.movieapp.Controllers;


import com.example.movieapp.Models.Genre;
import com.example.movieapp.Models.Movie;
import com.example.movieapp.Repository.GenreRepo;
import com.example.movieapp.Repository.MovieRepo;
import com.example.movieapp.Service.MovieService;
import com.example.movieapp.dtos.ActorsListDto;
import com.example.movieapp.dtos.MovieDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.OutputStreamWriter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movies")
public class MovieController {


    @Autowired
    private MovieRepo movieRepo;
    @Autowired
    private MovieService movieService;
//    private final String tmdbApiKey = "56ef84025b5c2298b63a9827b2a6c633";  // hardcoded API key
//    private final RestTemplate restTemplate = new RestTemplate();




    @Autowired
    private GenreRepo genreRepo;


//    @GetMapping("/uploadGenres")
//    public ResponseEntity<?> uploadGenres() {
//        String url = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + tmdbApiKey;
//        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
//
//        if (response == null || !response.containsKey("genres")) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch genres");
//        }
//
//        List<Map<String, Object>> genres = (List<Map<String, Object>>) response.get("genres");
//
//        List<Genre> genreEntities = new ArrayList<>();
//        for (Map<String, Object> g : genres) {
//            String id = String.valueOf(g.get("id"));  // convert id to String
//            String name = (String) g.get("name");
//            genreEntities.add(new Genre(id, name));
//        }
//
//        genreRepo.deleteAll();
//        genreRepo.saveAll(genreEntities);
//
//        return ResponseEntity.ok("Genres uploaded successfully");
//    }

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


    @GetMapping("/randomMovies")
    public ResponseEntity<List<Movie>> getRandomMovies() {
        List<Movie> allMovies = movieRepo.findAll();

        // Shuffle and get first 5
        if (allMovies.size() <= 5) {
            return ResponseEntity.ok(allMovies); // Return all if <= 5
        }

        Collections.shuffle(allMovies);
        List<Movie> randomFive = allMovies.subList(0, 5);

        return ResponseEntity.ok(randomFive);
    }
    @PostMapping("/fetchRecommendedMovies")
    public ResponseEntity<List<Movie>> fetchRecommendedMovies(
            @RequestParam("movieIds[]") ArrayList<String> movieIds) {

        List<Movie> movies = movieRepo.findByTmdbIdIn(movieIds);
        return ResponseEntity.ok(movies);
    }
}
