import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style.css';           // <-- fixed path (was ./style.css)
import config from '../config';

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

  const baseUrl = `${config.url}/movieapi`;

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const fetchAllMovies = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setMovies(res.data);
    } catch (error) {
      setMessage('Failed to fetch movies.');
    }
  };

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in movie) {
      if (!movie[key] || movie[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addMovie = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, movie);
      setMessage('Movie added successfully.');
      fetchAllMovies();
      resetForm();
    } catch (error) {
      setMessage('Error adding movie.');
    }
  };

  const updateMovie = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, movie);
      setMessage('Movie updated successfully.');
      fetchAllMovies();
      resetForm();
    } catch (error) {
      setMessage('Error updating movie.');
    }
  };

  const deleteMovie = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllMovies();
    } catch (error) {
      setMessage('Error deleting movie.');
    }
  };

  const getMovieById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedMovie(res.data);
      setMessage('');
    } catch (error) {
      setFetchedMovie(null);
      setMessage('Movie not found.');
    }
  };

  const handleEdit = (m) => {
    setMovie(m);
    setEditMode(true);
    setMessage(`Editing movie with ID ${m.id}`);
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

  return (
    <div className="student-container">
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>Movie Management System</h2>

      <div>
        <h3>{editMode ? 'Edit Movie' : 'Add Movie'}</h3>
        <div className="form-grid">
          <input type="number" name="id" placeholder="ID" value={movie.id} onChange={handleChange} />
          <input type="text" name="title" placeholder="Title" value={movie.title} onChange={handleChange} />
          <input type="text" name="director" placeholder="Director" value={movie.director} onChange={handleChange} />
          <input type="number" name="year" placeholder="Year" value={movie.year} onChange={handleChange} />
          <input type="text" name="genre" placeholder="Genre" value={movie.genre} onChange={handleChange} />
          <input type="number" step="0.1" name="rating" placeholder="Rating" value={movie.rating} onChange={handleChange} />
          <input type="number" name="duration" placeholder="Duration (mins)" value={movie.duration} onChange={handleChange} />
        </div>

        <div className="btn-group" style={{ marginTop: 12 }}>
          {!editMode ? (
            <button className="btn-blue" onClick={addMovie}>Add Movie</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateMovie}>Update Movie</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div>
        <h3>Get Movie By ID</h3>
        <input type="number" value={idToFetch} onChange={(e) => setIdToFetch(e.target.value)} placeholder="Enter ID" />
        <button className="btn-blue" onClick={getMovieById}>Fetch</button>

        {fetchedMovie && (
          <div className="fetched-table">
            <h4>Movie Found:</h4>
            <table className="single-movie-table">
              <tbody>
                {Object.entries(fetchedMovie).map(([key, value]) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3>All Movies</h3>
        {movies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(movie).map((key) => (<th key={key}>{key}</th>))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m.id}>
                    {Object.keys(m).map((k) => (<td key={k}>{m[k]}</td>))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(m)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteMovie(m.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieManager;
