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

    // public Integer getTmdbId() {
    //     return tmdbId;
    // }

    // public void setTmdbId(Integer tmdbId) {
    //     this.tmdbId = tmdbId;
    // }

    // public String getTitle() {
    //     return title;
    // }

    // public void setTitle(String title) {
    //     this.title = title;
    // }

    // public String getDescription() {
    //     return description;
    // }

    // public void setDescription(String description) {
    //     this.description = description;
    // }

    // public String getImage() {
    //     return image;
    // }

    // public void setImage(String image) {
    //     this.image = image;
    // }

    // public int getRunTime() {
    //     return runTime;
    // }

    // public void setRunTime(int runTime) {
    //     this.runTime = runTime;
    // }

    // public ArrayList<String> getGenres() {
    //     return genres;
    // }

    // public void setGenres(ArrayList<String> genres) {
    //     this.genres = genres;
    // }

    // public ArrayList<String> getReviews() {
    //     return reviews;
    // }

    // public void setReviews(ArrayList<String> reviews) {
    //     this.reviews = reviews;
    // }



    // public int getRating() {
    //     return rating;
    // }

    // public void setRating(int rating) {
    //     this.rating = rating;
    // }
}
