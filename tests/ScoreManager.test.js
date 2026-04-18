global.GAME_CONFIG = require('../docs/src/config/constants.js');
global.tutorialManager = { currentStep: 0 };
global.soundManager = { play: jest.fn() };
global.isMultiplayer = false;
global.currentState = GAME_CONFIG.STATES.PLAYING;

const ScoreManager = require('../docs/src/managers/ScoreManager.js');

describe('ScoreManager Core Logic', () => {
    let sm;

    beforeEach(() => {
        sm = new ScoreManager();
    });

    test('Initializes with 0 points', () => {
        expect(sm.playerPoints).toBe(0);
        expect(sm.opponentPoints).toBe(0);
        expect(sm.playerScoreLabel).toBe("0");
    });

    test('Records point for player and updates label to 15', () => {
        sm.recordPoint('PLAYER');
        expect(sm.playerPoints).toBe(1);
        expect(sm.playerScoreLabel).toBe("15");
        expect(global.soundManager.play).toHaveBeenCalledWith('clap');
    });

    test('Reaches deuce correctly at 3-3', () => {
        sm.playerPoints = 3;
        sm.opponentPoints = 3;
        const display = sm.getDisplayScore(sm.playerPoints, sm.opponentPoints);
        expect(display).toBe("Deuce");
    });

    test('Win condition triggers when player reaches 4 points and leads by 2', () => {
        sm.playerPoints = 3;
        sm.opponentPoints = 2; // 40-30
        
        // Player scores to reach game point
        sm.recordPoint('PLAYER');
        
        // After winning the game, points are reset to 0
        expect(sm.playerPoints).toBe(0);
        expect(sm.playerGames).toBe(1);
        expect(sm.gameWasJustReset).toBe(true);
    });

    test('checkGameWin() triggers Match Win when maximum games are reached', () => {
        global.soundManager.play.mockClear();

        // Simulate reaching game point to secure the final game
        sm.playerGames = GAME_CONFIG.MATCH.WINNING_GAMES - 1; // 1 game away from winning
        sm.playerPoints = GAME_CONFIG.MATCH.POINTS_TO_WIN;
        sm.opponentPoints = 0;
        
        let wonGame = sm.checkGameWin();
        
        expect(wonGame).toBe(true);
        expect(sm.playerGames).toBe(GAME_CONFIG.MATCH.WINNING_GAMES);
        expect(sm.isMatchOver).toBe(true);
        expect(sm.matchWinner).toBe("PLAYER");
        
        // Verify victory sound is played only once
        expect(global.soundManager.play).toHaveBeenCalledWith('victory');
        expect(sm.victorySoundPlayed).toBe(true);
    });
});
