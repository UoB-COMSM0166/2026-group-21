class Player {
    constructor(x, img, isBottom) {
        this.x = x;
        this.img = img;
        this.w = GAME_CONFIG.PLAYER.WIDTH;
        this.h = GAME_CONFIG.PLAYER.HEIGHT;
        this.speed = GAME_CONFIG.PLAYER.SPEED;
        this.isBottom = isBottom; // true for bottom player, false for opponent
        this.swingTimer = 0; // duration of the hit active window
        this.resetPosition(x); // initialize position to the starting baseline
        this.skillCooldown = 0;
        this.maxCooldown = GAME_CONFIG.PLAYER.SKILL_COOLDOWN;
        this.currentFrame = 0;
        this.totalFrames = GAME_CONFIG.PLAYER.TOTAL_FRAMES;
        this.animSpeed = GAME_CONFIG.PLAYER.ANIM_SPEED;
        this.spriteW = GAME_CONFIG.PLAYER.SPRITE_WIDTH;
        this.spriteH = GAME_CONFIG.PLAYER.SPRITE_HEIGHT;
        this.spriteCols = GAME_CONFIG.PLAYER.SPRITE_COLS;
        this.hasHit = false;

        // Visual feedback states
        this.feedbackText = "";
        this.feedbackTimer = 0;
        this.wasBallNearOnSwing = false;
    }

    get isServer() {
        return (this.isBottom && scoreManager.currentServer === 'PLAYER') ||
               (!this.isBottom && scoreManager.currentServer === 'OPPONENT');
    }

    update(isAutoControlled = false) {
        if (!isAutoControlled) {
            this.handleInput();
        }
        this.updateTimers();
        this.applyConstraints();
    }

    display() {
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        this.drawSprite();
        
        const { FEEDBACK, COLORS } = GAME_CONFIG;

        // --- PERFECT / MISS visual feedback logic ---
        if (this.feedbackTimer > 0 && this.feedbackText !== "") {
            push(); 
            textAlign(CENTER, BOTTOM);
            textSize(FEEDBACK.TEXT_SIZE); 
            textStyle(BOLD);
            
            if (this.feedbackText === "PERFECT") {
                fill(...COLORS.FEEDBACK_PERFECT); 
            } else {
                fill(...COLORS.FEEDBACK_MISS); 
            }
            text(this.feedbackText, 0, -this.h / 2 - FEEDBACK.TEXT_OFFSET_Y);
            pop();
        }
        
        // --- Serve Indicator logic ---
        if (this.isServer && typeof ball !== 'undefined' && ball.isWaiting) {
            push();
            let bounceOffset = sin(frameCount * FEEDBACK.INDICATOR_ANIM_SPEED) * FEEDBACK.INDICATOR_ANIM_AMP; 
            translate(0, -this.h / 2 - FEEDBACK.INDICATOR_OFFSET_Y + bounceOffset); 
            fill(...COLORS.INDICATOR_YELLOW); 
            noStroke();
            let w = FEEDBACK.INDICATOR_WIDTH;
            let h = FEEDBACK.INDICATOR_HEIGHT;
            triangle(-w, -h, w, -h, 0, 0);  
            pop();
        }

        pop();
    }

    drawSprite() {
        let frameIdx = floor(this.currentFrame);
        let sx = (frameIdx % this.spriteCols) * this.spriteW;
        let sy = floor(frameIdx / this.spriteCols) * this.spriteH;
        if (this.img) {
            image(this.img, 0, 0, this.w, this.h, sx, sy, this.spriteW, this.spriteH);
        } else {
            fill(GAME_CONFIG.COLORS.FALLBACK);
            rect(0, 0, this.w, this.h);
        }
    }

    swing(ball) { 
        this.swingTimer = GAME_CONFIG.PLAYER.SWING_DURATION; 
        this.hasHit = false;

        // Record proximity for potential MISS evaluation
        if (ball) {
            let d = dist(this.x, this.y, ball.x, ball.y);
            this.wasBallNearOnSwing = (d < GAME_CONFIG.FEEDBACK.MISS_DISTANCE_THRESHOLD);
        } else {
            this.wasBallNearOnSwing = false;
        }
    }

    handleKeyPress(keyCode, ball) {
        const { CONTROLS } = GAME_CONFIG;
        const actionKey = this.isBottom ? CONTROLS.PLAYER_ACTION : CONTROLS.OPPONENT_ACTION;
        const skillKey = this.isBottom ? CONTROLS.PLAYER_SKILL : CONTROLS.OPPONENT_SKILL;

        if (keyCode === actionKey) {
            if (this.isServer && ball.isWaiting) ball.toss();
            else this.swing(ball); // Pass the ball reference
        } else if (keyCode === skillKey) {
            this.useSkill(ball);
        }
    }

    resetPosition(newX) {
        this.x = newX;
        let serveBackDistance = GAME_CONFIG.PLAYER.SERVE_OFFSET;
        if (this.isBottom) {
            this.y = layout.courtBottom + serveBackDistance - this.h / 2;
        } else {
            this.y = layout.courtTop - serveBackDistance - this.h / 2;
        }
    }

    moveLeft() { this.x -= this.speed; }
    moveRight() { this.x += this.speed; }
    moveUp() { this.y -= this.speed; }
    moveDown() { this.y += this.speed; }

    handleInput() {
        if (this.isBottom) {
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_LEFT)) this.moveLeft();
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_RIGHT)) this.moveRight();
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_UP)) this.moveUp();
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_DOWN)) this.moveDown();
        } else {
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_LEFT)) this.moveLeft();
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_RIGHT)) this.moveRight();
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_UP)) this.moveUp();
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_DOWN)) this.moveDown();
        }
    }

    updateTimers() {
        if (this.swingTimer > 0) {
            this.swingTimer--;
            this.currentFrame += this.animSpeed;

            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
            }

            // Evaluate MISS at the exact end of the swing window
            if (this.swingTimer === 0) {
                if (this.wasBallNearOnSwing && !this.hasHit && this.feedbackText !== "PERFECT") {
                    this.feedbackText = "MISS";
                    this.feedbackTimer = GAME_CONFIG.FEEDBACK.DISPLAY_DURATION; 
                }
            }
        } else {
            this.currentFrame = 0;
        }
        
        if (this.skillCooldown > 0) this.skillCooldown--;

        if (this.feedbackTimer > 0) {
            this.feedbackTimer--;
        } else {
            this.feedbackText = "";
        }
    }

    applyConstraints() {
        const { COURT, PLAYER } = GAME_CONFIG;
        const { courtLeft, courtRight, courtTop, courtBottom, centerX, netY } = layout;
        const hw = this.w / 2;
        const hh = this.h / 2;
        let minX, maxX, minY, maxY;
        if (this.isBottom) {
            maxY = min(height - hh, courtBottom + COURT.MOVE_PADDING_Y);
        } else {
            minY = max(hh, courtTop - COURT.MOVE_PADDING_Y);
        }
        const isServingNow = (ball.isWaiting || ball.isTossing) && this.isServer;
        
        if (isServingNow) {
            if (scoreManager.currentSide === 'RIGHT') {
                minX = centerX + hw;
                maxX = courtRight - hw;
            } else {
                minX = courtLeft + hw;
                maxX = centerX - hw;
            }
            if (this.isBottom) {
                minY = courtBottom - hh;
            } else {
                maxY = courtTop - hh;
            }
        } else {
            minX = max(hw, courtLeft - COURT.MOVE_PADDING_X);
            maxX = min(width - hw, courtRight + COURT.MOVE_PADDING_X);
            if (this.isBottom) {
                minY = netY + PLAYER.NET_MARGIN + hh;
            } else {
                maxY = netY - PLAYER.NET_MARGIN - hh;
            }
        }
        this.x = constrain(this.x, minX, maxX);
        this.y = constrain(this.y, minY, maxY);
    }

    get relativePos() {
        return {
            x: (this.x - layout.courtLeft) / layout.COURT_W,
            y: (this.y - layout.courtTop) / layout.COURT_H
        };
    }

    reposition(rel, layout) {
        this.x = layout.courtLeft + rel.x * layout.COURT_W;
        this.y = layout.courtTop + rel.y * layout.COURT_H;
        this.applyConstraints();
    }

    useSkill(ball) {
        if (this.skillCooldown === 0) {
            SkillManager.execute(this, ball);
            this.skillCooldown = this.maxCooldown;
        }
    }

    displaySkillBar(x, y, w, h) {
        push();
        let progress = 1 - (this.skillCooldown / this.maxCooldown);
        progress = constrain(progress, 0, 1);

        noStroke();
        fill(50, 50, 50, 200);
        rectMode(CORNER);
        rect(x, y, w, h, 5);

        if (progress >= 1) {
            fill(GAME_CONFIG.COLORS.PINK);
            if (frameCount % 30 < 15) fill(255);
        } else {
            fill(100, 200, 255);
        }
        rect(x, y, w * progress, h, 5);
        fill(255);
        textSize(12);
        textAlign(LEFT, CENTER);
        text("SKILL", x + 5, y + h / 2);
        pop();
    }
}