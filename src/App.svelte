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
    <button on:click={prevState} disabled={index == 0}>&lt;</button>

    {#each gameStates as gameState, idx}
        <button
            on:click={() => setState(idx)}
            class={(idx == index ? "selected " : "unselected ") +
                (gameState.night ? "night" : "day")}
        ></button>
    {/each}

    <button on:click={nextState} disabled={index == gameStates.length - 1}>
        &gt;
    </button>

    <button on:click={nextStateForceRecalc}>
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

    button {
        background-color: #162c42;
        border: none;
        color: #ffffff;
        font-size: 1rem;
        margin-left: 0.25rem;
        margin-right: 0.25rem;
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
    }

    .unselected {
        filter: brightness(50%);
    }

    .unselected:hover {
        filter: brightness(150%);
    }

    .night {
        width: 1rem;
        height: 1rem;
        border-radius: 1rem;
        background-color: #2186cc;
    }

    .day {
        width: 1rem;
        height: 1rem;
        border-radius: 1rem;
        background-color: #f8e866;
    }
</style>
