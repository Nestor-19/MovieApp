package com.example.movieapp.Models;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class WatchListItem {
    private Integer movieid;
    private Boolean liked;

    public Integer getMovieid() {
        return movieid;
    }

    public void setMovieid(Integer movieid) {
        this.movieid = movieid;
    }

    public Boolean getLiked() {
        return liked;
    }

    public void setLiked(Boolean liked) {
        this.liked = liked;
    }

    public WatchListItem(Integer movieid, Boolean liked) {
        this.liked = liked;
        this.movieid = movieid;
    }
}
