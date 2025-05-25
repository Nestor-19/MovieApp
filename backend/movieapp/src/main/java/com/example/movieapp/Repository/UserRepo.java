package com.example.movieapp.Repository;

import com.example.movieapp.Models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends MongoRepository<User,String> {

    User getUserByEmail(String email);


}
