import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'porg-theme';
let initialized = false;

const resolveInitialTheme = (): Theme => {
	if (!browser) return 'dark';
	const stored = localStorage.getItem(THEME_KEY);
	if (stored === 'light' || stored === 'dark') return stored;
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	return prefersDark ? 'dark' : 'light';
};

export const theme = writable<Theme>('dark');

export const applyTheme = (value: Theme) => {
	if (!browser) return;
	const root = document.documentElement;
	root.dataset.theme = value;
	root.classList.toggle('dark', value === 'dark');
};

export const initTheme = () => {
	if (!browser || initialized) return;
	initialized = true;
	const initial = resolveInitialTheme();
	theme.set(initial);
	applyTheme(initial);
	theme.subscribe((value) => {
		localStorage.setItem(THEME_KEY, value);
		applyTheme(value);
	});
};

export const toggleTheme = () => {
	theme.update((value) => (value === 'light' ? 'dark' : 'light'));
};
