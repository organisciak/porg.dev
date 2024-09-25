import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import words from '$lib/data/words.json';

export const GET: RequestHandler = async () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    return json(randomWord);
};
