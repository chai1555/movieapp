import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style.css';
import config from '../config';

const genres = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi"];

const MovieManager = () => {
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState({
    id: '',
    title: '',
    director: '',
    year: '',
    genre: '',
    rating: '',
    duration: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedMovie, setFetchedMovie] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');

  const baseUrl = `${config.url}/movieapi`;

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const fetchAllMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setMovies(res.data);
    } catch {
      setMessage('❌ Failed to fetch movies.');
    }
    setLoading(false);
  };

  const handleChange = (e) =>
    setMovie({ ...movie, [e.target.name]: e.target.value });

  const validateForm = () => {
    for (let key in movie) {
      if (!movie[key]?.toString().trim()) {
        setMessage(`⚠️ Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addMovie = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/add`, movie);
      setMessage('✅ Movie added successfully.');
      fetchAllMovies();
      resetForm();
    } catch {
      setMessage('❌ Error adding movie.');
    }
    setLoading(false);
  };

  const updateMovie = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.put(`${baseUrl}/update`, movie);
      setMessage('✅ Movie updated successfully.');
      fetchAllMovies();
      resetForm();
    } catch {
      setMessage('❌ Error updating movie.');
    }
    setLoading(false);
  };

  const deleteMovie = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(`🗑️ ${res.data}`);
      fetchAllMovies();
    } catch {
      setMessage('❌ Error deleting movie.');
    }
    setLoading(false);
  };

  const getMovieById = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedMovie(res.data);
      setMessage('');
    } catch {
      setFetchedMovie(null);
      setMessage('⚠️ Movie not found.');
    }
    setLoading(false);
  };

  const handleEdit = (m) => {
    setMovie(m);
    setEditMode(true);
    setMessage(`✏️ Editing movie with ID ${m.id}`);
  };

  const resetForm = () => {
    setMovie({
      id: '',
      title: '',
      director: '',
      year: '',
      genre: '',
      rating: '',
      duration: ''
    });
    setEditMode(false);
  };

  // --- filtering & sorting ---
  const filteredMovies = movies
    .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "year") return b.year - a.year;
      return a.id - b.id;
    });

  return (
    <div className="movie-container">
      {message && (
        <div className={`message-banner ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>🎬 Movie Management System</h2>

      {loading && <div className="loader">⏳ Loading...</div>}

      {/* Add / Edit Form */}
      <section className="card">
        <h3>{editMode ? '✏️ Edit Movie' : '➕ Add Movie'}</h3>
        <div className="form-grid">
          <input type="number" name="id" placeholder="ID" value={movie.id} onChange={handleChange} />
          <input type="text" name="title" placeholder="Title" value={movie.title} onChange={handleChange} />
          <input type="text" name="director" placeholder="Director" value={movie.director} onChange={handleChange} />
          <input type="number" name="year" placeholder="Year" value={movie.year} onChange={handleChange} />
          <select name="genre" value={movie.genre} onChange={handleChange}>
            <option value="">Select Genre</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <input type="number" step="0.1" name="rating" placeholder="Rating" value={movie.rating} onChange={handleChange} />
          <input type="number" name="duration" placeholder="Duration (mins)" value={movie.duration} onChange={handleChange} />
        </div>
        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addMovie}>Add Movie</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateMovie}>Update</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </section>

      {/* Fetch Movie by ID */}
      <section className="card">
        <h3>🔎 Get Movie By ID</h3>
        <div className="inline-form">
          <input
            type="number"
            value={idToFetch}
            onChange={(e) => setIdToFetch(e.target.value)}
            placeholder="Enter ID"
          />
          <button className="btn-blue" onClick={getMovieById}>Fetch</button>
        </div>

        {fetchedMovie && (
          <div className="fetched-card">
            <h4>🎥 {fetchedMovie.title}</h4>
            <p><b>Director:</b> {fetchedMovie.director}</p>
            <p><b>Year:</b> {fetchedMovie.year}</p>
            <p><b>Genre:</b> {fetchedMovie.genre}</p>
            <p><b>Rating:</b> {fetchedMovie.rating}</p>
            <p><b>⏱ Duration:</b> {fetchedMovie.duration} min</p>
          </div>
        )}
      </section>

      {/* All Movies */}
      <section className="card">
        <h3>📚 All Movies</h3>

        <div className="inline-form">
          <input
            type="text"
            placeholder="🔍 Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="id">Sort by ID</option>
            <option value="year">Sort by Year</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        {filteredMovies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map((m) => (
              <div key={m.id} className="movie-card">
                <h4>{m.title}</h4>
                <p><b>Director:</b> {m.director}</p>
                <p><b>Year:</b> {m.year}</p>
                <p><b>Genre:</b> {m.genre}</p>
                <p><b></b> {m.rating}</p>
                <p><b>⏱</b> {m.duration} min</p>
                <div className="action-buttons">
                  <button className="btn-green" onClick={() => handleEdit(m)}>Edit</button>
                  <button className="btn-red" onClick={() => deleteMovie(m.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MovieManager;
