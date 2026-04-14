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

        // score board
        this.drawCustomScoreboard();

        // skillbar placeholder
        // p1
        let p1Energy = player.skillCooldown === 0 ? 100 : map(player.skillCooldown, player.maxCooldown, 0, 0, 100);
        this.drawCircularSkillUI(
            layout.VIRTUAL_W - 500, 
            layout.VIRTUAL_H - 250, 
            p1Energy
        );

        // p2 or opponent
        let p2Energy = opponent.skillCooldown === 0 ? 100 : map(opponent.skillCooldown, opponent.maxCooldown, 0, 0, 100);
        this.drawCircularSkillUI(
            500, 
            250, 
            p2Energy
        );

        // gear
        this.drawPauseButton();

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

    handleMouse: function() {
        if (this.isShowingScore) return;

        // gear
        const margin = 60;
        const size = 72;
        const gearX = layout.VIRTUAL_W - margin;
        const gearY = margin;

        let mx = mouseX / layout.scaleFactor;
        let my = mouseY / layout.scaleFactor;

        if (dist(mx, my, gearX, gearY) < size/2) {
            if (currentState === GAME_CONFIG.STATES.PLAYING) {
                if (soundManager) soundManager.play('confirm');
                pausedFromState = GAME_CONFIG.STATES.PLAYING;
                currentState = GAME_CONFIG.STATES.PAUSED;
            }
        }
    },

    drawCustomScoreboard: function() {
        push();
        if (!scoreManager || scoreManager.playerScoreLabel == null || scoreManager.opponentScoreLabel == null) {
            return;
        }
        const boardW = 360; 
        const boardH = 300; 
        const marginX = 120;
        const marginY = 0;
        const x = marginX;
        const y = layout.VIRTUAL_H - marginY - boardH;
        
        let scoreKey = "";
        let p1 = (scoreManager?.playerScoreLabel ?? "0").toString().toLowerCase();
        let p2 = (scoreManager?.opponentScoreLabel ?? "0").toString().toLowerCase();

        if (p1 === "40" && p2 === "40") {
            scoreKey = "deuce";
        }
        else if (p1 === "ad") {
            scoreKey = "ad_40";
        } 
        else if (p2 === "ad") {
            scoreKey = "40_ad";
        }
        else {
            scoreKey = `${p1}_${p2}`;
        }
        
        let img = scoreImages[scoreKey];
        
        if (img && img.width && img.height) {
            image(img, x, y, boardW, boardH);
        }
        else {
            // backup scoring version
            noStroke();
            fill(30, 30, 30, 200);
            rect(x, y, boardW, boardH, 15);

            stroke(255, 50);
            strokeWeight(2);
            line(x + 20, y + boardH/2, x + boardW - 20, y + boardH/2);
            
            noStroke();
            textAlign(CENTER, CENTER);
            textStyle(BOLD);
            
            fill(255, 100, 100);
            textSize(32);
            text(scoreManager.opponentScoreLabel ?? "0", x + boardW/2, y + boardH * 0.3);
            
            fill(100, 200, 255);
            textSize(32);
            text(scoreManager.playerScoreLabel ?? "0", x + boardW/2, y + boardH * 0.7);
        }
            
        const customGold = color(255, 188, 31);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        noStroke();
        fill(customGold);
        textSize(22);

        let displayP1 = (p1 === "40" && p2 === "40") ? "DEUCE" : p1.toUpperCase();
        let displayP2 = (p1 === "40" && p2 === "40") ? "DEUCE" : p2.toUpperCase();
        
        text(`${scoreManager.opponentGames} : ${scoreManager.playerGames}`, x + boardW / 2 + 18, y + 225);

        pop();
    },


    drawPauseButton: function() {
        const margin = 60;
        const size = 72;
        const x = layout.VIRTUAL_W - margin;
        const y = margin;

        push();
        imageMode(CENTER);
        let mx = mouseX / layout.scaleFactor;
        let my = mouseY / layout.scaleFactor;
        
        if (dist(mx, my, x, y) < size/2) {
            tint(185, 185, 182);
            cursor(HAND);
        } else {
            noTint();
        }

        if (gearImg) {
            image(gearImg, x, y, size, size);
        }
        pop();
    },

    drawCircularSkillUI: function(x, y, energy) {
        const size = 80;         
        const strokeW = 8;       
        const radius = size / 2;
        const progress = (energy || 0) / 100; 
        const goldColor = color(255, 188, 31); 

        push();
        translate(x, y);

        // gray circle
        noStroke();
        fill(40, 40, 45); 
        circle(0, 0, size);

        // yellow thunder
        fill(goldColor);
        noStroke();
        beginShape();
        vertex(5, -28);
        vertex(-15, 5);
        vertex(-2, 5);
        vertex(-8, 28);
        vertex(15, -5);
        vertex(2, -5);
        endShape(CLOSE);

        // skill bar outer ring
        noFill();
        stroke(60, 60, 65, 150);
        strokeWeight(strokeW);
        ellipse(0, 0, size + strokeW + 4);

        // skill bar progress
        if (energy >= 100) {
            stroke(255, 255, 200); 
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = goldColor;
        } else {
            stroke(goldColor);
        }
        strokeWeight(strokeW);
        strokeCap(ROUND);
        let endAngle = map(progress, 0, 1, 0, TWO_PI);
        arc(0, 0, size + strokeW + 4, size + strokeW + 4, -HALF_PI, -HALF_PI + endAngle);

        pop();
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