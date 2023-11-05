/*
Threshold for a raw distance that is considered 0 pts (made slightly more forgiving).
Based on 100k randomized measures.
*/
export const rawScoreThreshold = 176.30 + 10;

/*  normalize the score to a 0-10 scale, where zero is any number where the scale is
*    greater than maxScore, and everything else is linearly scaled to 10 (or whatever newScale is set to).
*/
export function calculateBoundScore(score:number, maxScore:number, newScale:number = 10) {
    if (score > maxScore) {
        return 0;
    } else {
        return Math.round(newScale * (maxScore - score) / maxScore);
    }
}

export function moonCount(score: number, maxScore:number): {'full':number, 'partial':number, 'new':number} {
    return {
        full: Math.floor(score),
        partial: Math.round(4*(score % 1)) / 4,
        new: maxScore - Math.ceil(score)
    }
}

/* Return a string of moon emoji to represent a score. The range of the scale is 0-4*n_moons.
* e.g. for n_moons = 3:
*    0 🌑🌑
*    1 🌘🌑
*    2 🌗🌑
*    3 🌖🌑
*    4 🌕🌑
*    5 🌕🌘
*    6 🌕🌗
*    7 🌕🌖
*    8 🌕🌕
*/
export function moonScale(score:number, maxScore:number = 3): string {
    const bound_score = Math.max(Math.min(score, maxScore), 0);
    const moons = moonCount(bound_score, maxScore);
    const moonPhases = ['🌑', '🌘', '🌗', '🌖']

    const fullMoons:number = Math.floor(bound_score / moonPhases.length);

    let moonString = '';

    for (let i = 0; i < moons.full; i++) {
        moonString += '🌕';
    }
    if (moons.partial > 0) {
        moonString += moonPhases[moons.partial * 4]
    }
    for (let i = 0; i < moons.new; i++) {
        moonString += '🌑';
    }
    return moonString;
}