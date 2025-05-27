package com.example.movieapp.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface MovieRepo extends MongoRepository<com.example.movieapp.Models.Movie, Integer> {

}