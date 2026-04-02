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
        this.personality = 'basic';
        this._attackerYRepositionTimer = -1;
        this._attackerYTarget = null;
        this.attackerChooseBaselineProb = 0.25; // chance to retreat to baseline
        this.attackerBaselineWhenBallDeepProb = 0.55; // retreat more when ball is deep
        this.attackerDeepBallThreshold = 0.35; // court-height ratio from top
        this.attackerPreferNetProb = 0.75; // when ball is near net
        this.attackerNormalNetProb = 0.45; // default net preference
        this.attackerRepositionMin = 12;
        this.attackerRepositionMax = 26;
        this.attackerRetreatRepositionMin = 16;
        this.attackerRetreatRepositionMax = 34;
        this.attackerAfterHitRetreatProb = 0.55;
        this.attackerAfterHitMin = 18;
        this.attackerAfterHitMax = 40;

        // "wide" (big left/right split shots) tuning (difficulty-adjusted in setPersonality)
        this.wideVxMin = 4;
        this.wideVxMax = 10;
        this.wideExtremeProb = 0.7;      // choose near-max magnitude more often
        this.wideAimAwayProb = 0.7;      // aim away from opponent x more often
        this.wideApplyProb = 0.65;       // chance to apply wide override on each hit
        this.skillUseMinFrames = 60;
        this.skillUseMaxFrames = 300;

        const defaultLevel = GAME_CONFIG.AI_LEVELS.NORMAL;
        this.difficulty     = 'NORMAL';
        this.speedMult      = defaultLevel.speedMult;
        this.reactionDelay  = defaultLevel.reactionDelay;
        this.errorRange     = defaultLevel.errorRange;
        this.prediction     = defaultLevel.prediction;

        this._reactionCounter = 0;
    }

    setPersonality(personality) {
        const p = (personality ?? 'basic').toString().toLowerCase();
        this.personality = p;

        const diff = (this.difficulty || 'NORMAL').toString().toUpperCase();

        // Difficulty-based tuning for skill usage frequency
        if (diff === 'EASY') {
            this.skillUseMinFrames = 100;
            this.skillUseMaxFrames = 360;
        } else if (diff === 'HARD') {
            this.skillUseMinFrames = 35;
            this.skillUseMaxFrames = 180;
        } else {
            // NORMAL
            this.skillUseMinFrames = 60;
            this.skillUseMaxFrames = 300;
        }

        // Reset attacker state when switching
        this._attackerYRepositionTimer = -1;
        this._attackerYTarget = null;

        // Difficulty-based tuning for "attacker" behavior
        if (p === 'attacker') {
            if (diff === 'EASY') {
                this.attackerChooseBaselineProb = 0.52;
                this.attackerBaselineWhenBallDeepProb = 0.78;
                this.attackerDeepBallThreshold = 0.42;
                this.attackerPreferNetProb = 0.42;
                this.attackerNormalNetProb = 0.18;
                this.attackerRepositionMin = 18;
                this.attackerRepositionMax = 34;
                this.attackerRetreatRepositionMin = 20;
                this.attackerRetreatRepositionMax = 40;
                this.attackerAfterHitRetreatProb = 0.8;
                this.attackerAfterHitMin = 22;
                this.attackerAfterHitMax = 44;
            } else if (diff === 'HARD') {
                this.attackerChooseBaselineProb = 0.28;
                this.attackerBaselineWhenBallDeepProb = 0.48;
                this.attackerDeepBallThreshold = 0.3;
                this.attackerPreferNetProb = 0.72;
                this.attackerNormalNetProb = 0.42;
                this.attackerRepositionMin = 8;
                this.attackerRepositionMax = 18;
                this.attackerRetreatRepositionMin = 12;
                this.attackerRetreatRepositionMax = 24;
                this.attackerAfterHitRetreatProb = 0.55;
                this.attackerAfterHitMin = 12;
                this.attackerAfterHitMax = 26;
            } else {
                // NORMAL
                this.attackerChooseBaselineProb = 0.38;
                this.attackerBaselineWhenBallDeepProb = 0.66;
                this.attackerDeepBallThreshold = 0.35;
                this.attackerPreferNetProb = 0.58;
                this.attackerNormalNetProb = 0.3;
                this.attackerRepositionMin = 12;
                this.attackerRepositionMax = 26;
                this.attackerRetreatRepositionMin = 16;
                this.attackerRetreatRepositionMax = 34;
                this.attackerAfterHitRetreatProb = 0.68;
                this.attackerAfterHitMin = 18;
                this.attackerAfterHitMax = 40;
            }
        }

        // Difficulty-based tuning for "wide" shot behavior
        if (p === 'wide') {
            if (diff === 'EASY') {
                // Easy: keep shots mostly central (narrow spread)
                this.wideVxMin = 2;
                this.wideVxMax = 5;
                this.wideExtremeProb = 0.2;
                this.wideAimAwayProb = 0.35;
                this.wideApplyProb = 0.35;
            } else if (diff === 'HARD') {
                this.wideVxMin = 6;
                this.wideVxMax = 14;
                this.wideExtremeProb = 0.85;
                this.wideAimAwayProb = 0.85;
                this.wideApplyProb = 0.75;
            } else {
                // NORMAL
                this.wideVxMin = 4;
                this.wideVxMax = 7;
                this.wideExtremeProb = 0.4;
                this.wideAimAwayProb = 0.5;
                this.wideApplyProb = 0.55;
            }
        }
    }

    resetServeState() {
        this.serveDelayTimer = -1;
        this.serveTargetX = -1;
        this.serveSwung = false;
        this.targetY = null;
        this._prevBounceCount = 0;
        this._skillUseTimer = -1;
        this._attackerYRepositionTimer = -1;
        this._attackerYTarget = null;
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

    getServiceLineY() {
        // Service line position ratio from court top
        return layout.courtTop + layout.COURT_H * GAME_CONFIG.AI.SERVE_LINE_RATIO;
    }

    getNetFrontY() {
        // Opponent (top side) can't cross the net margin, so choose just behind it.
        return layout.netY - GAME_CONFIG.PLAYER.NET_MARGIN - this.player.h / 2;
    }

    getBaselineY() {
        return layout.courtTop - GAME_CONFIG.PLAYER.SERVE_OFFSET - this.player.h / 2;
    }

    updateAttackerY(ball) {
        if (this.personality !== 'attacker') return;
        if (!ball || ball.isWaiting || ball.isTossing) return;

        // On serve receive: do NOT come forward before the first bounce.
        if (ball.justServed && scoreManager.currentServer === 'PLAYER' && ball.bounceCount === 0) {
            this._attackerYTarget = this.getBaselineY();
            return;
        }

        if (this._attackerYTarget == null) {
            this._attackerYTarget = this.getServiceLineY();
        }
        if (this._attackerYRepositionTimer === -1) {
            this._attackerYRepositionTimer = int(random(this.attackerRepositionMin, this.attackerRepositionMax));
        }

        this._attackerYRepositionTimer--;
        if (this._attackerYRepositionTimer > 0) return;

        const serviceY = this.getServiceLineY();
        const netFrontY = this.getNetFrontY();
        const baselineY = this.getBaselineY();

        const preferNet = (Math.abs(ball.y - layout.netY) < GAME_CONFIG.AI.BOUNCE_DISTANCE * 0.45);
        const deepBall = (ball.y < layout.courtTop + layout.COURT_H * this.attackerDeepBallThreshold);

        const retreatProb = deepBall ? this.attackerBaselineWhenBallDeepProb : this.attackerChooseBaselineProb;
        if (random(1) < retreatProb) {
            this._attackerYTarget = baselineY;
            this._attackerYRepositionTimer = int(
                random(this.attackerRetreatRepositionMin, this.attackerRetreatRepositionMax)
            );
            return;
        }

        const chooseNet = random(1) < (preferNet ? this.attackerPreferNetProb : this.attackerNormalNetProb);

        this._attackerYTarget = chooseNet ? netFrontY : serviceY;
        this._attackerYRepositionTimer = int(random(this.attackerRepositionMin, this.attackerRepositionMax));
    }

    updateTargetY(ball) {
        const serveLineY = layout.courtTop + layout.COURT_H * GAME_CONFIG.AI.SERVE_LINE_RATIO;

        if (ball.bounceCount === 1 && this._prevBounceCount === 0 && !ball.isTossing) {
            if (ball.y > serveLineY && ball.y < layout.netY) {
                if (this.personality === 'attacker') {
                    // Move up toward service line / net more aggressively
                    const preferNet = (Math.abs(ball.y - layout.netY) < GAME_CONFIG.AI.BOUNCE_DISTANCE * 0.45);
                    this.targetY = preferNet ? this.getNetFrontY() : this.getServiceLineY();
                } else {
                    this.targetY = ball.y - GAME_CONFIG.AI.BOUNCE_DISTANCE;
                }
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

        if (this.personality === 'attacker') {
            this.updateAttackerY(ball);
        }

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
        if (this.personality === 'attacker' && this.targetY == null && !ball.isWaiting && !ball.isTossing) {
            destY = this._attackerYTarget ?? destY;
        }
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
                // On serve receive, always wait for 1 bounce before returning.
                // (Only applies during the serve-return phase, not normal rallies/volleys.)
                if (!(ball.justServed && scoreManager.currentServer === 'PLAYER' && ball.bounceCount === 0)) {
                    this.player.swing(ball);
                    this.targetY = null;
                    // After hitting, attacker should often recover backward a bit.
                    if (this.personality === 'attacker') {
                        // Not always full retreat: sometimes stay around service line.
                        this._attackerYTarget = (random(1) < this.attackerAfterHitRetreatProb)
                            ? this.getBaselineY()
                            : this.getServiceLineY();
                        this._attackerYRepositionTimer = int(
                            random(this.attackerAfterHitMin, this.attackerAfterHitMax)
                        );
                    }
                }
            }
        }


        if (this.player.skillCooldown === 0 && this._skillUseTimer === -1) {
            this._skillUseTimer = int(random(this.skillUseMinFrames, this.skillUseMaxFrames));
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