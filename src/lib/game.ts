export class GameState {
    notes = "";
    votes: Record<number, (number | "skip")[]> = {};

    constructor(
        public players: Player[],
        public extraVars: string[] = [],
        public readonly night = true,
        public readonly dayNumber = 1,
        public readonly prevNotes: string | null = null,
    ) {}

    step() {
        const gameState = new GameState(
            this.players,
            structuredClone(this.extraVars),
            !this.night,
            this.night ? this.dayNumber : this.dayNumber + 1,
            this.notes,
        );

        gameState.players = gameState.players.map((p) => p.clone(gameState));
        return gameState;
    }
}

export class Player {
    name = "";
    requiredData: unknown = structuredClone(
        Player.prototype.requiredData,
    );
    extraData: unknown = {};

    constructor(public gameState: GameState) {}

    clone(gameState: GameState) {
        const p = new Player(gameState);
        p.name = structuredClone(this.name);
        // @ts-ignore:
        p.requiredData = structuredClone(this.requiredData);
        p.extraData = structuredClone(this.extraData);
        return p;
    }
}

// @ts-ignore:
Player.prototype.requiredData = {
    "Role": "",
    "Alignment": "",
    "Modifiers": "",
    "Dead": "N",
    "Voting Power": 1,
    "Vote Protection": 0,
    "Vote Multiplier": 1,
    "Kill Protection": 0,
    "Hack Protection": 0,
};
