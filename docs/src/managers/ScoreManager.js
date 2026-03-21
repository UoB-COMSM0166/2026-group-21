class ScoreManager {
    constructor() {
        this.init();
        // map index to tennis scoring string
        this.scoreMap = GAME_CONFIG.MATCH.SCORE_LABELS;
    }

    init() {
        this.playerPoints = 0;
        this.opponentPoints = 0;
        this.playerGames = 0;
        this.opponentGames = 0;
        this.isMatchOver = false;
        this.matchWinner = null;
        this.gameWasJustReset = false;
        this.currentServer = GAME_CONFIG.MATCH.DEFAULT_SERVER;
        this.currentSide = GAME_CONFIG.MATCH.DEFAULT_SIDE;
        this.victorySoundPlayed = false;
    }
    // record a point for the winner and check the win condition
    recordPoint(winner) {
        this.gameWasJustReset = false;
        const sManager = typeof soundManager !== 'undefined' ? soundManager : null; 
        const isMulti = typeof isMultiplayer !== 'undefined' ? isMultiplayer : false; 
        const isTutorial = typeof currentState !== 'undefined' && currentState === GAME_CONFIG.STATES.TUTORIAL;

        if (winner === 'PLAYER') {
            this.playerPoints++;
            if (sManager && !isTutorial) {
                sManager.play('clap');
            }
        } else {
            this.opponentPoints++;
            if (sManager && !isTutorial) {
                if (isMulti) {
                    sManager.play('clap');
                } else {
                    sManager.play('boo');
                }
            }
        }

        // Disable game winning logic in tutorial
        if (typeof tutorialManager !== 'undefined' && tutorialManager.currentStep === 5) {
            return false;
        }

        return this.checkGameWin();
    }
    // switch the serve side between points
    prepareNextPoint() {
        if (typeof tutorialManager !== 'undefined' && tutorialManager.currentStep === 5) {
            return;
        }
        // to maintain new round start from right side
        if (!this.gameWasJustReset) {
            this.currentSide = (this.currentSide === 'LEFT') ? 'RIGHT' : 'LEFT';
        }
    }
    // win game at 4 points + lead by at least 2 points
    checkGameWin() {
        const { POINTS_TO_WIN, POINT_GAP, WINNING_GAMES } = GAME_CONFIG.MATCH;
        const p1 = this.playerPoints;
        const p2 = this.opponentPoints;
        let gameWonThisTurn = false;
        // check for game win
        if (p1 >= POINTS_TO_WIN && (p1 - p2) >= POINT_GAP) {
            this.playerGames++;
            this.resetPoints();
            gameWonThisTurn = true;
        } else if (p2 >= POINTS_TO_WIN && (p2 - p1) >= POINT_GAP) {
            this.opponentGames++;
            this.resetPoints();
            gameWonThisTurn = true;
        }
        // check for match win
        if (this.playerGames >= WINNING_GAMES) {
            this.isMatchOver = true;
            this.matchWinner = "PLAYER";
        } else if (this.opponentGames >= WINNING_GAMES) {
            this.isMatchOver = true;
            this.matchWinner = "OPPONENT";
        }
        if (this.isMatchOver && !this.victorySoundPlayed) {
            if (typeof soundManager !== 'undefined' && soundManager) {
                soundManager.play('victory'); 
            } 
            this.victorySoundPlayed = true;
        }
        return gameWonThisTurn;
    }
    // resets points for a new game and rotates the server role
    resetPoints() {
        this.playerPoints = 0;
        this.opponentPoints = 0;
        this.currentServer = (this.currentServer === 'PLAYER') ? 'OPPONENT' : 'PLAYER';
        this.currentSide = 'RIGHT';
        this.gameWasJustReset = true;
    }

    getDisplayScore(p, opp) {
        const { DEUCE_THRESHOLD, LABEL_DEUCE, LABEL_AD, LABEL_EMPTY } = GAME_CONFIG.MATCH;
        // deuce and AD Logic for high scores
        if (p >= DEUCE_THRESHOLD && opp >= DEUCE_THRESHOLD) {
            if (p === opp) return LABEL_DEUCE;
            if (p > opp) return LABEL_AD;
            return LABEL_EMPTY;
        }
        // Avoid hiding potential scoring bugs gracefully
        if (p < this.scoreMap.length) {
            return this.scoreMap[p];
        }
        // Return raw point count with ERR prefix if it somehow exceeds normal rules
        return `ERR(${p})`;
    }

    displayGameOver() {
        const { centerX, centerY, VIRTUAL_W, VIRTUAL_H } = layout;
        const { COLORS, UI } = GAME_CONFIG;
        push();
        fill(COLORS.DARK_GRAY);
        noStroke();
        rectMode(CENTER);
        rect(VIRTUAL_W / 2, VIRTUAL_H / 2, VIRTUAL_W, VIRTUAL_H);
        textAlign(CENTER, CENTER);
        strokeWeight(UI.OVERLAY_TEXT_STROKE);
        fill(COLORS.GOLD);
        textSize(UI.WINNER_TEXT_SIZE);
        text(`${this.matchWinner}  WINS!`, centerX, centerY - UI.WINNER_Y_OFFSET);
        noStroke();
        fill(COLORS.WHITE);
        textSize(UI.RESTART_TEXT_SIZE);
        text("Press 'R' to Restart", centerX, centerY + UI.RESTART_Y_OFFSET);
        pop();
    }
    // the score HUD
    display() {
        const { UI, COLORS } = GAME_CONFIG;
        const { centerX, courtTop } = layout;

        push();
        textAlign(CENTER, CENTER);
        textSize(UI.SIZE_MAIN);
        fill(COLORS.WHITE);

        const p1Str = this.getDisplayScore(this.playerPoints, this.opponentPoints);
        const p2Str = this.getDisplayScore(this.opponentPoints, this.playerPoints);

        // Ensure score doesn't go off-screen on short displays
        const minScoreY = UI.GAMES_OFFSET_Y + UI.SIZE_SUB + UI.SCORE_MARGIN_TOP;
        const scoreY = max(courtTop - UI.OFFSET_Y, minScoreY);
        text(`${p2Str} : ${p1Str}`, centerX, scoreY);

        textSize(UI.SIZE_SUB);
        text(`Games: ${this.opponentGames} - ${this.playerGames}`,
            centerX, scoreY - UI.GAMES_OFFSET_Y);
        pop();
    }
}