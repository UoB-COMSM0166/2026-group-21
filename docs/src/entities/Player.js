class Player {
    constructor(x, img, isBottom) {
        this.x = x;
        this.img = img;
        this.w = GAME_CONFIG.PLAYER.WIDTH;
        this.h = GAME_CONFIG.PLAYER.HEIGHT;
        this.speed = GAME_CONFIG.PLAYER.SPEED;
        this.isBottom = isBottom; //true for bottom player, false for opponent
        this.swingTimer = 0; //duration of the hit active window
        this.resetPosition(x); //initialize position to the starting baseline
        this.skillCooldown = 0;
        this.maxCooldown = GAME_CONFIG.PLAYER.SKILL_COOLDOWN;
        this.currentFrame = 0;
        this.totalFrames = GAME_CONFIG.PLAYER.TOTAL_FRAMES;
        this.animSpeed = GAME_CONFIG.PLAYER.ANIM_SPEED;
        this.spriteW = GAME_CONFIG.PLAYER.SPRITE_WIDTH;
        this.spriteH = GAME_CONFIG.PLAYER.SPRITE_HEIGHT;
        this.spriteCols = GAME_CONFIG.PLAYER.SPRITE_COLS;
        this.hasHit = false;
        this.skillType = null; // This would be set after character selection
        this.activeBuff = null;
        this.stunTimer = 0;
        this.isAI = false;
        this.feedbackText = "";
        this.feedbackTimer = 0;
        this.wasBallNearOnSwing = false;
    }

    get isServer() {
        return (this.isBottom && scoreManager.currentServer === 'PLAYER') ||
               (!this.isBottom && scoreManager.currentServer === 'OPPONENT');
    }

    update() {
        if (!this.isAI) {
            this.handleInput();
        }
        this.updateTimers();
        this.applyConstraints();
    }

    display() {
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        if (this.stunTimer > 0) {
            this.drawStunStars();
        }
        if (this.activeBuff) {
            this.drawBuffAura();
        }
        this.drawSprite();

        const { FEEDBACK, COLORS } = GAME_CONFIG;

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
    // draw player swing animation sprite
    drawSprite() {
        let frameIdx = floor(this.currentFrame);
        let sx = (frameIdx % this.spriteCols) * this.spriteW;
        let sy = floor(frameIdx / this.spriteCols) * this.spriteH;
        if (this.img) {
            image(this.img, 0, 0, this.w, this.h, sx, sy, this.spriteW, this.spriteH);
        } else {
            //fallback if image fails to load
            fill(GAME_CONFIG.COLORS.FALLBACK);
            rect(0, 0, this.w, this.h);
        }
    }

    //enable the hit detection for a short period
    swing(ball) { 
        this.swingTimer = GAME_CONFIG.PLAYER.SWING_DURATION; 
        this.hasHit = false;

        if (ball) {
            let d = dist(this.x, this.y, ball.x, ball.y);
            this.wasBallNearOnSwing = (d < GAME_CONFIG.FEEDBACK.MISS_DISTANCE_THRESHOLD);
        } else {
            this.wasBallNearOnSwing = false;
        }
    }
    // handle skill and swing button
    // player skill key would be Q (which is keyCode 81) and opponent skill key: / (keyCode 191)
    handleKeyPress(keyCode, ball) {
        if (this.isAI) return;
        const { CONTROLS } = GAME_CONFIG;
        const actionKey = this.isBottom ? CONTROLS.PLAYER_ACTION : CONTROLS.OPPONENT_ACTION;
        const skillKey = this.isBottom
            ? (CONTROLS.PLAYER_SKILL != null ? CONTROLS.PLAYER_SKILL : 81)
            : (CONTROLS.OPPONENT_SKILL != null ? CONTROLS.OPPONENT_SKILL : 191);

        if (keyCode === actionKey) {
            if (this.isServer && ball.isWaiting) ball.toss();
            else this.swing(ball);
        } else if (keyCode === skillKey) {
            this.useSkill(ball);
        }
    }

    // reset player's position
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
        if (this.isAI) return;
        if (this.stunTimer > 0) return;
        // handle keyboard inputs based on player role
        // left, right, up, down arrows
        if (this.isBottom) {
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_LEFT)) this.moveLeft();
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_RIGHT)) this.moveRight();
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_UP)) this.moveUp();
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_DOWN)) this.moveDown();
        } else {
            // WASD
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_LEFT)) this.moveLeft();
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_RIGHT)) this.moveRight();
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_UP)) this.moveUp();
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_DOWN)) this.moveDown();
        }
    }
    // decrement hit window timer, skill cool down and calcu animation's frame
    updateTimers() {
        if (this.stunTimer > 0) {
            this.stunTimer--;
            return;
        }
        if (this.swingTimer > 0) {
            this.swingTimer--;
            this.currentFrame += this.animSpeed;

            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
            }
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
    //constraint player's position based on current state
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
        //serve mode boundaries
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
            //standard mode boundaries
        } else {
            minX = max(hw, courtLeft - COURT.MOVE_PADDING_X);
            maxX = min(width - hw, courtRight + COURT.MOVE_PADDING_X);
            if (this.isBottom) {
                minY = netY + PLAYER.NET_MARGIN + hh;
            } else {
                maxY = netY - PLAYER.NET_MARGIN - hh;
            }
        }
        //update position based on calculation
        this.x = constrain(this.x, minX, maxX);
        this.y = constrain(this.y, minY, maxY);
    }
    //normalizes position to a 0-1 scale to maintain alignment during resizing
    get relativePos() {
        return {
            x: (this.x - layout.courtLeft) / layout.COURT_W,
            y: (this.y - layout.courtTop) / layout.COURT_H
        };
    }
    //re-maps normalized coordinates back to absolute pixels after resizing
    reposition(rel, layout) {
        this.x = layout.courtLeft + rel.x * layout.COURT_W;
        this.y = layout.courtTop + rel.y * layout.COURT_H;
        this.applyConstraints();
    }

    useSkill(ball) {
        if (this.skillCooldown === 0) {
            SkillManager.execute(this, ball);
        }
    }
    // temporarily skillbar placeholder
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

    drawBuffAura() {
        push();
        let pulse = sin(frameCount * 0.15) * 15; 
        let baseSize = max(this.w, this.h) + 10;
        let auraSize = baseSize + pulse;

        let r = 255, g = 255, b = 255;

        noFill();
        
        strokeWeight(6);
        stroke(r, g, b, 80);
        ellipse(0, 0, auraSize + 10, auraSize + 10);
        
        strokeWeight(3);
        stroke(r, g, b, 200); 
        ellipse(0, 0, auraSize, auraSize);
        
        pop();
    }
    drawStunStars() {
        push();
        translate(0, -this.h / 2 - 10); 
        
        let stars = 3;
        for (let i = 0; i < stars; i++) {
            let angle = frameCount * 0.2 + (TWO_PI / stars) * i;
            let sx = cos(angle) * 20;
            let sy = sin(angle) * 5;
            
            fill(255, 255, 0);
            noStroke();
            ellipse(sx, sy, 8, 8); 
        }
        pop();
    }
}