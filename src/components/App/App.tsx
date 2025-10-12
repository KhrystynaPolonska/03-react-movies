import { useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';
import fetchMovies, { type FetchMoviesParams } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';
import './App.module.css';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchData = async (params: FetchMoviesParams) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchMovies(params);

      if (data.results.length === 0) {
        toast('No movies found for your request.', {
          icon: '😢',
          style: {
            borderRadius: '10px',
            background: '#ff9797ff',
            color: '#000000ff',
          },
        });
      } else {
        setMovies(data.results);
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <>
      <Toaster position="bottom-left" reverseOrder={false} />
      <SearchBar onSubmit={fetchData} />

      {loading && <Loader />}
      {error && <ErrorMessage />}
      <MovieGrid movies={movies} onSelect={handleSelect} />

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </>
  );
};

export default App;