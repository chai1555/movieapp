package com.klef.dev.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.dev.model.Movie;
import com.klef.dev.repository.MovieRepository;
import com.klef.dev.service.MovieService;

@Service
public class MovieServiceImpl implements MovieService {

    @Autowired
    private MovieRepository repo;

    @Override
    public Movie addMovie(Movie movie) {
        return repo.save(movie);
    }

    @Override
    public Movie updateMovie(Movie movie) {
        return repo.save(movie);
    }

    @Override
    public void deleteMovie(int id) {
        repo.deleteById(id);
    }

    @Override
    public Movie getMovieById(int id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public List<Movie> getAllMovies() {
        return repo.findAll();
    }
}
