const API_KEY = "c690b9c3a7df9892f90767be090ab58d";
const BASE_URL = "https://api.themoviedb.org/3";

export interface results {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: results[];
  total_pages: number;
  total_results: number;
}
export function getMovies() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
