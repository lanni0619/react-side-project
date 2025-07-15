import { useState, useEffect } from 'react';

const OMDBAPI_KEY = '3b3320ac';

export function useMoives(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {

        const controller = new AbortController();
        async function fetchMoviesByString() {
            try {
                setIsLoading(true);
                setError('');
                const response = await fetch(
                    `http://www.omdbapi.com/?apikey=${OMDBAPI_KEY}&s=${query}`,
                    { signal: controller.signal }
                );
                if (!response.ok) throw new Error('Something went wrong with fecting movies🤯');
                const data = await response.json();
                if (data.Response === 'False') throw new Error('Movie not found');
                setMovies(data.Search);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setError(error.message);
                    console.error(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        }
        if (query.length < 3) {
            setMovies([]);
            setError('');
            return;
        }
        // handleCloseMovie();
        fetchMoviesByString();

        return function () {
            controller.abort();
        };
    }, [query]);

    return { movies, isLoading, error };
}
