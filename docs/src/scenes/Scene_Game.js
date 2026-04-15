const Scene_Game = {
    isShowingScore: false,

    setup: function() {
        const p1Config = GAME_CONFIG.CHARACTERS[p1CharIndex];
        const p2Config = GAME_CONFIG.CHARACTERS[p2CharIndex];

        if (p1Config) {
            player.speed = p1Config.speed;
            player.skillType = p1Config.skillType;
            player.name = p1Config.name;
            player.charName = p1Config.charName || p1Config.name.toLowerCase();
            if (characterImages[p1CharIndex]) player.img = characterImages[p1CharIndex].back;
        }

        if (p2Config) {
            opponent.speed = p2Config.speed;
            opponent.skillType = p2Config.skillType;
            opponent.name = p2Config.name;
            opponent.charName = p2Config.charName || p2Config.name.toLowerCase();
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
            p1Energy,
            player.charName
        );

        // p2 or opponent
        let p2Energy = opponent.skillCooldown === 0 ? 100 : map(opponent.skillCooldown, opponent.maxCooldown, 0, 0, 100);
        this.drawCircularSkillUI(
            500, 
            250, 
            p2Energy,
            opponent.charName
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
            pop();
            return;
        }

        const customGold = color(255, 188, 31);

        // pic
        const imgW = 360; 
        const imgH = 300; 
        const imgX = 120;
        const imgY = layout.VIRTUAL_H - imgH + 30;
        
        // back up
        const backupW = 280;
        const backupH = 165;
        const backupX = 180;
        const backupY = layout.VIRTUAL_H - backupH - 15;
        const dividerX = backupX + backupW / 2;

        let p1 = (scoreManager?.playerScoreLabel ?? "0").toString().toLowerCase();
        let p2 = (scoreManager?.opponentScoreLabel ?? "0").toString().toLowerCase();

        const isDeuce = (p1 === "40" && p2 === "40") || p1 === "deuce" || p2 === "deuce";
        const isP1Ad = (p1 === "ad");
        const isP2Ad = (p2 === "ad");

        let scoreKey = isDeuce ? "deuce" : (isP1Ad ? "ad_40" : (isP2Ad ? "40_ad" : `${p1}_${p2}`));
        let img = scoreImages[scoreKey];
        
        if (img && img.width && img.height) {
            image(img, imgX, imgY, imgW, imgH);
        }
        else {
            // backup scoring design
            push();
            noStroke();
            fill(20, 20, 25, 220);
            rect(backupX, backupY, backupW, backupH, 20);

            textAlign(CENTER, CENTER);
            textStyle(BOLD);

            if (isDeuce) {
                fill(customGold);
                textSize(50);
                text("DEUCE", dividerX, backupY + 75);
            }
            else{
                stroke(255, 255, 255, 60);
                strokeWeight(2);
                line(dividerX, backupY + 45, dividerX, backupY + 110);
                noStroke();
                
                textSize(54);
                // p1
                fill(255, 100, 100);
                let p1Display = isP1Ad ? "AD" : (isP2Ad ? "40" : p1.toUpperCase());
                text(p1Display, dividerX - 65, backupY + 75);

                // p2
                fill(100, 200, 255);
                let p2Display = isP2Ad ? "AD" : (isP1Ad ? "40" : p2.toUpperCase());
                text(p2Display, dividerX + 65, backupY + 75);
            
                textSize(12);
                fill(255, 120);
                text("P1", dividerX - 65, backupY + 30);
                text("P2", dividerX + 65, backupY + 30);
            }
            pop();
        }
            
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        noStroke();
        fill(customGold);
        textSize(22);
        
        text(`${scoreManager.playerGames} : ${scoreManager.opponentGames}`, dividerX, backupY + 135);

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

    drawCircularSkillUI: function(x, y, energy, roleName) {
        const ui = GAME_CONFIG.UI;
        const size = ui.SKILL_BUTTON_SIZE;         
        const strokeW = 8;
        const progress = (energy || 0) / 100; 
        const goldColor = color(255, 188, 31); 

        push();
        translate(x, y);
        imageMode(CENTER);

        // skill button pics
        let roleKey = roleName ? roleName.toLowerCase() : "";
        let img = skillButtonImages[roleKey];
        //img = null;

        if (img && img.width > 0) {
            image(img, 0, 0, size, size);
            
            // fan-shaped mask
            if (progress < 1) {
                fill(0, 0, 0, ui.SKILL_MASK_OPACITY);
                noStroke();

                let maskSize =  size - ui.SKILL_MASK_INSET;
                let angle = map(progress, 0, 1, TWO_PI, 0);
                arc(0, 0, maskSize, maskSize, -HALF_PI, -HALF_PI + angle, PIE);
            }
        }
        else{
            //gray circle
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
        }

        // full energy effects
        if (progress >= 1) {
            noFill();
            stroke(...ui.GOLD_COLOR);
            strokeWeight(5);
            circle(0, 0, size + 8);
        }
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
        text(`${scoreManager.playerGames} - ${scoreManager.opponentGames}`, centerX, centerY);
        
        textSize(24);
        fill(150);
        text("GAMES", centerX, centerY + 60);

        let srcW = 100;
        let srcH = 64;
        let drawW = 100 * 1.5;
        let drawH = 64 * 1.5;

        if (player && player.img) {
            imageMode(CENTER);
            image(player.img, centerX - 180, centerY - 10, drawW, drawH, 0, 0, srcW, srcH); 
            fill(255, 100, 100); 
            textSize(24);
            text(p1Name.toUpperCase(), centerX - 180, centerY + 90);
        }

        if (opponent && opponent.img) {
            imageMode(CENTER);
            image(opponent.img, centerX + 180, centerY - 10, drawW, drawH, 0, 0, srcW, srcH);
            fill(100, 200, 255); 
            textSize(24);
            text(p2Name.toUpperCase(), centerX + 180, centerY + 90);
        }

        fill(0, 255, 0);
        textSize(26);
        let serverName = (scoreManager.currentServer === 'PLAYER') ? p1Name : p2Name;
        text(`Next Serve: ${serverName.toUpperCase()}`, centerX, centerY + 150);
        pop();
    }
};