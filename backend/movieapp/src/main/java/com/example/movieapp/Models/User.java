package com.example.movieapp.Models;

import com.example.movieapp.Enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
@Document(collection = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {


    @Id
    private String email;
    private String firstname;
    private String lastname;
    private int age;
    private ArrayList<String> watchlist;
    private ArrayList<String> watchedList;
    private UserRole role;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public ArrayList<String> getWatchlist() {
        return watchlist;
    }

    public void setWatchlist(ArrayList<String> watchlist) {
        this.watchlist = watchlist;
    }

    public ArrayList<String> getWatchedList() {
        return watchedList;
    }

    public void setWatchedList(ArrayList<String> watchedList) {
        this.watchedList = watchedList;
    }
}
