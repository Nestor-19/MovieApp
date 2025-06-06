package com.example.movieapp.Repository;

import com.example.movieapp.Models.Actor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.ArrayList;

public interface ActorRepo extends MongoRepository<Actor,String> {
    Actor findByActorId(String id);

    ArrayList<Actor> findAll();
    Actor findByFullNameIgnoreCase(String fullname);
}
