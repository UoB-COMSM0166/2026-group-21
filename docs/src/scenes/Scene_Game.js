const Scene_Game = {
    draw: function () {
        strokeWeight(GAME_CONFIG.VISUALS.BASE_STROKE_WEIGHT);
        stroke(GAME_CONFIG.COLORS.BLACK);
        background(backgroundImg);
        imageMode(CORNER);
        image(courtImg, layout.courtLeft, layout.courtTop, layout.COURT_W, layout.COURT_H);
        if (scoreManager.isMatchOver) {
            scoreManager.displayGameOver();
            return;
        }
        player.update();
        player.display();
        if (isMultiplayer) {
            opponent.update();
        } else {
            opponentAI.update(ball);
            opponent.update();
        }
        opponent.display();
        ball.update();
        ball.checkHit(player);
        ball.checkHit(opponent);
        ball.display();
        scoreManager.display();
    },
    // handle keyboard triggers for serving, swinging, esc and restart
    handleInput: function () {
        const { CONTROLS } = GAME_CONFIG;
        if (keyCode === CONTROLS.ESCAPE) {
            if (currentState === GAME_CONFIG.STATES.PLAYING) currentState = GAME_CONFIG.STATES.PAUSED;
            else if (currentState === GAME_CONFIG.STATES.PAUSED) currentState = GAME_CONFIG.STATES.PLAYING;
            return;
        }
        if (scoreManager.isMatchOver) {
            if (key.toLowerCase() === CONTROLS.RESTART) this.restartGame();
            return;
        }
        if (keyCode === CONTROLS.PLAYER_ACTION) {
            if (scoreManager.currentServer === 'PLAYER' && ball.isWaiting) ball.toss();
            else player.swing();
        }
        if (isMultiplayer) {
            if (keyCode === CONTROLS.OPPONENT_ACTION) {
                if (scoreManager.currentServer === 'OPPONENT' && ball.isWaiting) ball.toss();
                else opponent.swing();
            }
        }
    },

    restartGame: function () {
        scoreManager.init();
        this.nextRound();
    },
    // transition between rounds and switch service sides
    nextRound: function () {
        let serverX = (scoreManager.currentSide === 'RIGHT') ? layout.sideRight : layout.sideLeft;
        let receiverX = (scoreManager.currentSide === 'RIGHT') ? layout.sideLeft : layout.sideRight;

        if (scoreManager.currentServer === 'PLAYER') {
            player.resetPosition(serverX);
            opponent.resetPosition(receiverX);
            ball.reset(player.x, player.y, 'PLAYER');
        } else {
            opponent.resetPosition(serverX);
            player.resetPosition(receiverX);
            ball.reset(opponent.x, opponent.y, 'OPPONENT');
        }
    }
};