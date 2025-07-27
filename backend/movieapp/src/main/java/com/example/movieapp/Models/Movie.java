package com.example.movieapp.Models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;

@Document(collection = "movies")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Movie {
    
    @Id
    private Integer tmdbId; 
    private String title;
    private String description;
    private String image;
    private int runTime;
    private int rating;
    private String releaseDate;
    private Integer releaseYear;
    private ArrayList<String> genres;
    private ArrayList<String> reviews;
    private ArrayList<String> actors;;
}
