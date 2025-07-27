package com.example.movieapp.Dtos;

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

    public WatchListItemDto(String description, String image, Boolean liked,
                            Integer rating, Integer runTime,
                            String title, Integer tmdbId) {
        this.description = description;
        this.image = image;
        this.liked = liked;
        this.rating = rating;
        this.runTime = runTime;
        this.title = title;
        this.tmdbId = tmdbId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Boolean getLiked() {
        return liked;
    }

    public void setLiked(Boolean liked) {
        this.liked = liked;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Integer getRunTime() {
        return runTime;
    }

    public void setRunTime(Integer runTime) {
        this.runTime = runTime;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getTmdbId() {
        return tmdbId;
    }

    public void setTmdbId(Integer tmdbId) {
        this.tmdbId = tmdbId;
    }
}
