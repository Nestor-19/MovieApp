package com.example.movieapp.Service;


import com.example.movieapp.Dtos.ActorDto;
import com.example.movieapp.Dtos.ActorsListDto;
import com.example.movieapp.Models.Actor;
import com.example.movieapp.Repository.ActorRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ActorService {

    @Autowired
    private ActorRepo actorRepo;

    // public void addActor(ActorsListDto actorsListDto){
    //     for (ActorDto actorDto : actorsListDto.getActorsList()) {
    //         if(actorRepo.findByActorId(actorDto.getId()) == null){
    //             Actor actor = new Actor();
    //             actor.setActorId(actorDto.getId());
    //             actor.setFullName(actorDto.getName());
    //             actor.setMoviesActedIn(new ArrayList<String>());
    //             actor.setPictureUrl(actorDto.getProfile_path());
    //             actorRepo.save(actor);
    //         }else{
    //             System.out.println(actorDto.getName() + "Already exists in database");
    //         }
    //     }
    // }

    public void matchActorsToMovies(){

    }

}
