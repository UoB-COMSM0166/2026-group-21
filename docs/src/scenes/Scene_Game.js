const Scene_Game = {
    setup: function() {
        const p1Config = GAME_CONFIG.CHARACTERS[p1CharIndex];
        const p2Config = GAME_CONFIG.CHARACTERS[p2CharIndex];

        if (p1Config) {
            player.speed = p1Config.speed;
            player.skillType = p1Config.skillType;
            player.name = p1Config.name;
            if (characterImages[p1CharIndex]) player.img = characterImages[p1CharIndex].back;
        }

        if (p2Config) {
            opponent.speed = p2Config.speed;
            opponent.skillType = p2Config.skillType;
            opponent.name = p2Config.name;
            if (characterImages[p2CharIndex]) opponent.img = characterImages[p2CharIndex].front;
        }

        if (mapImages[selectedMap]) {
            backgroundImg = mapImages[selectedMap].bg;
            courtImg = mapImages[selectedMap].court;
        }

        player.isAI = false;
        if (!isMultiplayer && opponentAI) {
            opponent.isAI = true;
            const levelConfig = GAME_CONFIG.AI_LEVELS[selectedDifficulty || "NORMAL"];
            opponentAI.difficulty    = selectedDifficulty || "NORMAL";
            opponentAI.speedMult     = levelConfig.speedMult;
            opponentAI.reactionDelay = levelConfig.reactionDelay;
            opponentAI.errorRange    = levelConfig.errorRange;
            opponentAI.prediction    = levelConfig.prediction;
            opponentAI.resetServeState();
        } else {
            opponent.isAI = false;
        }
        this.restartGame();
    },

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
        // temporarily skillbar placeholder
        const barWidth = 150;
        const barHeight = 15;
        const margin = 20;

        player.displaySkillBar(
            width - barWidth - margin,
            height - barHeight - margin,
            barWidth,
            barHeight
        );

        opponent.displaySkillBar(
            margin,
            margin,
            barWidth,
            barHeight
        );
    },
    // handle keyboard triggers for player action, esc and restart
    handleInput: function () {
        const { CONTROLS } = GAME_CONFIG;
        if (keyCode === CONTROLS.ESCAPE) {
            if (currentState === GAME_CONFIG.STATES.PLAYING) currentState = GAME_CONFIG.STATES.PAUSED;
            return;
        }
        if (scoreManager.isMatchOver) {
            if (key.toLowerCase() === CONTROLS.RESTART) {
                if (soundManager) soundManager.play('confirm');
                this.restartGame();
            }
            return;
        }
        player.handleKeyPress(keyCode, ball);
        if (isMultiplayer) {
            opponent.handleKeyPress(keyCode, ball);
        }
    },

    restartGame: function () {
        player.resetState();
        opponent.resetState();
        if (soundManager && soundManager.sounds.victory) {
            soundManager.sounds.victory.stop();
        }
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