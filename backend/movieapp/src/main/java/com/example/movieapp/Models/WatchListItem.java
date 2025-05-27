package com.example.movieapp.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class WatchListItem {
    private String movieid;
    private Boolean liked;

    public String getMovieid() {
        return movieid;
    }

    public void setMovieid(String movieid) {
        this.movieid = movieid;
    }

    public Boolean getLiked() {
        return liked;
    }

    public void setLiked(Boolean liked) {
        this.liked = liked;
    }

    public WatchListItem(String movieid, Boolean liked) {
        this.liked = liked;
        this.movieid = movieid;
    }
}
