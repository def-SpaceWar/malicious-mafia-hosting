<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import { GameState, Player } from "./game";
    export let gameState: GameState;
    let varName: string,
        votes: Record<number, (number | "skip")[]> = {};

    const addVar = () => {
            if (gameState.extraVars.indexOf(varName) != -1) return;
            gameState.extraVars.push(varName);
            gameState.extraVars = gameState.extraVars;
        },
        removeVar = (variable: string) => {
            gameState.extraVars = gameState.extraVars.filter(
                (v) => v != variable,
            );
        },
        addPlayer = () => {
            gameState.players.push(new Player(gameState));
            gameState.notes = gameState.notes;
            resetVotes();
        },
        removePlayer = (player: Player) => {
            gameState.players = gameState.players.filter((p) => p != player);
            resetVotes();
        },
        resetVotes = () => {
            votes = {};
        },
        getVoteScore = (player: Player, id: number) => {
            let score = player.requiredData["Vote Protection"];
            nextPlayer: for (const key in votes) {
                const other = gameState.players[key];
                for (const value of votes[key]) {
                    if (value == id) {
                        score -=
                            other.requiredData["Voting Power"] *
                            player.requiredData["Vote Multiplier"];
                        continue nextPlayer;
                    }
                }
            }
            return score;
        },
        getSkipScore = () => {
            let score = 0;
            nextPlayer: for (const key in votes) {
                const other = gameState.players[key];
                for (const value of votes[key]) {
                    if (value == "skip") {
                        score -= other.requiredData["Voting Power"];
                        continue nextPlayer;
                    }
                }
            }
            return score;
        };
</script>

<center
    in:slide={{ delay: 0, axis: "x", duration: 200 }}
    out:fade={{ delay: 0, duration: 200 }}
>
    <h1>
        <span class={gameState.night ? "night" : "day"}>
            {gameState.night ? "Night" : "Day"}
        </span>
        #{gameState.dayNumber}
    </h1>

    <ul>
        {#each gameState.extraVars as extraVar (extraVar)}
            <li>
                <button on:click={() => removeVar(extraVar)} class="reset">
                    X
                </button>
                {extraVar}
            </li>
        {:else}
            <li>Custom Variables Will Appear Here!</li>
        {/each}
    </ul>

    <button on:click={addVar} class="new">New Var</button>
    <input bind:value={varName} />

    <table>
        <thead>
            <tr>
                <th>
                    <button on:click={addPlayer} class="new">New Player</button>
                </th>
                <th>Name</th>
                {#each Object.keys(Player.prototype.requiredData) as key (key)}
                    <th>{key}</th>
                {/each}
                {#each gameState.extraVars as extra (extra)}
                    <th>{extra}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each gameState.players as player (player)}
                <tr>
                    <th>
                        <button
                            on:click={() => removePlayer(player)}
                            class="reset"
                        >
                            X
                        </button>
                    </th>
                    <th>
                        <input bind:value={player.name} />
                    </th>
                    {#each Object.keys(Player.prototype.requiredData) as key (key)}
                        <th>
                            <input bind:value={player.requiredData[key]} />
                        </th>
                    {/each}
                    {#each gameState.extraVars as extra (extra)}
                        <th>
                            <input bind:value={player.extraData[extra]} />
                        </th>
                    {/each}
                </tr>
            {:else}
                <tr>
                    <th>No players</th>

                    <th>
                        <input disabled />
                    </th>
                    {#each Object.keys(Player.prototype.requiredData) as key (key)}
                        <th>
                            <input disabled />
                        </th>
                    {/each}
                    {#each gameState.extraVars as extra (extra)}
                        <th>
                            <input disabled />
                        </th>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>

    {#if !gameState.night}
        <table>
            <thead>
                <tr>
                    <th>
                        <button on:click={resetVotes} class="reset">
                            Reset Votes
                        </button>
                    </th>
                    {#each gameState.players as player, id}
                        <th>{player.name} ({getVoteScore(player, id)})</th>
                    {/each}
                    <th>Skip ({getSkipScore()})</th>
                </tr>
            </thead>
            <tbody>
                {#each gameState.players as player, id}
                    <tr>
                        <th>{player.name}</th>
                        {#each gameState.players as _, selectedId}
                            <th>
                                <input
                                    type="checkbox"
                                    name={player.name}
                                    value={selectedId}
                                    bind:group={votes[id]}
                                />
                            </th>
                        {/each}
                        <th>
                            <input
                                type="checkbox"
                                name={player.name}
                                value={"skip"}
                                bind:group={votes[id]}
                            />
                        </th>
                    </tr>
                {:else}
                    <tr><th>No players</th></tr>
                {/each}
            </tbody>
        </table>
    {/if}

    <textarea
        bind:value={gameState.notes}
        placeholder="Note everything that happens!"
    ></textarea>

    {#if gameState.prevNotes}
        <p>Previously...</p>
        <textarea disabled bind:value={gameState.prevNotes}></textarea>
    {/if}
</center>

<style>
    * :not(center) {
        font-family: "Special Elite", sans;
        transition: all 200ms ease;
    }

    center {
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
        height: 95vh - 4rem;
        overflow-x: hidden;
        overflow-y: scroll;
        padding-bottom: 4rem;
    }

    h1 {
        position: fixed;
        top: 0;
        right: 0;
        margin: 0.5rem;
    }

    p {
        font-size: 75%;
    }

    ul {
        display: flex;
        justify-content: center;
        flex-direction: column;
        list-style: none;
        font-size: 75%;
        background-color: #0e1c2a;
        margin: 0;
    }

    ul li {
        padding: 0.25rem;
    }

    table {
        font-size: 75%;
        padding: 0.25rem;
        margin: 0.25rem;
        background-color: #0e1c2a;
    }

    th {
        padding: 0.1rem;
    }

    th input {
        width: 100%;
    }

    input:disabled {
        background-color: transparent;
    }

    .night {
        color: #2186cc;
    }

    .day {
        color: #f8e866;
    }

    textarea {
        width: 50%;
        height: 10rem;
        text-align: center;
        background-color: #0e1c2a;
        color: #cceeff;
        outline: none;
        border: none;
    }

    input {
        background-color: #162c42;
        color: #cceeff;
        border: none;
    }

    button {
        background-color: #162c42;
        color: #cceeff;
        border: none;
    }

    button:hover {
        filter: brightness(150%);
    }

    .new {
        background-color: #21ff86;
        color: #0e1c2a;
    }

    .reset {
        background-color: #fa3154;
        color: #cceeff;
        font-weight: bold;
    }
</style>
