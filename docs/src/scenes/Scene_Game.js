const Scene_Game = {
    isShowingScore: false,

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
        
        push();
        scale(layout.scaleFactor);
        
        imageMode(CORNER);
        image(courtImg, layout.courtLeft, layout.courtTop, layout.COURT_W, layout.COURT_H);
        if (scoreManager.isMatchOver) {
            scoreManager.displayGameOver();
            pop();
            return;
        }
        if (!this.isShowingScore) {
            player.update();
            if (isMultiplayer) {
                opponent.update();
            } else {
                opponentAI.update(ball);
                opponent.update();
            }
            ball.update();
            ball.checkHit(player);
            ball.checkHit(opponent);
        }
        player.display();
        opponent.display();
        MapManager.update(player, opponent, ball);
        ball.display();
        MapManager.draw();
        scoreManager.display();
        // temporarily skillbar placeholder
        const barWidth = 150;
        const barHeight = 15;
        const margin = 20;

        player.displaySkillBar(
            layout.VIRTUAL_W - barWidth - margin,
            layout.VIRTUAL_H - barHeight - margin,
            barWidth,
            barHeight
        );

        opponent.displaySkillBar(
            margin,
            margin,
            barWidth,
            barHeight
        );

        if (this.isShowingScore) {
            this.drawScoreOverlay();
        }
        pop();
    },
    // handle keyboard triggers for player action, esc and restart
    handleInput: function () {
        const { CONTROLS } = GAME_CONFIG;
        if (keyCode === CONTROLS.ESCAPE) {
            if (currentState === GAME_CONFIG.STATES.PLAYING) {
                pausedFromState = GAME_CONFIG.STATES.PLAYING;
                currentState = GAME_CONFIG.STATES.PAUSED;
            }
            return;
        }
        if (this.isShowingScore) return;
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
        if (soundManager && soundManager.sounds.victory && 
            soundManager.sounds.victory.isLoaded() && soundManager.sounds.victory.isPlaying()) {
            soundManager.sounds.victory.stop();
        }
        scoreManager.init();
        MapManager.reset();
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
    },

    drawScoreOverlay: function() {
        push();
        fill(0, 0, 0, 200);
        rectMode(CORNER);
        rect(0, 0, layout.VIRTUAL_W, layout.VIRTUAL_H);
        textAlign(CENTER, CENTER);
        let p1Name = player.name || player.charName || "PLAYER 1";
        let p2Name = opponent.name || opponent.charName || "PLAYER 2";

        const centerX = layout.VIRTUAL_W / 2;
        const centerY = layout.VIRTUAL_H / 2 - 20;

        fill(255);
        textSize(80);
        text(`${scoreManager.opponentGames} - ${scoreManager.playerGames}`, centerX, centerY);
        
        textSize(24);
        fill(150);
        text("GAMES", centerX, centerY + 60);

        let srcW = 100;
        let srcH = 64;
        let drawW = 100 * 1.5;
        let drawH = 64 * 1.5;

        if (opponent && opponent.img) {
            imageMode(CENTER);
            image(opponent.img, centerX - 180, centerY - 10, drawW, drawH, 0, 0, srcW, srcH); 
            fill(255, 100, 100); 
            textSize(24);
            text(p2Name.toUpperCase(), centerX - 180, centerY + 90);
        }

        if (player && player.img) {
            imageMode(CENTER);
            image(player.img, centerX + 180, centerY - 10, drawW, drawH, 0, 0, srcW, srcH);
            fill(100, 200, 255); 
            textSize(24);
            text(p1Name.toUpperCase(), centerX + 180, centerY + 90);
        }

        fill(0, 255, 0);
        textSize(26);
        let serverName = (scoreManager.currentServer === 'PLAYER') ? p1Name : p2Name;
        text(`Next Serve: ${serverName.toUpperCase()}`, centerX, centerY + 150);
        pop();
    }
};