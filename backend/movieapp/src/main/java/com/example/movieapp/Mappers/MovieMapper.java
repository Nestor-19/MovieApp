package com.example.movieapp.Mappers;

import com.example.movieapp.Dtos.MovieDetailDto;
import com.example.movieapp.Dtos.MovieListDto;
import com.example.movieapp.Models.Movie;

public class MovieMapper {

    public static MovieListDto toListDto(Movie m) {
        return MovieListDto.builder()
                .tmdbId(m.getTmdbId())
                .title(m.getTitle())
                .image(m.getImage())
                .rating(m.getRating())
                .runTime(m.getRunTime())
                .releaseYear(m.getReleaseYear())
                .genres(m.getGenres())
                .description(m.getDescription())
                .build();
    }

    public static MovieDetailDto toDetailDto(Movie m) {
        return MovieDetailDto.builder()
                .tmdbId(m.getTmdbId())
                .title(m.getTitle())
                .description(m.getDescription())
                .image(m.getImage())
                .rating(m.getRating())
                .runTime(m.getRunTime())
                .releaseDate(m.getReleaseDate())
                .releaseYear(m.getReleaseYear())
                .genres(m.getGenres())
                .reviews(m.getReviews())
                .actors(m.getActors())
                .build();
    }
}