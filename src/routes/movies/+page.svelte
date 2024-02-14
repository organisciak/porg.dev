<script lang="ts">
    import type { MovieTag } from '$lib/movietags/MovieTags';
    import { onMount } from 'svelte';
    import { movieTags } from '$lib/movietags/MovieTags';
    import { movieList } from '$lib/movietags/MovieList';
    import { gameLogic } from '$lib/movietags/GameLogic';
    import type { GameState } from '$lib/movietags/GameLogic';
    import MovieTagDisplay from '$lib/components/MovieTagDisplay.svelte';
    import TagReveal from '$lib/components/TagReveal.svelte';

    import MultiSelect from 'svelte-multiselect';
  
    let guess: string = '';
    let guessList: string[] = [];
    let gameInfo: GameState = { round: 0, rejectedMovies: [], possibleMovies:[],
      isCorrectAnswerInGroup: false, gameDone: false, win: false,
      pastGuesses: []};
    let movieOptions: string[] = [];
    let showResults: boolean = false;
    let tags: MovieTag[] = [];
    let movie: string | null = null;
    let newTag: MovieTag | null = null;
  
    onMount(async () => {
      await Promise.all([
        movieList.loadMovies(),
        movieTags.loadTags(null, 'today')
        ]);
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
      gameLogic.submitGuess(guessList);
      guessList = [];
      guess = '';
      updateGameInfo();
      showResults = gameInfo.gameDone;
    }
  </script> 
  
  <main>
    <!--<h1>Movie Guessing Game</h1>-->

    <MovieTagDisplay tags={tags.slice(0, gameInfo.round)} />

    <!--<div>{JSON.stringify(gameInfo, null, 2)}</div>-->
    <div>Guess List: {guessList}</div>
    <div>Guess:{guess}</div>
    
    {#if !gameInfo.gameDone && movieOptions.length > 0}
        <form on:submit|preventDefault={handleGuess}>
            <MultiSelect
                bind:selected={guessList}
                options={ movieOptions } 
                placeholder="Pick some movies.."
                required
                />
            {#if guessList.length > 1}
            <div class='text-sm italic'>
                You can guess more than one movie and we'll tell you if the winner is in the group. You won't win until you get the target movie alone, though!
            </div>
            {/if}
                <button class="bg-orange-400 font-bold text-white p-2 m-2 rounded-md">submit</button>
        </form>
    {/if}
    
    {#if gameInfo.round > 1}
      <TagReveal {newTag} />
    {/if}
    {#if showResults}
      <div>
        {#if gameInfo.win}
          <p>Congratulations! You've guessed correctly!</p>
        {:else}
          <p>Sorry, try again next time! The correct movie was <!--{gameLogic.correctMovie}-->.</p>
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