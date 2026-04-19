class AI {
    constructor(playerInstance) {
        this.player = playerInstance;
        this.noiseOffset = random(GAME_CONFIG.AI_PERSONALITIES.DEFAULT_INIT.NOISE_OFFSET_MAX);
        this.fidgetSpeed = GAME_CONFIG.AI.FIDGET_SPEED;
        this.serveDelayTimer = -1;
        this.serveTargetX = -1;
        this.targetX = layout ? layout.centerX : GAME_CONFIG.AI_PERSONALITIES.DEFAULT_INIT.TARGET_X_FALLBACK;
        this.targetY = null;
        this.serveSwung = false;
        this._prevBounceCount = 0;
        this._prevHitStatus = false;
        this._skillUseTimer = -1;
        this.personality = 'basic';
        this.vx = 0;
        this.vy = 0;
        this._attackerYRepositionTimer = -1;
        this._attackerYTarget = null;
        
        // Initialize with default attacker values (will be overridden by setPersonality)
        const attackerDefaults = GAME_CONFIG.AI_PERSONALITIES.ATTACKER.DEFAULT;
        this.attackerChooseBaselineProb = attackerDefaults.CHOOSE_BASELINE_PROB;
        this.attackerBaselineWhenBallDeepProb = attackerDefaults.BASELINE_WHEN_BALL_DEEP_PROB;
        this.attackerDeepBallThreshold = attackerDefaults.DEEP_BALL_THRESHOLD;
        this.attackerPreferNetProb = attackerDefaults.PREFER_NET_PROB;
        this.attackerNormalNetProb = attackerDefaults.NORMAL_NET_PROB;
        this.attackerFrontCourtRatio = attackerDefaults.FRONT_COURT_RATIO;
        this.attackerHitSafeCourtRatio = attackerDefaults.HIT_SAFE_COURT_RATIO;
        this.attackerAngleVxMin = attackerDefaults.ANGLE_VX_MIN;
        this.attackerAngleVxMax = attackerDefaults.ANGLE_VX_MAX;
        this.attackerAngleApplyProb = attackerDefaults.ANGLE_APPLY_PROB;
        this.attackerAngleAimAwayProb = attackerDefaults.ANGLE_AIM_AWAY_PROB;
        this.attackerRepositionMin = attackerDefaults.REPOSITION_MIN;
        this.attackerRepositionMax = attackerDefaults.REPOSITION_MAX;
        this.attackerRetreatRepositionMin = attackerDefaults.RETREAT_REPOSITION_MIN;
        this.attackerRetreatRepositionMax = attackerDefaults.RETREAT_REPOSITION_MAX;
        this.attackerAfterHitRetreatProb = attackerDefaults.AFTER_HIT_RETREAT_PROB;
        this.attackerAfterHitMin = attackerDefaults.AFTER_HIT_MIN;
        this.attackerAfterHitMax = attackerDefaults.AFTER_HIT_MAX;
        
        // Initialize with default wall values (will be overridden by setPersonality)
        const wallDefaults = GAME_CONFIG.AI_PERSONALITIES.WALL.DEFAULT;
        this.wallTrackRatio = wallDefaults.TRACK_RATIO;
        this.wallCenterJitter = wallDefaults.CENTER_JITTER;
        this.wallReturnSpread = wallDefaults.RETURN_SPREAD;
        this.wallReturnClampScale = wallDefaults.RETURN_CLAMP_SCALE;
        
        // Initialize with default wide values (will be overridden by setPersonality)
        const wideDefaults = GAME_CONFIG.AI_PERSONALITIES.WIDE.DEFAULT;
        this.wideAimAwayProb = wideDefaults.AIM_AWAY_PROB;
        this.wideApplyProb = wideDefaults.APPLY_PROB;
        this.wideSpreadMin = wideDefaults.SPREAD_RATIO_MIN;
        this.wideSpreadMax = wideDefaults.SPREAD_RATIO_MAX;
        
        // Initialize skill usage frames
        const initDefaults = GAME_CONFIG.AI_PERSONALITIES.DEFAULT_INIT;
        this.skillUseMinFrames = initDefaults.SKILL_USE_MIN_FRAMES;
        this.skillUseMaxFrames = initDefaults.SKILL_USE_MAX_FRAMES;

        const defaultLevel = GAME_CONFIG.AI_LEVELS.EASY;
        this.difficulty     = 'EASY';
        this.speedMult      = defaultLevel.speedMult;
        this.reactionDelay  = defaultLevel.reactionDelay;
        this.errorRange     = defaultLevel.errorRange;
        this.prediction     = defaultLevel.prediction;

        this._reactionCounter = 0;

        this.player.shotModifier = (ball) => {
            this.applyPersonalityShotModifier(ball);
        };
    }

    setPersonality(personality) {
        const p = (personality ?? 'basic').toString().toLowerCase();
        this.personality = p;

        const diff = (this.difficulty || 'NORMAL').toString().toUpperCase();

        // Difficulty-based tuning for skill usage frequency
        const skillConfig = GAME_CONFIG.AI_PERSONALITIES.BASIC;
        if (diff === 'EASY') {
            this.skillUseMinFrames = skillConfig.SKILL_USE_MIN_FRAMES.EASY;
            this.skillUseMaxFrames = skillConfig.SKILL_USE_MAX_FRAMES.EASY;
        } else if (diff === 'HARD') {
            this.skillUseMinFrames = skillConfig.SKILL_USE_MIN_FRAMES.HARD;
            this.skillUseMaxFrames = skillConfig.SKILL_USE_MAX_FRAMES.HARD;
        } else {
            // NORMAL
            this.skillUseMinFrames = skillConfig.SKILL_USE_MIN_FRAMES.NORMAL;
            this.skillUseMaxFrames = skillConfig.SKILL_USE_MAX_FRAMES.NORMAL;
        }

        // Reset attacker state when switching
        this._attackerYRepositionTimer = -1;
        this._attackerYTarget = null;

        // Difficulty-based tuning for "attacker" behavior
        if (p === 'attacker') {
            const config = GAME_CONFIG.AI_PERSONALITIES.ATTACKER[diff] || GAME_CONFIG.AI_PERSONALITIES.ATTACKER.DEFAULT;
            this.attackerChooseBaselineProb = config.CHOOSE_BASELINE_PROB;
            this.attackerBaselineWhenBallDeepProb = config.BASELINE_WHEN_BALL_DEEP_PROB;
            this.attackerDeepBallThreshold = config.DEEP_BALL_THRESHOLD;
            this.attackerPreferNetProb = config.PREFER_NET_PROB;
            this.attackerNormalNetProb = config.NORMAL_NET_PROB;
            this.attackerFrontCourtRatio = config.FRONT_COURT_RATIO;
            this.attackerHitSafeCourtRatio = config.HIT_SAFE_COURT_RATIO;
            this.attackerAngleVxMin = config.ANGLE_VX_MIN;
            this.attackerAngleVxMax = config.ANGLE_VX_MAX;
            this.attackerAngleApplyProb = config.ANGLE_APPLY_PROB;
            this.attackerAngleAimAwayProb = config.ANGLE_AIM_AWAY_PROB;
            this.attackerRepositionMin = config.REPOSITION_MIN;
            this.attackerRepositionMax = config.REPOSITION_MAX;
            this.attackerRetreatRepositionMin = config.RETREAT_REPOSITION_MIN;
            this.attackerRetreatRepositionMax = config.RETREAT_REPOSITION_MAX;
            this.attackerAfterHitRetreatProb = config.AFTER_HIT_RETREAT_PROB;
            this.attackerAfterHitMin = config.AFTER_HIT_MIN;
            this.attackerAfterHitMax = config.AFTER_HIT_MAX;
        }

        // Difficulty-based tuning for "wall" behavior
        if (p === 'wall') {
            const config = GAME_CONFIG.AI_PERSONALITIES.WALL[diff] || GAME_CONFIG.AI_PERSONALITIES.WALL.DEFAULT;
            this.wallTrackRatio = config.TRACK_RATIO;
            this.wallCenterJitter = config.CENTER_JITTER;
            this.wallReturnSpread = config.RETURN_SPREAD;
            this.wallReturnClampScale = config.RETURN_CLAMP_SCALE;
        }

        // Difficulty-based tuning for "wide" shot behavior
        if (p === 'wide') {
            const config = GAME_CONFIG.AI_PERSONALITIES.WIDE[diff] || GAME_CONFIG.AI_PERSONALITIES.WIDE.DEFAULT;
            this.wideAimAwayProb = config.AIM_AWAY_PROB;
            this.wideApplyProb = config.APPLY_PROB;
            this.wideSpreadMin = config.SPREAD_RATIO_MIN;
            this.wideSpreadMax = config.SPREAD_RATIO_MAX;
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
                    this.targetX = homeX;
                } else {
                    this.targetX = this.calculateServePosition();
                }
                this.targetY = null;
            } else if (ball.lastHitter === this.player) {
                // if AI just hit the ball over, retreat to center and wait
                this.targetX = layout.centerX;
                this.serveDelayTimer = -1;
                this.serveTargetX = -1;
            } else {
                let error = (
                    noise(frameCount * GAME_CONFIG.AI.NOISE_TIME_SCALE, this.noiseOffset) - 0.5
                    ) * 2 * this.errorRange;
                this.noiseOffset += this.fidgetSpeed;
                
                if (this.personality === 'wall') {
                    // Wall keeps a central base and only shades toward the incoming ball.
                    const predictedX = ball.x + (ball.vx * this.prediction);
                    const centerOffset = (
                        noise(frameCount * GAME_CONFIG.AI.WALL_NOISE_TIME_SCALE, this.noiseOffset) - 0.5
                        ) * 2 * this.wallCenterJitter;
                    this.targetX = layout.centerX + ((predictedX - layout.centerX) * this.wallTrackRatio) + centerOffset;
                } else {
                    this.targetX = ball.x + (ball.vx * this.prediction) + error;
                }
                this.serveDelayTimer = -1;
                this.serveTargetX = -1;
            }
        }
        
        this.updateTargetY(ball);
        this.updateAttackerY(ball);
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

        const preferNet = (
            Math.abs(ball.y - layout.netY) < 
            GAME_CONFIG.AI.BOUNCE_DISTANCE * GAME_CONFIG.AI.BOUNCE_POSITION_FACTOR
        );
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

        if (ball.bounceCount === 1 && this._prevBounceCount === 0 && !ball.isTossing) {
            if (ball.y > serveLineY && ball.y < layout.netY) {
                // Calculate dynamic bounce distance based on ball speed multiplier
                const speedFactor = ball.speedMultiplier !== undefined ? ball.speedMultiplier : 1.0;
                // If it's a slow ball, reduce distance (but keep a small minimum to avoid standing on the ball)
                const dynamicBounceDist = Math.max(
                    GAME_CONFIG.AI.RECEIVE_Y_THRESHOLD * GAME_CONFIG.AI.BOUNCE_DISTANCE_FACTOR, 
                    GAME_CONFIG.AI.BOUNCE_DISTANCE * speedFactor
                );

                if (this.personality === 'attacker' && !isServeReceive) {
                    // Move up toward service line / net more aggressively
                    const preferNet = (Math.abs(ball.y - layout.netY) < 
                                       dynamicBounceDist * GAME_CONFIG.AI.BOUNCE_POSITION_FACTOR);
                    this.targetY = preferNet 
                        ? this.getAttackerHitSafeY() 
                        : min(this.getServiceLineY(), this.getAttackerHitSafeY());

                    // Force attacker to get close enough if ball is critically short
                    if (this.targetY > ball.y - dynamicBounceDist + 
                        GAME_CONFIG.AI.RECEIVE_Y_THRESHOLD * GAME_CONFIG.AI.RECEIVE_Y_FACTOR) {
                        this.targetY = min(this.getAttackerHitSafeY(), ball.y - dynamicBounceDist);
                    }
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
        let isRoundEnding = (typeof ball !== 'undefined' && ball.roundEnding);
        let isServeReceive = (typeof ball !== 'undefined' && this.isServeReceivePhase(ball));

        let baseline = this.getBaselineY();
        let destX = (this.targetX !== null) ? this.targetX : layout.centerX;
        let destY = (this.targetY !== null) ? this.targetY : baseline;

        if (this.personality === 'attacker' && 
            !isServeReceive && 
            !isRoundEnding && 
            this.targetY == null && 
            (typeof ball !== 'undefined' && !ball.isWaiting && !ball.isTossing)) {
            destY = this._attackerYTarget ?? destY;
        }

        if (isRoundEnding) {
            // Rapidly halt progress when the point ends (ball goes out, scored, etc)
            this.vx *= 0.5;
            this.vy *= 0.5;
            this.player.x += this.vx;
            this.player.y += this.vy;
            return;
        }

        const isPolarIce = typeof selectedMap !== 'undefined' && selectedMap === 0 &&
                           typeof currentState !== 'undefined' && currentState === GAME_CONFIG.STATES.PLAYING;

        let friction = isPolarIce ? GAME_CONFIG.MAP_PHYSICS.POLAR_FRICTION : GAME_CONFIG.AI.MOVE_FRICTION;
        let baseAcc = isPolarIce
            ? GAME_CONFIG.MAP_PHYSICS.POLAR_OPPONENT_VELOCITY
            : this.player.speed * this.speedMult * GAME_CONFIG.AI.MOVE_ACC_FACTOR;
        let maxSpeed = this.player.speed * this.speedMult;

        // X movement
        let dx = destX - this.player.x;
        let xFriction = friction;
        if (isPolarIce) {
            const snap = GAME_CONFIG.AI.VELOCITY_SNAP_THRESHOLD;
            if (Math.abs(dx) < snap && Math.abs(this.vx) < snap) {
                this.vx = 0;
                this.player.x = destX;
            } else {
                let predictedX = this.player.x + this.vx * friction / (1 - friction);
                let coastingX = (dx > 0 && predictedX >= destX) || (dx < 0 && predictedX <= destX);
                if (!coastingX) {
                    this.vx += (dx > 0) ? baseAcc : -baseAcc;
                }
            }
        } else if (Math.abs(dx) >= GAME_CONFIG.AI.MOVE_DEADZONE) {
            this.vx += (dx > 0) ? baseAcc : -baseAcc;
        } else {
            xFriction *= GAME_CONFIG.AI.DEADZONE_BRAKE_MULT;
            if (Math.abs(this.vx) < GAME_CONFIG.AI.VELOCITY_SNAP_THRESHOLD) {
                this.vx = 0;
                this.player.x = destX;
            }
        }
        this.vx *= xFriction;
        this.vx = constrain(this.vx, -maxSpeed, maxSpeed);
        this.player.x += this.vx;

        // Y movement
        let dy = destY - this.player.y;
        let yFriction = friction;
        if (isPolarIce) {
            const snap = GAME_CONFIG.AI.VELOCITY_SNAP_THRESHOLD;
            if (Math.abs(dy) < snap && Math.abs(this.vy) < snap) {
                this.vy = 0;
                this.player.y = destY;
            } else {
                let predictedY = this.player.y + this.vy * friction / (1 - friction);
                let coastingY = (dy > 0 && predictedY >= destY) || (dy < 0 && predictedY <= destY);
                if (!coastingY) {
                    this.vy += (dy > 0) ? baseAcc : -baseAcc;
                }
            }
        } else if (Math.abs(dy) >= GAME_CONFIG.AI.MOVE_DEADZONE) {
            this.vy += (dy > 0) ? baseAcc : -baseAcc;
        } else {
            yFriction *= GAME_CONFIG.AI.DEADZONE_BRAKE_MULT;
            if (Math.abs(this.vy) < GAME_CONFIG.AI.VELOCITY_SNAP_THRESHOLD) {
                this.vy = 0;
                this.player.y = destY;
            }
        }
        this.vy *= yFriction;
        this.vy = constrain(this.vy, -maxSpeed, maxSpeed);
        this.player.y += this.vy;
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

        let isTutorial = (typeof currentState !== 'undefined' && currentState === GAME_CONFIG.STATES.TUTORIAL);
        if (!isTutorial) {
            if (this.player.skillCooldown === 0 && this._skillUseTimer === -1) {
                this._skillUseTimer = int(random(this.skillUseMinFrames, this.skillUseMaxFrames));
            }
            if (this._skillUseTimer > 0) {
                this._skillUseTimer--;
            } else if (this._skillUseTimer === 0 && !ball.isWaiting && !ball.isTossing) {
                // shadow teleport only fires when it's actually useful; other skills fire immediately
                const readyToUse = this.player.skillType !== 'SHADOW_TELEPORT' || this.shouldUseShadowTeleport(ball);
                if (readyToUse) {
                    this.player.useSkill(ball);
                    this._skillUseTimer = -1;
                }
            }
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

    // shadow teleport is only useful when ball is heading toward AI and AI is too far to reach it normally
    shouldUseShadowTeleport(ball) {
        if (ball.isWaiting || ball.isTossing) return false;
        if (ball.vy >= 0) return false; // ball moving away from AI, no need to teleport
        const distX = Math.abs(this.player.x - ball.x);
        return distX > GAME_CONFIG.AI.RECEIVE_X_THRESHOLD;
    }

    // Calculate the total distance multiplier considering air resistance
    flightSum() {
        const { HIT_Z, GRAVITY, AIR_RESISTANCE } = GAME_CONFIG.BALL;
        const { AIRTIME_CALC_MIN_FRAMES, GRAVITY_MIN, AIR_RESISTANCE_MIN } = GAME_CONFIG.BALL_HIT_BEHAVIOR;
        const t = max(AIRTIME_CALC_MIN_FRAMES, floor((2 * HIT_Z) / max(GRAVITY_MIN, GRAVITY)));
        return (1 - pow(AIR_RESISTANCE, t)) / max(AIR_RESISTANCE_MIN, (1 - AIR_RESISTANCE));
    }

    // calculate the vx needed to reach targetX, clamped so the ball lands inside court bounds
    clampVxToTarget(ball, targetX, sum, safetyMargin, clampScale) {
        const desiredVx = (targetX - ball.x) / sum;
        const minX = layout.courtLeft + ball.r + safetyMargin;
        const maxX = layout.courtRight - ball.r - safetyMargin;
        const maxVxPos = (maxX - ball.x) / sum;
        const maxVxNeg = (ball.x - minX) / sum;
        const maxAbsForSign = (desiredVx >= 0) ? maxVxPos : maxVxNeg;
        const safeAbs = max(0, maxAbsForSign * clampScale);
        return constrain(desiredVx, -safeAbs, safeAbs);
    }

    applyPersonalityShotModifier(ball) {
        if (ball.isTossing) return;
        if (typeof isMultiplayer !== 'undefined' && isMultiplayer) return;

        // Single mode AI personality: "wall" returns deep through the center.
        if (this.personality === 'wall') {
            const sum = this.flightSum();
            const spread = this.wallReturnSpread ?? GAME_CONFIG.BALL_HIT_BEHAVIOR.WALL_RETURN_SPREAD_DEFAULT;
            const targetX = layout.centerX + random(-spread, spread);
            const clampScale = this.wallReturnClampScale ?? GAME_CONFIG.BALL_HIT_BEHAVIOR.WALL_RETURN_CLAMP_DEFAULT;
            ball.vx = this.clampVxToTarget(
                ball, targetX, sum, GAME_CONFIG.BALL_HIT_BEHAVIOR.WALL_SAFETY_MARGIN, clampScale);
        }

        // Single mode AI personality: "attacker" adds only a mild angle bias.
        if (this.personality === 'attacker') {
            const attackerDefaults = GAME_CONFIG.AI_PERSONALITIES.ATTACKER.DEFAULT;
            const minVx = this.attackerAngleVxMin ?? attackerDefaults.ANGLE_VX_MIN;
            const maxVx = this.attackerAngleVxMax ?? attackerDefaults.ANGLE_VX_MAX;
            const applyProb = this.attackerAngleApplyProb ?? attackerDefaults.ANGLE_APPLY_PROB;
            const aimAwayProb = this.attackerAngleAimAwayProb ?? attackerDefaults.ANGLE_AIM_AWAY_PROB;

            if (random(1) < applyProb) {
                // aim away from opponent more often; fall back to continuing current direction
                let sign;
                if (random(1) < aimAwayProb && typeof player !== 'undefined') {
                    sign = (player.x < ball.x) ? 1 : -1;
                } else {
                    sign = (ball.vx < 0) ? -1 : 1;
                    if (Math.abs(ball.vx) < GAME_CONFIG.BALL_HIT_BEHAVIOR.MIN_VX_FOR_SIGN) {
                        sign = (random(1) < 0.5) ? -1 : 1;
                    }
                }
                const sum = this.flightSum();
                const safetyMargin = GAME_CONFIG.BALL_HIT_BEHAVIOR.ATTACKER_SAFETY_MARGIN;
                const minX = layout.courtLeft + ball.r + safetyMargin;
                const maxX = layout.courtRight - ball.r - safetyMargin;
                const maxAbsForSign = (sign > 0) ? (maxX - ball.x) / sum : (ball.x - minX) / sum;
                const mag = random(minVx, maxVx);
                const cappedMag = constrain(
                    mag, 
                    0, 
                    max(0, maxAbsForSign * GAME_CONFIG.BALL_HIT_BEHAVIOR.ATTACKER_MAX_ABS_SCALE)
                );
                ball.vx = sign * max(Math.abs(ball.vx), cappedMag);
            }
        }

        // Polar ice: AI position may be offset from target due to sliding, cap vx so ball stays in court
        if (typeof selectedMap !== 'undefined' && selectedMap === 0) {
            const sum = this.flightSum();
            const margin = GAME_CONFIG.BALL_HIT_BEHAVIOR.WALL_SAFETY_MARGIN;
            const minX = layout.courtLeft + ball.r + margin;
            const maxX = layout.courtRight - ball.r - margin;
            ball.vx = constrain(ball.vx, (minX - ball.x) / sum, (maxX - ball.x) / sum);
        }

        // Single mode AI personality: "wide" forces big left/right split shots.
        if (this.personality === 'wide') {
            const wideDefaults = GAME_CONFIG.AI_PERSONALITIES.WIDE.DEFAULT;
            const aimAwayProb = this.wideAimAwayProb ?? wideDefaults.AIM_AWAY_PROB;
            const applyProb = this.wideApplyProb ?? wideDefaults.APPLY_PROB;
            const spreadMin = this.wideSpreadMin ?? wideDefaults.SPREAD_RATIO_MIN;
            const spreadMax = this.wideSpreadMax ?? wideDefaults.SPREAD_RATIO_MAX;

            if (random(1) < applyProb) {
                // aim for the opposite side of the court to generate cross-court angles
                let sideX;
                if (random(1) < aimAwayProb && typeof player !== 'undefined') {
                    sideX = (ball.x > layout.centerX) ? layout.courtLeft : layout.courtRight;
                } else {
                    sideX = (random(1) < 0.5) ? layout.courtLeft : layout.courtRight;
                }

                const targetX = lerp(layout.centerX, sideX, random(spreadMin, spreadMax));
                const sum = this.flightSum();
                ball.vx = this.clampVxToTarget(
                    ball, 
                    targetX, 
                    sum, 
                    GAME_CONFIG.BALL_HIT_BEHAVIOR.WIDE_SAFETY_MARGIN, 
                    GAME_CONFIG.BALL_HIT_BEHAVIOR.WIDE_LIMIT_SCALE
                );
            }
        }
    }
}