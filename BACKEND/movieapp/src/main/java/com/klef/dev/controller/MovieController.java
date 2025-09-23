package com.klef.dev.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.klef.dev.model.Movie;
import com.klef.dev.service.MovieService;

import java.util.List;

@RestController
@RequestMapping("/movieapi")
@CrossOrigin(origins = "http://localhost:5173")  // frontend port
public class MovieController {

    @Autowired
    private MovieService service;
    
    @GetMapping("/")
    public String home() {
    	return "Welcome";
    }

    @PostMapping("/add")
    public Movie addMovie(@RequestBody Movie movie) {
        return service.addMovie(movie);
    }

    @PutMapping("/update")
    public Movie updateMovie(@RequestBody Movie movie) {
        return service.updateMovie(movie);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteMovie(@PathVariable int id) {
        service.deleteMovie(id);
        return "Movie deleted with id: " + id;
    }

    @GetMapping("/get/{id}")
    public Movie getMovie(@PathVariable int id) {
        return service.getMovieById(id);
    }

    @GetMapping("/all")
    public List<Movie> getAllMovies() {
        return service.getAllMovies();
    }
}
