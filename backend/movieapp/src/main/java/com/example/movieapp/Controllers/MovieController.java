package com.example.movieapp.Controllers;

import com.example.movieapp.Dtos.MovieDetailDto;
import com.example.movieapp.Dtos.MovieListDto;
import com.example.movieapp.Service.MovieService;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    // @PostMapping("/storeMovies")
    // public ResponseEntity<?> storeMovies(@RequestBody List<MovieDto> allMovies) {
    //     movieService.addMovies(allMovies);
    //     return ResponseEntity.ok("Movies stored successfully");
    // }

    /**
     * GET /api/movies/all  → returns all 1200 lightweight movie rows.
     */
    @GetMapping("/all")
    public ResponseEntity<List<MovieListDto>> all() {
        return ResponseEntity.ok(movieService.fetchAllLight());
    }

    /**
     * GET /api/movies/{id} → full detail.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MovieDetailDto> byId(@PathVariable Integer id) {
        return ResponseEntity.ok(movieService.getById(id));
    }
}
