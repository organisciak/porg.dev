// src/lib/movietags/MovieList.ts
import movies from './movies.json'

class MovieList {
    private movies: string[] = [];
  
    /* Load movies
    *
    */
    async loadMovies(): Promise<void> {
      try {
        // Placeholder for fetching movie list from an API or other sources
        // For example, if you have an API endpoint:
        // const response = await fetch('https://example.com/api/movies');
        // this.movies = await response.json();
        this.movies = movies;
      } catch (error) {
        console.error("Failed to load movies:", error);
        // Handle the error appropriately in your application context
      }
    }
  
    /*
    Search movies based on the query
    */
    searchMovies(query: string, exclude_list:string[]=[], filter_list:string[]=[]): string[] {
      const pool = filter_list.length > 0 ? filter_list : this.movies;
      const filtered_movies = pool.filter(movie => !exclude_list.includes(movie));
      return filtered_movies.filter(movie =>
        movie.toLowerCase().includes(query.toLowerCase())
      );
    }

    /*
    Get all movies
    */
    getMovies(): string[] {
      return this.movies;
    }
  }
  
  export const movieList = new MovieList();