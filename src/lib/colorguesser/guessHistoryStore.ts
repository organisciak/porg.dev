/*
A Svelte Store for colorguesser game data that persists data to local storage, conditioned by date.

Stores each day's data in a store bound to local storage under a key that is the date in ISO format (e.g. 2021-08-31).

Also stores a reference to all saved days in local storage under the key 'guessHistoryRecords'.

*/

import { writable } from 'svelte/store';
import type { GuessHistory } from '$lib/colorguesser/types.ts';

function getDateKey(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `guessHistory_${year}${month}${day}`;
}

function getTodayKey(): string {
    const today = new Date();
    return getDateKey(today);
}

/*function getDateData(date: Date): GuessHistory {
    const key = getDateKey(date);
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } else {
        return [];
    }
}*/

/*function getTodayData(): GuessHistory {
    const today = new Date();
    return getDateData(today);
}*/

function createPersistedStore() {
    let key = getTodayKey();
    let lastUpdated = new Date();
    let initial:GuessHistory = [];
    if (typeof window !== 'undefined') {
        lastUpdated = new Date(localStorage.getItem('lastUpdated') || '2020-01-01');
    }

    if (!isToday(lastUpdated)) {
        key = getTodayKey();
        pushToGuessHistoryRecords(key);
    }

    if (typeof window !== 'undefined') {
        initial = localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key) || '[]')
        : [];
    }

    const store = writable(initial);

    if (typeof window !== 'undefined') {
        store.subscribe(($value) => {
            // Check again before writing, as the store might be used
            // without page refresh for multiple days
            const currentDate = new Date();
            if (!isToday(lastUpdated)) {
                key = getTodayKey();
                pushToGuessHistoryRecords(key);
            }

            localStorage.setItem(key, JSON.stringify($value));
            localStorage.setItem('lastUpdated', currentDate.toString());
            lastUpdated = currentDate;
        });
    }

    return store;
}

function isToday(date: Date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

function getGuessHistoryRecords(): string[] {
    const records = localStorage.getItem('guessHistoryRecords');
    return records ? JSON.parse(records) : [];
}

function pushToGuessHistoryRecords(key: string) {
    const records = getGuessHistoryRecords();
    if (!records.includes(key)) {
        records.push(key);
        localStorage.setItem('guessHistoryRecords', JSON.stringify(records));
    }
}

export const guessHistoryStore = createPersistedStore();