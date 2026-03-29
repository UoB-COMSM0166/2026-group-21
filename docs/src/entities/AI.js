class AI {
    constructor(playerInstance) {
        this.player = playerInstance;
        this.noiseOffset = random(1000);
        this.fidgetSpeed = GAME_CONFIG.AI.FIDGET_SPEED;
        this.serveDelayTimer = -1;
        this.serveTargetX = -1;
        this.targetX = layout ? layout.centerX : 450;
        this.targetY = null;
        this.serveSwung = false;
        this._prevBounceCount = 0;
        this._skillUseTimer = -1;

        const defaultLevel = GAME_CONFIG.AI_LEVELS.NORMAL;
        this.difficulty     = 'NORMAL';
        this.speedMult      = defaultLevel.speedMult;
        this.reactionDelay  = defaultLevel.reactionDelay;
        this.errorRange     = defaultLevel.errorRange;
        this.prediction     = defaultLevel.prediction;

        this._reactionCounter = 0;
    }

    resetServeState() {
        this.serveDelayTimer = -1;
        this.serveTargetX = -1;
        this.serveSwung = false;
        this.targetY = null;
        this._prevBounceCount = 0;
        this._skillUseTimer = -1;
    }

    update(ball) {
        if (this.player.stunTimer > 0) {
            return;
        }

        this._reactionCounter++;
        if (this._reactionCounter >= this.reactionDelay) {
            this._reactionCounter = 0;

            if (ball.isWaiting || ball.isTossing) {
                if (scoreManager.currentServer === 'PLAYER') {
                    let isPlayerOnRight = player.x > layout.centerX;
                    let homeX = isPlayerOnRight ?
                        layout.courtLeft + (layout.COURT_W / GAME_CONFIG.AI.HOME_X_DIVISOR) :
                        layout.courtRight - (layout.COURT_W / GAME_CONFIG.AI.HOME_X_DIVISOR);
                    let fidgetRange = layout.COURT_W / GAME_CONFIG.AI.FIDGET_RANGE_DIVISOR;
                    let noiseValue = (noise(this.noiseOffset) - 0.5) * fidgetRange;
                    this.noiseOffset += this.fidgetSpeed;
                    this.targetX = homeX + noiseValue;
                } else {
                    this.targetX = this.calculateServePosition();
                }
                this.targetY = null;
            } else {
                let error = random(-this.errorRange, this.errorRange);
                this.targetX = ball.x + (ball.vx * this.prediction) + error;
                this.serveDelayTimer = -1;
                this.serveTargetX = -1;
            }
        }

        this.updateTargetY(ball);
        this.applySmoothMovement();
        this.handleActions(ball);
    }

    updateTargetY(ball) {
        const serveLineY = layout.courtTop + layout.COURT_H * GAME_CONFIG.AI.SERVE_LINE_RATIO;

        if (ball.bounceCount === 1 && this._prevBounceCount === 0 && !ball.isTossing) {
            if (ball.y > serveLineY && ball.y < layout.netY) {
                this.targetY = ball.y - GAME_CONFIG.AI.BOUNCE_DISTANCE;
            }
        }

        if (ball.bounceCount === 0 && this._prevBounceCount > 0) {
            this.targetY = null;
        }

        this._prevBounceCount = ball.bounceCount;
    }

    applySmoothMovement() {
        const AI = GAME_CONFIG.AI;
        const baseline = layout.courtTop - GAME_CONFIG.PLAYER.SERVE_OFFSET - this.player.h / 2;


        let dx = this.targetX - this.player.x;
        if (Math.abs(dx) >= AI.MOVE_DEADZONE) {
            let lerpFactor = (scoreManager.currentServer === 'PLAYER' && !ball.isWaiting)
                ? AI.LERP_FACTOR_NORMAL
                : AI.LERP_FACTOR_SERVE;
            let moveStep = dx * lerpFactor;
            moveStep = constrain(moveStep, -this.player.speed * this.speedMult, this.player.speed * this.speedMult);
            this.player.x += moveStep;
        }


        let destY = (this.targetY !== null) ? this.targetY : baseline;
        let dy = destY - this.player.y;
        if (Math.abs(dy) >= AI.MOVE_DEADZONE) {
            let moveStep = dy * AI.LERP_FACTOR_NORMAL;
            moveStep = constrain(moveStep, -this.player.speed * this.speedMult, this.player.speed * this.speedMult);
            this.player.y += moveStep;
        }
    }

    calculateServePosition() {
        if (this.serveTargetX !== -1) return this.serveTargetX;
        const { courtLeft, courtRight, centerX } = layout;
        const padding = (this.player.w / 2) + GAME_CONFIG.AI.SERVE_POS_PADDING;
        if (scoreManager.currentSide === 'RIGHT') {
            this.serveTargetX = random(centerX + padding, courtRight - padding);
        } else {
            this.serveTargetX = random(courtLeft + padding, centerX - padding);
        }
        return this.serveTargetX;
    }

    handleActions(ball) {
        if (!ball.isWaiting && !ball.isTossing && ball.vy < 0) {
            let xDiff = Math.abs(this.player.x - ball.x);
            let yDiff = Math.abs(this.player.y - ball.y);
            if (xDiff < GAME_CONFIG.AI.RECEIVE_X_THRESHOLD &&
                yDiff < GAME_CONFIG.AI.RECEIVE_Y_THRESHOLD) {
                this.player.swing(ball);
                this.targetY = null;
            }
        }


        if (this.player.skillCooldown === 0 && this._skillUseTimer === -1) {
            this._skillUseTimer = int(random(60, 300));
        }
        if (this._skillUseTimer > 0) {
            this._skillUseTimer--;
        } else if (this._skillUseTimer === 0 && !ball.isWaiting && !ball.isTossing) {
            this.player.useSkill(ball);
            this._skillUseTimer = -1;
        }

        if (scoreManager.currentServer === 'OPPONENT') {
            if (ball.isWaiting) {
                this.serveSwung = false;
                if (this.serveDelayTimer === -1) {
                    this.serveDelayTimer = int(random(
                        GAME_CONFIG.AI.SERVE_DELAY_MIN,
                        GAME_CONFIG.AI.SERVE_DELAY_MAX));
                }
                let distToTarget = Math.abs(this.player.x - this.serveTargetX);
                if (distToTarget < GAME_CONFIG.AI.SERVE_DIST_THRESHOLD && this.serveDelayTimer > 0) {
                    this.serveDelayTimer--;
                } else if (this.serveDelayTimer === 0) {
                    ball.toss();
                    this.serveDelayTimer = -1;
                }
            } else if (ball.isTossing && !this.serveSwung &&
                       ball.vz < 0 &&
                       ball.z > GAME_CONFIG.AI.SERVE_SWING_Z_MIN &&
                       ball.z < GAME_CONFIG.AI.SERVE_SWING_Z_MAX) {
                this.player.swing(ball);
                this.serveSwung = true;
            }
        }
    }
}