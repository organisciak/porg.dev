// src/lib/movietags/GameLogic.ts

export interface GameState {
    round: number;
    rejectedMovies: string[];
    possibleMovies: string[];
    isCorrectAnswerInGroup: boolean;
    gameDone: boolean;
    win: boolean;
    pastGuesses: string[][];
}

export interface GuessResult {
    win: boolean;
    correctAnswerInGroup: boolean;
    gameOver: boolean;
}

class GameLogic {
    private currentRound: number;
    private maxRounds: number;
    private correctMovie: string;
    private isCorrectAnswerInGroup: boolean;
    private rejectedMovies: Set<string>;
    private possibleMovies: Set<string>;
    private win: boolean;
    private gameDone: boolean;
    private pastGuesses: string[][];

    constructor() {
        this.currentRound = 1;
        this.maxRounds = 8; // Maximum number of guesses allowed
        this.rejectedMovies = new Set();
        this.possibleMovies = new Set();
        this.correctMovie = "";
        this.isCorrectAnswerInGroup = false;
        this.win = false;
        this.gameDone = false;
        this.pastGuesses = [];
    }

    /**
     * Initialize or reset the game.
     */
    initializeGame(answer:string): void {
        this.currentRound = 1;
        this.rejectedMovies.clear();
        this.possibleMovies.clear();
        this.correctMovie = answer;
        this.isCorrectAnswerInGroup = false;
        this.win = false;
        this.gameDone = false;
        // Fetch or set the correct movie 
    }

    /**
     * Submit a guess
     * @param movies - The list of movies guessed by the user
     * @returns An object containing the game state
     *         - win: A boolean indicating if the game is won
     *        - correctAnswerInGroup: A boolean indicating if the correct answer is in the group of guesses
     *       - gameOver: A boolean indicating if the game is over
     */
    submitGuess(movies: string[]): GuessResult {
        this.win = (movies.length === 1 && movies[0] === this.correctMovie);
        this.isCorrectAnswerInGroup = movies.includes(this.correctMovie);

        if (this.isCorrectAnswerInGroup) {
            if (this.possibleMovies.size > 0) {
                this.possibleMovies = new Set([...this.possibleMovies].filter(movie => movies.includes(movie)));
            } else {
                this.possibleMovies = new Set(movies);
            }
        } else {
            // Add the movies to the rejectedMovies set
            movies.forEach(movie => {
                this.rejectedMovies.add(movie);
                // If they were previously in the possibleMovies set, remove them
                this.possibleMovies.delete(movie);
            });
        }

        if (this.win || this.currentRound === this.maxRounds) {
            this.gameDone = true;
            this.possibleMovies = new Set([this.correctMovie]);
        } else {
            this.currentRound++;
        }

        if (movies.length <= 8) {
            this.pastGuesses.push(movies);
        } else {
            this.pastGuesses.push(movies.slice(0, 8).concat(['...']));
        }

        return { win: this.win, 
                correctAnswerInGroup: this.isCorrectAnswerInGroup,
                gameOver: this.gameDone };
    }

    /*
     Get the current state of the game
        */
    getCurrentState(): GameState{
        return {
            round: this.currentRound,
            rejectedMovies: Array.from(this.rejectedMovies),
            possibleMovies: Array.from(this.possibleMovies),
            isCorrectAnswerInGroup: this.isCorrectAnswerInGroup,
            gameDone: this.gameDone,
            win: this.win,
            pastGuesses: this.pastGuesses
        };
    }
}

export const gameLogic = new GameLogic();