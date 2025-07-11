package com.example.movieapp.Repository;

import com.example.movieapp.Models.Genre;
import com.example.movieapp.Models.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.ArrayList;
import java.util.List;

public interface GenreRepo extends MongoRepository<Genre, String> {

    ArrayList<Genre> findAll();
}
