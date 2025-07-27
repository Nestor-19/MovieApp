package com.example.movieapp.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;



@Setter
@Getter
public class ActorsListDto {
    private ArrayList<ActorDto> actorsList;

    public ArrayList<ActorDto> getActorsList() {
        return actorsList;
    }

    public void setActorsList(ArrayList<ActorDto> actorsList) {
        this.actorsList = actorsList;
    }
}
