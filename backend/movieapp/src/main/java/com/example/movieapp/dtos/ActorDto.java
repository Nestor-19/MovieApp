package com.example.movieapp.Dtos;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ActorDto {


    private String id;
    private String name;
    private String profile_path;

    public String getProfile_path() {
        return profile_path;
    }

    public void setProfile_path(String profile_path) {
        this.profile_path = profile_path;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
