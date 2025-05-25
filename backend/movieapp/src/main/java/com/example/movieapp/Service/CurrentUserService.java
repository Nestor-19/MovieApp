package com.example.movieapp.Service;
import com.example.movieapp.Models.User;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private User currentUser;

    public User getCurrentUser(User currentUser) {
        return currentUser;
    }

    public void setCurrentUser(User currentUser) {
        this.currentUser = currentUser;
    }

}
