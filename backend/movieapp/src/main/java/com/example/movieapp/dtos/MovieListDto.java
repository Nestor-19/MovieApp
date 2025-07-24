package com.example.movieapp.Dtos;

import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovieListDto {
    private Integer tmdbId;
    private String title;
    private String image;
    private int rating;
    private int runTime;
    private Integer releaseYear;
    private List<String> genres;
    private String description;
}

