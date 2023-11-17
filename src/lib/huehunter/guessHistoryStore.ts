/*
A Svelte Store for huehunter game data that persists data to local storage, conditioned by date.

Stores each day's data in a store bound to local storage under a key that is the date in ISO format (e.g. 2021-08-31).

Also stores a reference to all saved days in local storage under the key 'guessHistoryRecords'.

*/

import { writable } from 'svelte/store';
import type { GuessHistory, GuessStats, GuessHistoryKeyed, DateKey } from '$lib/huehunter/types.ts';
import { calculateBoundScore, rawScoreThreshold } from '$lib/huehunter/colorGuesser';

function getDateKey(date: Date): DateKey {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `guessHistory_${year}${month}${day}`;
}

function getTodayKey(): DateKey {
    const today = new Date();
    return getDateKey(today);
}

function getGuessHistoryByDateKey(dateKey: DateKey): GuessHistory {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(dateKey);
        return data ? JSON.parse(data) : [];
    } else {
        return [];
    }
}

/*function getGuessHistoryByDate(date: Date): GuessHistory {
    const key: DateKey = getDateKey(date);
    return getGuessHistoryByDateKey(key);
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

function getFullGuessHistory(): GuessHistoryKeyed[] {
    const daysPlayed = getGuessHistoryRecords();
    if (!daysPlayed.length) {
        return [];
    }
    const fullHistory = daysPlayed.map((date) => {
        return {
            date: date,
            history: getGuessHistoryByDateKey(date)
        }
    });
    return fullHistory;

}

function calculateStreak(allRecords: GuessHistoryKeyed[]): number {
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < allRecords.length; i++) {
        const recordDate = dateStringToDate(allRecords[i].date);
 
        if (isConsecutiveDay(recordDate, today, i)) {
            streak++;
        } else {
            // allow for streak to start yesterday (i=1)
            if (i > 0) {
                break;
            }
        }
    }

    return streak;
}

function isConsecutiveDay(recordDate: Date, currentDate: Date, dayDifference: number): boolean {
    return (
        recordDate.getDate() === currentDate.getDate() - dayDifference &&
        recordDate.getMonth() === currentDate.getMonth() &&
        recordDate.getFullYear() === currentDate.getFullYear()
    );
}

function getGuessHistoryRecords(): DateKey[] {
    if (typeof window !== 'undefined') {
        const records = localStorage.getItem('guessHistoryRecords');
        return records ? JSON.parse(records) : [];
    } else {
        return [];
    }
}

export async function cullOldRecords(): Promise<void> {
    const allRecords:GuessHistoryKeyed[] = getFullGuessHistory();
    const todayKey:DateKey = getTodayKey();
    // Iterate through all GuessHistory items except today's, removing Guesses that 
    // are playMode == 'INFINITY' mode, and then saving the GuessHistory back to localStorage
    //let pruneCount = 0;
    allRecords.forEach((record:GuessHistoryKeyed) => {
        if (record.date !== todayKey) {
            const culledHistory = record.history.filter((guess) => {
                return guess.playMode !== 'INFINITE';
            });
            localStorage.setItem(record.date, JSON.stringify(culledHistory));
            //pruneCount += culledHistory.length - record.history.length;
        }
    });
}

function dateStringToDate(dateString: string): Date {
    // Start from today, to get locale right
    const date = new Date();
    // update year, month and date
    date.setFullYear(parseInt(dateString.substring(13,17)));
    date.setMonth(parseInt(dateString.substring(17,19)) - 1);
    date.setDate(parseInt(dateString.substring(19,21)));
    return date;
}

export function guessHistoryStats(): GuessStats {
    const allRecords:GuessHistoryKeyed[] = getFullGuessHistory();
    allRecords.sort((a, b) => b.date.localeCompare(a.date));

    const stats: GuessStats = {
        colorsGuessed: 0,
        daysPlayed: allRecords.length,
        histogram: [
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0
        ], // 11-pt scale, 0-10
        averageScore: 0,
        streak: calculateStreak(allRecords),
        scoreByDate: []
    }
    let dayGuesses = 0;
    let processedDays = 0;

    // TODO disambiguate between RGB and CMYK stats
    allRecords.forEach(({ date, history }) => {
        let dayScore = 0;
        history.forEach((guess) => {
            if (guess.playMode === 'INFINITE') {
                return;
            }
            stats.histogram[Math.round(calculateBoundScore(guess.difference, rawScoreThreshold))]++;
            dayScore += guess.difference;
            dayGuesses ++;
        });
        if (processedDays <= 10) {
            const dateScore = {
                'date': dateStringToDate(date),
                'score': dayScore / dayGuesses
            };
            stats.scoreByDate.push(dateScore);
        }
        processedDays++;
        
    });
    // sum of histogram
    const totalScore = stats.histogram.reduce((a, b, i) => a + b * i, 0);
    stats.colorsGuessed = stats.histogram.reduce((a, b) => a + b, 0);
    stats.averageScore = totalScore / stats.colorsGuessed;
    return stats
}

function pushToGuessHistoryRecords(key: string) {
    const records = getGuessHistoryRecords();
    if (!records.includes(key)) {
        records.push(key);
        localStorage.setItem('guessHistoryRecords', JSON.stringify(records));
    }
}

export const guessHistoryStore = createPersistedStore();