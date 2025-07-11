package com.example.movieapp.Controllers;

import com.example.movieapp.Models.Actor;
import com.example.movieapp.Models.Movie;
import com.example.movieapp.Repository.ActorRepo;
import com.example.movieapp.Repository.MovieRepo;
import com.example.movieapp.Service.ActorService;
import com.example.movieapp.dtos.ActorDto;
import com.example.movieapp.dtos.ActorsListDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/actors")
public class ActorController {

    @Autowired
    private ActorRepo actorRepo;

    @Autowired
    private ActorService actorService;

    @Autowired
    private MovieRepo movieRepo;

    private RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/getAllActors")
    public ResponseEntity<?>getAllActors(){
        return ResponseEntity.ok(actorRepo.findAll());
    }


    @PostMapping("/storeAllActors")
    public ResponseEntity<?> storeAllActors(@RequestBody ActorsListDto actorsListDto) {
        actorService.addActor(actorsListDto);
        return ResponseEntity.ok("Actors stored successfully");
    }

    @GetMapping("/matchActorsToFilms")
    public ResponseEntity<?> matchActorsToFilms() {
        List<Movie> allMovies = movieRepo.findAll();

        for (Movie movie : allMovies) {
            String url = "https://api.themoviedb.org/3/movie/" + movie.getTmdbId() + "/credits?api_key=" + "56ef84025b5c2298b63a9827b2a6c633";

            // Get the response as a Map
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null || !response.containsKey("cast")) continue;

            List<Map<String, Object>> castList = (List<Map<String, Object>>) response.get("cast");

            for (Map<String, Object> castMember : castList) {
                String actorName = ((String) castMember.get("name")).toLowerCase();

                Optional<Actor> actorOpt = Optional.ofNullable(actorRepo.findByFullNameIgnoreCase(actorName));

                if (actorOpt.isPresent()) {
                    Actor actor = actorOpt.get();
                    if (actor.getMoviesActedIn() == null) {
                        actor.setMoviesActedIn(new ArrayList<>());
                    }
                    if (!actor.getMoviesActedIn().contains(movie.getTmdbId())) {
                        actor.getMoviesActedIn().add(movie.getTmdbId());
                        actorRepo.save(actor);
                        System.out.println("Added movie " + movie.getTmdbId() + " to actor " + actor.getFullName());
                    }
                }
            }
        }


        return null;
    }



}
