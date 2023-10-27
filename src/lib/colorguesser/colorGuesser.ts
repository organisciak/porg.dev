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