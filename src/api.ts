import exp from "constants";

const API_KEY = "c690b9c3a7df9892f90767be090ab58d";
const BASE_URL = "https://api.themoviedb.org/3";
// https://api.themoviedb.org/3/search/movie?api_key=api_key&language=en-US&query=hello&page=1&include_adult=false
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
export interface TvResults {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetTvResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: TvResults[];
  total_pages: number;
  total_results: number;
}
export function getMovies() {
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getUpcomingMovies() {
  return fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getTopRatedMovies() {
  return fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getOnTheAirTv() {
  return fetch(`${BASE_URL}/trending/tv/day?api_key=${API_KEY}&region=kr`).then(
    (response) => response.json()
  );
}
export function getPopularTv() {
  return fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&region=kr`).then(
    (response) => response.json()
  );
}
export function getTopRatedTv() {
  return fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&region=kr`).then(
    (response) => response.json()
  );
}

export interface ISearch {
  results: ISearchResults[];
}
export interface ISearchResults {
  id: number;
  adult: Boolean;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export function getSearchedWork(keyword: string) {
  return fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}
