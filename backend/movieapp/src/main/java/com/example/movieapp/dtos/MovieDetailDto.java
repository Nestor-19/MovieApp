

// import java.util.ArrayList;

// public class MovieDto {

//     private Integer tmdbId;
//     private String title;
//     private String description;
//     private String image;
//     private String runTime;
//     private ArrayList<String> genres;
//     private String rating;
//     private Integer releaseYear;

//     public String getDescription() {
//         return description;
//     }

//     public void setDescription(String description) {
//         this.description = description;
//     }

//     public ArrayList<String> getGenres() {
//         return genres;
//     }

//     public void setGenres(ArrayList<String> genres) {
//         this.genres = genres;
//     }

//     public String getImage() {
//         return image;
//     }

//     public void setImage(String image) {
//         this.image = image;
//     }

//     public String getRating() {
//         return rating;
//     }

//     public void setRating(String rating) {
//         this.rating = rating;
//     }

//     public String getRunTime() {
//         return runTime;
//     }

//     public void setRunTime(String runTime) {
//         this.runTime = runTime;
//     }

//     public String getTitle() {
//         return title;
//     }

//     public void setTitle(String title) {
//         this.title = title;
//     }

//     public Integer getTmdbId() {
//         return tmdbId;
//     }

//     public void setTmdbId(Integer tmdbId) {
//         this.tmdbId = tmdbId;
//     }

//     public Integer getReleaseYear() {
//         return releaseYear;
//     }

//     public void setReleaseYear(Integer releaseYear) {
//         this.releaseYear = releaseYear;
//     }
// }

package com.example.movieapp.Dtos;

import lombok.*;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovieDetailDto {
    private Integer tmdbId;
    private String title;
    private String description;
    private String image;
    private int rating;
    private int runTime;
    private String releaseDate;
    private Integer releaseYear;
    private List<String> genres;
    private List<String> reviews;
    private List<String> actors;
}
