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
        this._prevHitStatus = false;
        this._skillUseTimer = -1;
        this.personality = 'basic';
        this._attackerYRepositionTimer = -1;
        this._attackerYTarget = null;
        this.attackerChooseBaselineProb = 0.25; // chance to retreat to baseline
        this.attackerBaselineWhenBallDeepProb = 0.55; // retreat more when ball is deep
        this.attackerDeepBallThreshold = 0.35; // court-height ratio from top
        this.attackerPreferNetProb = 0.75; // when ball is near net
        this.attackerNormalNetProb = 0.45; // default net preference
        this.attackerFrontCourtRatio = 0.25; // safest aggressive line for fixed-power returns
        this.attackerHitSafeCourtRatio = 0.16; // furthest forward contact line before fixed-power shots become unsafe
        this.attackerAngleVxMin = 1.5; // mild horizontal spread so attacker pressures without becoming "wide"
        this.attackerAngleVxMax = 4;
        this.attackerAngleApplyProb = 0.55;
        this.attackerAngleAimAwayProb = 0.7;
        this.attackerRepositionMin = 12;
        this.attackerRepositionMax = 26;
        this.attackerRetreatRepositionMin = 16;
        this.attackerRetreatRepositionMax = 34;
        this.attackerAfterHitRetreatProb = 0.55;
        this.attackerAfterHitMin = 18;
        this.attackerAfterHitMax = 40;
        this.wallTrackRatio = 0.65; // how far wall drifts from center toward the ball
        this.wallCenterJitter = 18; // small offset so wall doesn't feel robotic
        this.wallReturnSpread = 26; // target spread around court center on returns
        this.wallReturnClampScale = 0.72; // extra safety factor for center returns

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
                this.attackerFrontCourtRatio = 0.26;
                this.attackerHitSafeCourtRatio = 0.15;
                this.attackerAngleVxMin = 1.2;
                this.attackerAngleVxMax = 3;
                this.attackerAngleApplyProb = 0.42;
                this.attackerAngleAimAwayProb = 0.58;
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
                this.attackerFrontCourtRatio = 0.32;
                this.attackerHitSafeCourtRatio = 0.18;
                this.attackerAngleVxMin = 2.2;
                this.attackerAngleVxMax = 5.5;
                this.attackerAngleApplyProb = 0.72;
                this.attackerAngleAimAwayProb = 0.82;
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
                this.attackerFrontCourtRatio = 0.29;
                this.attackerHitSafeCourtRatio = 0.16;
                this.attackerAngleVxMin = 1.7;
                this.attackerAngleVxMax = 4.2;
                this.attackerAngleApplyProb = 0.58;
                this.attackerAngleAimAwayProb = 0.72;
                this.attackerRepositionMin = 12;
                this.attackerRepositionMax = 26;
                this.attackerRetreatRepositionMin = 16;
                this.attackerRetreatRepositionMax = 34;
                this.attackerAfterHitRetreatProb = 0.68;
                this.attackerAfterHitMin = 18;
                this.attackerAfterHitMax = 40;
            }
        }

        // Difficulty-based tuning for "wall" behavior
        if (p === 'wall') {
            if (diff === 'EASY') {
                this.wallTrackRatio = 0.5;
                this.wallCenterJitter = 32;
                this.wallReturnSpread = 42;
                this.wallReturnClampScale = 0.64;
            } else if (diff === 'HARD') {
                this.wallTrackRatio = 0.82;
                this.wallCenterJitter = 10;
                this.wallReturnSpread = 14;
                this.wallReturnClampScale = 0.82;
            } else {
                // NORMAL
                this.wallTrackRatio = 0.68;
                this.wallCenterJitter = 22;
                this.wallReturnSpread = 26;
                this.wallReturnClampScale = 0.74;
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
        this._prevHitStatus = false;
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
                // Use smooth noise instead of random jumping to prevent jitter
                let error = (noise(frameCount * 0.05, this.noiseOffset) - 0.5) * 2 * this.errorRange;
                if (this.personality === 'wall') {
                    // Wall keeps a central base and only shades toward the incoming ball.
                    const predictedX = ball.x + (ball.vx * this.prediction);
                    const centerOffset = (noise(frameCount * 0.03, this.noiseOffset) - 0.5) * 2 * this.wallCenterJitter;
                    this.targetX = layout.centerX + ((predictedX - layout.centerX) * this.wallTrackRatio) + centerOffset;
                } else {
                    this.targetX = ball.x + (ball.vx * this.prediction) + error;
                }
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

    getWallHomeX() {
        return layout.centerX;
    }

    getAttackerFrontY() {
        // Keep attacker aggressive, but not so close to the net that fixed-power shots frequently sail long.
        const ratioFrontY = layout.courtTop + layout.COURT_H * this.attackerFrontCourtRatio;
        return min(this.getNetFrontY(), ratioFrontY);
    }

    getAttackerHitSafeY() {
        // Waiting position can be forward, but actual contact should stay on a safer line.
        const ratioSafeY = layout.courtTop + layout.COURT_H * this.attackerHitSafeCourtRatio;
        return min(this.getAttackerFrontY(), ratioSafeY);
    }

    isServeReceivePhase(ball) {
        return ball && ball.justServed && scoreManager.currentServer === 'PLAYER';
    }

    updateAttackerY(ball) {
        if (this.personality !== 'attacker') return;
        if (!ball || ball.isWaiting || ball.isTossing) return;

        // On serve receive: do NOT come forward before the first bounce.
        if (this.isServeReceivePhase(ball)) {
            this._attackerYTarget = this.getBaselineY();
            return;
        }

        // After attacking, hold the chosen lane while the ball is on the player's side
        // so the AI doesn't fidget vertically waiting for the next return.
        if (ball.lastHitter === this.player && ball.y >= layout.netY) {
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
        const netFrontY = this.getAttackerFrontY();
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
        const isServeReceive = this.isServeReceivePhase(ball);

        if (ball.roundEnding) {
            this.targetY = this.getBaselineY();
            this._prevBounceCount = ball.bounceCount;
            return;
        }

        if (this.personality === 'wall' && !ball.isWaiting && !ball.isTossing) {
            // Wall recovers back to the baseline instead of creeping forward in rallies.
            this.targetY = this.getBaselineY();
        }

        if (ball.bounceCount === 1 && this._prevBounceCount === 0 && !ball.isTossing) {
            if (ball.y > serveLineY && ball.y < layout.netY) {
                // Calculate dynamic bounce distance based on ball speed multiplier
                const speedFactor = ball.speedMultiplier !== undefined ? ball.speedMultiplier : 1.0;
                // If it's a slow ball, reduce distance (but keep a small minimum to avoid standing on the ball)
                const dynamicBounceDist = Math.max(
                    GAME_CONFIG.AI.RECEIVE_Y_THRESHOLD * 0.5, 
                    GAME_CONFIG.AI.BOUNCE_DISTANCE * speedFactor
                );

                if (this.personality === 'attacker' && !isServeReceive) {
                    // Move up toward service line / net more aggressively
                    const preferNet = (Math.abs(ball.y - layout.netY) < dynamicBounceDist * 0.45);
                    this.targetY = preferNet ? this.getAttackerHitSafeY() : min(this.getServiceLineY(), this.getAttackerHitSafeY());

                    // Force attacker to get close enough if ball is critically short
                    if (this.targetY > ball.y - dynamicBounceDist + GAME_CONFIG.AI.RECEIVE_Y_THRESHOLD * 0.8) {
                        this.targetY = min(this.getAttackerHitSafeY(), ball.y - dynamicBounceDist);
                    }
                } else if (this.personality === 'wall') {
                    // Wall prefers depth and stability, so even on short balls it avoids stepping in.
                    this.targetY = this.getBaselineY();
                } else {
                    this.targetY = ball.y - dynamicBounceDist;
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
        const isServeReceive = this.isServeReceivePhase(ball);
        const isRoundEnding = !!ball.roundEnding;

        if (this.personality === 'attacker' && !isServeReceive && !isRoundEnding) {
            this.updateAttackerY(ball);
        }

        // During point-end recovery, don't reserve a serve target yet.
        // Otherwise attacker can carry a stale serveTargetX into the next point and never toss.
        const targetX = isRoundEnding
            ? this.player.x
            : (this.personality === 'wall' && !ball.isWaiting && !ball.isTossing
                ? this.targetX
                : this.targetX);
        let dx = targetX - this.player.x;
        if (Math.abs(dx) >= AI.MOVE_DEADZONE) {
            let lerpFactor = isRoundEnding
                ? AI.LERP_FACTOR_SERVE
                : ((scoreManager.currentServer === 'PLAYER' && !ball.isWaiting)
                    ? AI.LERP_FACTOR_NORMAL
                    : AI.LERP_FACTOR_SERVE);
            let moveStep = dx * lerpFactor;
            const maxSpeed = isRoundEnding
                ? this.player.speed * this.speedMult * 0.7
                : this.player.speed * this.speedMult;
            moveStep = constrain(moveStep, -maxSpeed, maxSpeed);
            this.player.x += moveStep;
        }


        let destY = (this.targetY !== null) ? this.targetY : baseline;
        if (this.personality === 'attacker' && !isServeReceive && !isRoundEnding && this.targetY == null && !ball.isWaiting && !ball.isTossing) {
            destY = this._attackerYTarget ?? destY;
        }
        let dy = destY - this.player.y;
        if (Math.abs(dy) >= AI.MOVE_DEADZONE) {
            let lerpFactor = isRoundEnding ? AI.LERP_FACTOR_SERVE : AI.LERP_FACTOR_NORMAL;
            let moveStep = dy * lerpFactor;
            const maxSpeed = isRoundEnding
                ? this.player.speed * this.speedMult * 0.7
                : this.player.speed * this.speedMult;
            moveStep = constrain(moveStep, -maxSpeed, maxSpeed);
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
                // Attacker can wait forward, but should step back to a safe hit line
                // before swinging so fixed-power returns stay playable.
                if (this.personality === 'attacker' &&
                    !this.isServeReceivePhase(ball) &&
                    this.player.y > this.getAttackerHitSafeY() + GAME_CONFIG.AI.MOVE_DEADZONE) {
                    return;
                }
                // On serve receive, always wait for 1 bounce before returning.
                // (Only applies during the serve-return phase, not normal rallies/volleys.)
                if (!(ball.justServed && scoreManager.currentServer === 'PLAYER' && ball.bounceCount === 0)) {
                    this.player.swing(ball);
                }
            }
        }

        // Only retreat and reset targetY AFTER genuinely hitting the ball
        if (this.player.hasHit && !this._prevHitStatus) {
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
        this._prevHitStatus = this.player.hasHit;

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
