package com.example.movieapp.Repository;

import com.example.movieapp.Models.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.ArrayList;

public interface MovieRepo extends MongoRepository<com.example.movieapp.Models.Movie, String> {

    Movie findByTmdbId(String id);
    ArrayList<Movie> findByTmdbIdIn(ArrayList<String> ids);
    ArrayList<Movie> findAll();

}