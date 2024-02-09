// src/routes/api/movie-tags/[...params].ts

import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import { movieList } from '$lib/movietags/MovieList';
import seedrandom from 'seedrandom';

async function fetchMovieTags(movie: string) {
    const filePath = path.resolve('src/lib/movietags/json', `${movie}.json`);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading movie tags:', error);
        return {'error':"Cannot find movie tags"};
    }
}

export const GET: RequestHandler = async ({ request }) => {
    const url = new URL(request.url);
    let movie: string | null = url.searchParams.get('movie') || null;
    let seed: string | null = url.searchParams.get('seed') || null;
    let randomIndex: number;
    
    // if seed is 'today', use today's date as seed
    // IMPORTANT: for cache busting, also include a variable part in the URL
    // maybe put in 'date' as a query parameter, even though it's not used here
    if (seed === 'today') {
        const today = new Date();
        seed = today.toISOString().split('T')[0];
    }
    const seed_cache: Record<string, string> = {
        '2024-02-09': 'The Matrix (1999)',
    }

    // load movielist, only if it will be used
    if (movieList.getMovies().length === 0) {
        if ((seed && !seed_cache[seed]) || (!seed && !movie))  {
            await movieList.loadMovies();
        }
    }
    
    
    // priority of params: movie param, then seed cache, then random
    if (!movie) {
        if (!seed) {
            randomIndex = Math.floor(Math.random() * movieList.getMovies().length);
            movie = movieList.getMovies()[randomIndex];
        } else if (seed && seed_cache[seed]) {
            movie = seed_cache[seed];
        } else if (seed) {
            const rng = seedrandom(seed);
            randomIndex = Math.floor(rng() * movieList.getMovies().length);
            movie = movieList.getMovies()[randomIndex];
        }
    }

    const tags = await fetchMovieTags(movie as string);
    if (tags.error) {
        return json(tags, { status: 404 });
    } else {
        return json({movie:movie, data:tags});
    }
};
