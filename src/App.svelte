<script lang="ts">
    import { GameState } from "./lib/game";
    import RenderGameState from "./lib/RenderGameState.svelte";

    const gameStates: GameState[] = [];
    let selectedGameState = gameStates[gameStates.push(new GameState([])) - 1],
        index = 0;

    const prevState = () => {
            selectedGameState = gameStates[(index -= 1)];
        },
        nextState = () => {
            selectedGameState = gameStates[(index += 1)];
        },
        nextStateForceRecalc = () => {
            selectedGameState = gameStates[(index += 1)] =
                selectedGameState.step();
        },
        setState = (idx) => {
            selectedGameState = gameStates[(index = idx)];
        };
</script>

<nav>
    <div id="spacer"></div>

    {#each gameStates as gameState, idx}
        <button
            aria-label={idx.toString()}
            on:click={() => setState(idx)}
            disabled={idx == index}
            class={gameState.night ? "night" : "day"}
        ></button>
    {/each}

    <div id="spacer"></div>

    <button on:click={prevState} disabled={index == 0}>&lt;</button>
    <button on:click={nextState} disabled={index == gameStates.length - 1}>
        &gt;
    </button>

    <button on:click={nextStateForceRecalc} id="calculate">
        {index == gameStates.length - 1 ? "CALCULATE" : "RECALCULATE"}
    </button>
</nav>

<main>
    {#each gameStates as s (s)}
        {#if s == selectedGameState}
            <RenderGameState gameState={s} />
        {/if}
    {/each}
</main>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Special+Elite&display=swap");

    * {
        font-family: "Special Elite", sans;
        transition: all 200ms ease;
    }

    :root {
        background-color: #112233;
        color: #cceeff;
        font-size: 150%;
    }

    nav {
        position: fixed;
        left: 0;
        bottom: 0;
        margin: 0;
        height: 5vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        background-color: #0e1c2a;
        z-index: 1;
        box-shadow: 0px -1rem 1rem #0001;
    }

    button {
        background-color: #162c42;
        border: none;
        color: #ffffff;
        font-size: 1rem;
        margin-left: 0.25rem;
        margin-right: 0.25rem;
    }

    button:hover {
        filter: brightness(150%);
    }

    .night {
        width: 1rem;
        height: 1rem;
        border-radius: 1rem;
        background-color: #2186cc;
        filter: brightness(50%);
    }

    .day {
        width: 1rem;
        height: 1rem;
        border-radius: 1rem;
        background-color: #f8e866;
        filter: brightness(50%);
    }

    .day:disabled,
    .night:disabled {
        filter: brightness(100%);
    }

    #spacer {
        flex-grow: 1;
    }

    #calculate {
        width: 10rem;
    }
</style>
