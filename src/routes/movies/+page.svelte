<script lang="ts">
  import type { MovieTag } from "$lib/movietags/MovieTags";
  import { onMount } from "svelte";
  import { movieTags } from "$lib/movietags/MovieTags";
  import { movieList } from "$lib/movietags/MovieList";
  import { gameLogic } from "$lib/movietags/GameLogic";
  import type { GameState } from "$lib/movietags/GameLogic";
  import MovieTagDisplay from "$lib/components/MovieTagDisplay.svelte";
  import TagReveal from "$lib/components/TagReveal.svelte";

  import MultiSelect from "svelte-multiselect";

  import { sampleArr } from "$lib/utils/arrUtils";

  let guess: string = "";
  let guessList: string[] = [];
  let gameInfo: GameState = {
    round: 0,
    rejectedMovies: [],
    possibleMovies: [],
    isCorrectAnswerInGroup: false,
    gameDone: false,
    win: false,
    pastGuesses: [],
  };
  let movieOptions: string[] = [];
  let showResults: boolean = false;
  let tags: MovieTag[] = [];
  let movie: string | null = null;

  onMount(async () => {
    await Promise.all([movieList.loadMovies(), movieTags.loadTags(null, "today")]);
    tags = movieTags.getTags();
    movie = movieTags.getMovie() as string;
    gameLogic.initializeGame(movie);
    updateGameInfo();
  });

  function updateGameInfo(): void {
    gameInfo = gameLogic.getCurrentState();
    movieOptions = movieList.searchMovies(guess, gameInfo.rejectedMovies, gameInfo.possibleMovies);
    // Assuming the new tag is the next tag in the array
    newTag = tags.length > gameInfo.round - 1 ? tags[gameInfo.round - 1] : null;
  }

  function handleGuess(): void {
    if (guessList.length === 0) {
      const allAllowedMovies = movieList.searchMovies(
        "",
        gameInfo.rejectedMovies,
        gameInfo.possibleMovies,
      );
      const randomHalf = sampleArr(Array.from(allAllowedMovies), 0.2);
      gameLogic.submitGuess(randomHalf);
    } else {
      gameLogic.submitGuess(guessList);
      guessList = [];
    }
    guess = "";
    updateGameInfo();
    showResults = gameInfo.gameDone;
  }
</script>

<main>
  <!--<h1>Movie Guessing Game</h1>-->

  <MovieTagDisplay tags={tags.slice(0, gameInfo.round)} />

  <!--<div>{JSON.stringify(gameInfo, null, 2)}</div>-->
  <!--<div>Guess List: {guessList}</div>
    <div>Guess:{guess}</div>
    <div># rejected guesses: {gameInfo.rejectedMovies.length}</div>
    <div># remaining movies: {movieList.searchMovies('', gameInfo.rejectedMovies, gameInfo.possibleMovies).length}</div>
    -->
  {#if !gameInfo.gameDone && movieOptions.length > 0}
    <form on:submit|preventDefault={handleGuess}>
      <MultiSelect
        bind:selected={guessList}
        options={movieOptions}
        placeholder="Pick some movies, or submit blank for another clue"
      />
      {#if guessList.length > 1}
        <div class="text-sm italic">
          You can guess more than one movie and we'll tell you if the winner is in the group. You
          won't win until you get the target movie alone, though!
        </div>
      {/if}
      <button class="m-2 rounded-md bg-orange-400 p-2 font-bold text-white">{guessList.length === 0 ? 'Skip' : 'Submit'}</button>
    </form>
    <div>
      <p>How to play: You are guess one movie, multiple movies, or 'skip'.</p>

      <p>
        If you guess multiple movies, we'll tell you if the winner is in the group. You won't win
        until you get the target movie alone, though!
      </p>

      <p>
        If you 'skip', we'll give you another clue <i>and</i> submit a guess of 20% of the remaining
        movies.
      </p>
      <!-- TODO: a) reduce search space with every new round, not just a 'skip'. b) reduce not with a random guess, but from the wrong answers. -->
    </div>
  {/if}
  <!--{#if gameInfo.round > 1}
    <TagReveal {newTag} />
  {/if}-->
  {#if showResults}
    <div>
      {#if gameInfo.win}
        <p>Congratulations! You've guessed correctly!</p>
      {:else}
        <p>Sorry, try again next time! The correct movie was {gameInfo.possibleMovies[0]}.</p>
      {/if}
    </div>
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1rem;
  }
</style>
