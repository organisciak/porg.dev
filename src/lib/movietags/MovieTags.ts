// src/lib/movietags/MovieTags.ts

export interface MovieTag {
    key: string;
    value: string;
  }

type RelatedFilms = {
    name: string;
    year: number;
    relationship: string;
}

export type TagData = {
    [key: string]: string[] | number | undefined | string | RelatedFilms[];
    genres: string[];
    themes: string[];
    timePeriods: string[];
    settings: string[];
    plotTags: string[];
    genericHintTags: string[];
    popularity?: number;
    title: string;
    alternativeTitles: string[];
    releaseYear?: number;
    peopleInvolved: string[];
    filmDecade?: string;
    productionCountries: string[];
    notableAwards: string[];
    relatedFilms: RelatedFilms[];
}
  
  // Assuming there's an API endpoint that returns the tags for the current movie
  const API_URL = '/api/movie-tags'; // Placeholder URL
  
  class MovieTags {
    private tags: MovieTag[] = [];
    private movie: string | null = null;
  
    async loadTags(movie:string|null, seed:string|null=null): Promise<void> {
      // Fetch movie tags from the API
      // sed movie and seed as query parameters
      const url = new URL(window.location.origin + API_URL);
      if (movie) url.searchParams.set('movie', movie);
      else if (seed) url.searchParams.set('seed', seed);
      try {
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const { movie, tags } = this.parseData(data);
        this.movie = movie;
        this.tags = tags;
      } catch (error) {
        console.error("Failed to load movie tags:", error);
        // Handle the error appropriately in your application context
      }
    }
  
    private parseData(data:{movie: string, data: TagData }): {'movie':string | null, 'tags':MovieTag[]} {
      const movie = data.movie;
      const tags = this.parseTags(data.data);
      return { 'movie': movie, 'tags': tags };
    }

    private parseTags(data: TagData): MovieTag[] {
      // Expand tag data into individual tags, shuffled
      let tags: MovieTag[] = [];

      // string[] properties
      const basicKeys: string[] = ['genres', 'themes', 'timePeriods', 'settings', 'plotTags', 'genericHintTags',
      'productionCountries', 'notableAwards'];
      basicKeys.forEach((key) => {
        const values:string[] | undefined = data[key] as string[] | undefined;
        if (values === undefined) return;
        tags = tags.concat(values.map((value:string) => ({ key, value })));
      });

      // Single value keys
      const singleValueKeys: string[] = ['releaseYear', 'filmDecade'];
      singleValueKeys.forEach((key) => {
        const value = data[key];
        if (value !== undefined) {
          tags.push({ key, value: value.toString() });
        }
      });

      const relationshipCounts: Record<string, number> = {};
      data['relatedFilms'].forEach((value: RelatedFilms) => {
        if (value.relationship in relationshipCounts) {
          relationshipCounts[value.relationship]++;
        } else {
          relationshipCounts[value.relationship] = 1;
        }
      });

      // Add relationship counts
      Object.entries(relationshipCounts).forEach(([key, value]) => {
        tags.push({ key: `${key} (count)`, value: value.toString() });
      });

      // shuffle tags
      for (let i = tags.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tags[i], tags[j]] = [tags[j], tags[i]];
      }

      return tags;
    }
  
    getTags(): MovieTag[] {
      return this.tags;
    }

    getMovie(): string | null {
      return this.movie;
    }
  }
  
  export const movieTags = new MovieTags();
  