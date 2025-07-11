package com.example.movieapp.Controllers;

import com.example.movieapp.Models.Genre;
import com.example.movieapp.Repository.GenreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    @Autowired
    public GenreRepo genreRepo;

    @GetMapping("/getGenres")
    public ResponseEntity<?> getGenres(){
        ArrayList<Genre> genres = genreRepo.findAll();
        genres.forEach(g -> System.out.println("Genre: " + g.getId() + " - " + g.getName()));
        return ResponseEntity.ok(genres);
    }




}