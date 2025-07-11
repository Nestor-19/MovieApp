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
    private Integer age;
    private ArrayList<WatchListItem> watchlist = new ArrayList<>();
    private ArrayList<WatchListItem> wishlist = new ArrayList<>();
    private UserRole role;
    private int credits;

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public ArrayList<WatchListItem> getWishlist() {
        return wishlist;
    }

    public void setWishlist(ArrayList<WatchListItem> wishlist) {
        this.wishlist = wishlist;
    }

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

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public ArrayList<WatchListItem> getWatchlist() {
        return watchlist;
    }

    public void setWatchlist(ArrayList<WatchListItem> watchlist) {
        this.watchlist = watchlist;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
