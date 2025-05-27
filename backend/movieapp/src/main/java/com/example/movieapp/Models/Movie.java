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
    private ArrayList<String> genres;
    private int rating;
}
