package com.klef.dev.service;

import java.util.List;
import com.klef.dev.model.Movie;

public interface MovieService {
    Movie addMovie(Movie movie);
    Movie updateMovie(Movie movie);
    void deleteMovie(int id);
    Movie getMovieById(int id);
    List<Movie> getAllMovies();
}
