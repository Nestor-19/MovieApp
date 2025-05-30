package com.example.movieapp.Models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Document(collection = "actors")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Actor {

    @Id
    private String actorId;
    private String fullName;
    private ArrayList<String> moviesActedIn;
    private String pictureUrl;

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public String getActorId() {
        return actorId;
    }

    public void setActorId(String actorId) {
        this.actorId = actorId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public ArrayList<String> getMoviesActedIn() {
        return moviesActedIn;
    }

    public void setMoviesActedIn(ArrayList<String> moviesActedIn) {
        this.moviesActedIn = moviesActedIn;
    }



}
