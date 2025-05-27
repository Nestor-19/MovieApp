package com.example.movieapp.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WatchListItemDto {
    private Integer tmdbId;
    private String title;
    private String description;
    private String image;
    private Integer runTime;
    private Integer rating;
    private Boolean liked;
}
