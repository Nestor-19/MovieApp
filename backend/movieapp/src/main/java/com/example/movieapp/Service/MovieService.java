package com.example.movieapp.Service;


import com.example.movieapp.Models.Actor;
import com.example.movieapp.Models.Movie;
import com.example.movieapp.Models.User;
import com.example.movieapp.Models.WatchListItem;
import com.example.movieapp.Repository.ActorRepo;
import com.example.movieapp.Repository.MovieRepo;
import com.example.movieapp.Repository.UserRepo;
import com.example.movieapp.dtos.ActorDto;
import com.example.movieapp.dtos.ActorsListDto;
import com.example.movieapp.dtos.MovieDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepo movieRepo;
    @Autowired
    private ActorRepo actorRepo;

    private RestTemplate restTemplate = new RestTemplate();


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

    public void matchActorsToMovies() {
        for (int page = 101; page <= 150; page++) {
            String url = "https://api.themoviedb.org/3/movie/top_rated?api_key=56ef84025b5c2298b63a9827b2a6c633&page=" + page;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> movies = (List<Map<String, Object>>) response.get("results");

            if (movies == null) continue;

            for (Map<String, Object> movie : movies) {
                String movieId = String.valueOf(movie.get("id"));
                String movieTitle = (String) movie.get("title");

                // ✅ Check if movie already exists
                Optional<Movie> existingMovie = movieRepo.findById(movieId);
                if (existingMovie.isEmpty()) {
                    // Fetch full movie details for enrichment
                    String detailsUrl = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=56ef84025b5c2298b63a9827b2a6c633";
                    Map<String, Object> details = restTemplate.getForObject(detailsUrl, Map.class);

                    Movie newMovie = new Movie();
                    newMovie.setTmdbId(movieId);
                    newMovie.setTitle(movieTitle);
                    newMovie.setDescription((String) movie.get("overview"));
                    newMovie.setImage("https://image.tmdb.org/t/p/w500" + movie.get("poster_path"));
                    newMovie.setRunTime(details.get("runtime") != null ? (int) details.get("runtime") : 0);
                    newMovie.setRating((int) Math.round((Double) movie.get("vote_average")));

                    // Convert genre IDs to Strings
                    List<Integer> genreIds = (List<Integer>) movie.get("genre_ids");
                    ArrayList<String> genreStrings = new ArrayList<>();
                    if (genreIds != null) {
                        for (Integer id : genreIds) {
                            genreStrings.add(String.valueOf(id));
                        }
                    }
                    newMovie.setGenres(genreStrings);

                    movieRepo.save(newMovie);
                    System.out.println("Saved new movie: " + movieTitle);
                }

                // ✅ Get cast and match with existing actors
                String creditsUrl = "https://api.themoviedb.org/3/movie/" + movieId + "/credits?api_key=56ef84025b5c2298b63a9827b2a6c633";
                Map<String, Object> credits = restTemplate.getForObject(creditsUrl, Map.class);
                List<Map<String, Object>> castList = (List<Map<String, Object>>) credits.get("cast");

                if (castList == null) continue;

                for (Map<String, Object> cast : castList) {
                    String actorName = ((String) cast.get("name")).toLowerCase();

                    Actor actor = actorRepo.findByFullNameIgnoreCase(actorName);
                    if (actor != null) {
                        if (actor.getMoviesActedIn() == null)
                            actor.setMoviesActedIn(new ArrayList<>());

                        if (!actor.getMoviesActedIn().contains(movieTitle)) {
                            actor.getMoviesActedIn().add(movieTitle);
                            actorRepo.save(actor);
                            System.out.println("Linked movie '" + movieTitle + "' to actor " + actor.getFullName());
                        }
                    }
                }

                try {
                    Thread.sleep(250); // rate limiting
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }

        System.out.println("Finished syncing actors to new movies.");
    }

}

