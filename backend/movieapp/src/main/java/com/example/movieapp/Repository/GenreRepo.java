package com.example.movieapp.Repository;

import com.example.movieapp.Models.Genre;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.ArrayList;

public interface GenreRepo extends MongoRepository<Genre, String> {

    ArrayList<Genre> findAll();
}
