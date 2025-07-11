package com.example.movieapp.Controllers;

import com.example.movieapp.Models.Movie;
import com.example.movieapp.Service.WishListService;
import com.example.movieapp.dtos.WatchListItemDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishListController {
    private final WishListService wishListService;

    public WishListController(WishListService wishListService) {
        this.wishListService = wishListService;
    }

    @GetMapping
    public List<WatchListItemDto> getWishlist(@AuthenticationPrincipal OidcUser oidcUser) {
        return wishListService.getWishlist(oidcUser.getEmail());
    }


    @PostMapping("/addToWishlist")
    public ResponseEntity<Void> addToWishlist(@AuthenticationPrincipal OidcUser oidcUser, @RequestBody Movie movie) {

        wishListService.addToWishlist(oidcUser.getEmail(), movie);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    @DeleteMapping("/{tmdbId}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal OidcUser oidcUser, @PathVariable Integer tmdbId) {
        wishListService.removeMovie(oidcUser.getEmail(), tmdbId);
        return ResponseEntity.noContent().build();
    }
}
