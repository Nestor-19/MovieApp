package com.example.movieapp.Service;


import com.example.movieapp.Dtos.MovieDetailDto;
import com.example.movieapp.Dtos.MovieListDto;
import com.example.movieapp.Mappers.MovieMapper;
import com.example.movieapp.Models.Movie;
import com.example.movieapp.Repository.MovieRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepo movieRepo;


//     public void addMovies(List<MovieDto> movies){
//         try {
//             for (MovieDto movie : movies) {
// //            if(movieRepo.findByTmdbId(movie.getTmdbId()) == null){
//                 Movie newMovie = new Movie();
//                 newMovie.setTmdbId(movie.getTmdbId());
//                 newMovie.setTitle(movie.getTitle());
//                 newMovie.setDescription(movie.getDescription());
//                 newMovie.setImage(movie.getImage());
//                 newMovie.setRating(Integer.parseInt(movie.getRating()));
//                 newMovie.setRunTime(Integer.parseInt(movie.getRunTime()));;
//                 newMovie.setGenres(movie.getGenres());;
//                 movieRepo.save(newMovie);
// //            }else{
// //                System.out.println(movie.getTitle() + " Already exists in database");
// //            }
//             }
//         }catch (Exception e){
//             e.printStackTrace();
//         }
//     }

    public List<MovieListDto> fetchAllLight() {
        // Load ALL (1200)
        return movieRepo.findAll()
                .stream()
                .map(MovieMapper::toListDto)
                .toList();
    }

    public MovieDetailDto getById(Integer id) {
        Movie m = movieRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Movie %d not found".formatted(id)));
        return MovieMapper.toDetailDto(m);
    }

}

