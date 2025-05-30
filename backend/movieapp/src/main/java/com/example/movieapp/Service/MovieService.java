package com.example.movieapp.Service;


import com.example.movieapp.Models.Actor;
import com.example.movieapp.Models.Movie;
import com.example.movieapp.Repository.ActorRepo;
import com.example.movieapp.Repository.MovieRepo;
import com.example.movieapp.dtos.ActorDto;
import com.example.movieapp.dtos.ActorsListDto;
import com.example.movieapp.dtos.MovieDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepo movieRepo;

    public void addMovies(List<MovieDto> movies){
       try {
           for (MovieDto movie : movies) {
//            if(movieRepo.findByTmdbId(movie.getTmdbId()) == null){
               Movie newMovie = new Movie();
               newMovie.setTmdbId(movie.getTmdbId());
               newMovie.setTitle(movie.getTitle());
               newMovie.setDescription(movie.getDescription());
               newMovie.setImage(movie.getImage());
               newMovie.setRating(Integer.parseInt(movie.getRating()));
               newMovie.setRunTime(Integer.parseInt(movie.getRunTime()));;
               newMovie.setGenres(movie.getGenres());;
               movieRepo.save(newMovie);
//            }else{
//                System.out.println(movie.getTitle() + " Already exists in database");
//            }
           }
       }catch (Exception e){
           e.printStackTrace();
       }
    }

    public void matchActorsToMovies(){

    }

}
