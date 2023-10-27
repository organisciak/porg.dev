/*  normalize the score to a 0-10 scale, where zero is any number where the scale is
     greater than maxScore, and everything else is linearly scaled to 10.
    ] */
    export function calculateBoundScore(score:number, maxScore:number) {
        if (score > maxScore) {
            return 0;
        } else {
            return Math.round(10 * (maxScore - score) / maxScore);
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
export function moonScale(score:number, n_moons:number = 3): string {
    const max_score: number = n_moons * 4;
    const bound_score = Math.max(Math.min(score, max_score), 0);
    const moonPhases = ['🌑', '🌘', '🌗', '🌖']

    const fullMoons:number = Math.floor(bound_score / moonPhases.length);

    let moonString = '';

    for (let i = 0; i < fullMoons; i++) {
        moonString += '🌕';
    }

    moonString += moonPhases[bound_score % moonPhases.length];
    
    for (let i = fullMoons + 1; i < n_moons; i++) {
        moonString += '🌑';
    }
    return moonString;
}