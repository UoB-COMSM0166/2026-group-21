class Ball {
    constructor() {
        this.r = GAME_CONFIG.BALL.RADIUS;
        this.gravity = GAME_CONFIG.BALL.GRAVITY;
        this.bounceCount = 0;
        this.lastHitter = null;
        this.justServed = false; // true only between serve-hit and receiver's first return
        this.reset(0, 0, 'PLAYER');
        this.speedMultiplier = 1.0;
        this.speedTimer = 0;
        this.sizeTimer = 0;
        this.isGigaShot = false;
    }
    //resets the ball to its starting state for a new serve
    reset(startX, startY, side) {
        if (this.roundTimer) {
            clearTimeout(this.roundTimer);
            this.roundTimer = null;
        }
        if (this.scoreTimer) {
            clearTimeout(this.scoreTimer);
            this.scoreTimer = null;
        }
        if (typeof Scene_Game !== 'undefined' && Scene_Game.isShowingScore) {
            Scene_Game.isShowingScore = false;
        }
        this.roundEnding = false;
        this.r = GAME_CONFIG.BALL.RADIUS;
        this.x = startX;
        this.y = startY;
        this.z = 0;
        this.vx = 0; //velocity x
        this.vy = 0;
        this.vz = 0;
        this.bounceCount = 0;
        this.isWaiting = true; // holding the ball before tossing
        this.isTossing = false; // ball is in the air but not yet hit
        this.serveSide = side; // track who is serving
        this.isGigaShot = false;
        this.justServed = false;
    }

    update() {
        if (this.speedTimer > 0) {
            this.speedTimer--;
            if (this.speedTimer === 0) {
                this.speedMultiplier = 1.0;
            }
        }
        if (this.sizeTimer > 0) {
            this.sizeTimer--;
            if (this.sizeTimer === 0) {
                this.r = GAME_CONFIG.BALL.RADIUS;
            }
        }

        if (this.handleServeState()) return;
        this.applyPhysics();
        this.checkGroundCollision();
        this.checkSafetyBounds();
    }

    display() {
        push();
        const { COLORS, VISUALS } = GAME_CONFIG;
        let visualZ = max(0, this.z);
        // draw shadow
        fill(COLORS.SHADOW);
        noStroke();
        const baseSize = this.r * VISUALS.SHADOW_SIZE_BASE;
        const zShrink = visualZ * VISUALS.SHADOW_Z_FACTOR;
        let shadowSize = max(baseSize - zShrink, VISUALS.SHADOW_MIN_SIZE);
        ellipse(this.x, this.y, shadowSize, shadowSize * VISUALS.SHADOW_ELLIPSE_H);
        // draw ball
        fill(COLORS.YELLOW);
        stroke(0);
        strokeWeight(VISUALS.BASE_STROKE_WEIGHT || 2);
        ellipse(this.x, this.y - visualZ - this.r, this.r * 2);
        pop();
    }
    // initialzie the serve toss
    toss() {
        if (this.isWaiting) {
            this.isWaiting = false;
            this.isTossing = true;
            this.vz = GAME_CONFIG.BALL.TOSS_Z;
        }
    }
    // locks the ball position to the serve during serve preparation
    handleServeState() {
        if (this.isWaiting || this.isTossing) {
            let server = (scoreManager.currentServer === 'PLAYER') ? player : opponent;
            this.x = server.x;
            this.y = server.y;

            if (this.isWaiting) {
                this.z = 0;
                return true;
            }
        }
        return false;
    }
    //calculates position, air resistance and gravity
    applyPhysics() {
        this.x += this.vx * this.speedMultiplier;
        this.y += this.vy * this.speedMultiplier;
        this.z += this.vz;
        this.vx *= GAME_CONFIG.BALL.AIR_RESISTANCE;
        this.vy *= GAME_CONFIG.BALL.AIR_RESISTANCE;
        if (this.z > 0 || this.vz > 0) {
            this.vz -= this.gravity;
        }
    }
    // floor collision, bounce logic, and score rules
    checkGroundCollision() {
        if (this.z < 0) {
            this.z = 0;
            // fail if ball is tossed but never hit
            if (this.isTossing) {
                const winner = (this.serveSide === 'PLAYER') ? 'OPPONENT' : 'PLAYER';
                this.terminateRound(winner);
                return;
            }
            this.bounceCount++;
            // is the ball in the court lines?
            const inX = this.x >= layout.courtLeft && this.x <= layout.courtRight;
            const inY = this.y >= layout.courtTop && this.y <= layout.courtBottom;
            const isInside = inX && inY;
            if (this.bounceCount === 1) {
                this.handleFirstBounce(isInside);
            } else if (this.bounceCount === 2) {
                const winner = this.lastHitter.isBottom ? 'PLAYER' : 'OPPONENT';
                this.terminateRound(winner);
            }
        }
    }
    //check the first bounce, out or wrong side?
    handleFirstBounce(isInside) {
        //ball must land in the oppoent's half relative to the hitter
        const hitterIsBottom = this.lastHitter.isBottom;
        const isCorrectSide = hitterIsBottom ? (this.y < layout.netY) : (this.y > layout.netY);

        if (!isInside || !isCorrectSide) {
            const winner = hitterIsBottom ? 'OPPONENT' : 'PLAYER';
            this.terminateRound(winner);
        } else {
            // reduce velocity and bounce upward
            this.vz = GAME_CONFIG.BALL.BOUNCE_Z;
            this.vx *= GAME_CONFIG.BALL.BOUNCE_FRICTION;
            this.vy *= GAME_CONFIG.BALL.BOUNCE_FRICTION;
        }
    }
    //ends the round with slight delay
    terminateRound(winner) {
        this.vz = 0; this.vx = 0; this.vy = 0;
        if (currentState === GAME_CONFIG.STATES.TUTORIAL) {
            if (scoreManager && !this.roundEnding) {
                this.roundEnding = true;
                scoreManager.recordPoint(winner); 
            }
            return; 
        }
        if (!this.roundEnding) {
            this.roundEnding = true;

            if (currentState === GAME_CONFIG.STATES.PLAYING) {
                this.roundTimer = setTimeout(() => {
                    let gameWon = false;
                    if (scoreManager) {
                        gameWon = scoreManager.recordPoint(winner);
                        scoreManager.prepareNextPoint();
                    }
                    
                    if (gameWon && !scoreManager.isMatchOver) {
                        Scene_Game.isShowingScore = true;
                        
                        this.scoreTimer = setTimeout(() => {
                            Scene_Game.nextRound();
                            this.roundEnding = false;
                            Scene_Game.isShowingScore = false;
                        }, 3000);
                        
                    } else {
                        Scene_Game.nextRound();
                        this.roundEnding = false;
                    }
                }, GAME_CONFIG.MATCH.ROUND_END_DELAY);
            }
        }
    }
    // safe mechanism to reset game if ball is outside the playable area
    checkSafetyBounds() {
        const limit = GAME_CONFIG.MATCH.SAFETY_LIMIT;
        const isOut = (this.y < -limit || this.y > layout.VIRTUAL_H + limit ||
            this.x < -limit || this.x > layout.VIRTUAL_W + limit);
        if (isOut && !this.roundEnding) {
            const hitter = this.lastHitter;
            const winner = hitter
                ? (hitter.isBottom ? 'OPPONENT' : 'PLAYER')
                : (this.serveSide === 'PLAYER' ? 'OPPONENT' : 'PLAYER');
            this.terminateRound(winner);
        }
    }
    // collision detection with player's racket during swing
    checkHit(p) {
        const { HIT_MIN_Z, HIT_MAX_Z, HIT_Z, HIT_Y, DIRECTION_MULT } = GAME_CONFIG.BALL;
        const { SERVE_MIN_VX, SERVE_MAX_VX } = GAME_CONFIG.BALL;
        // only hit if player is swing and ball is at hittable height
        const isHittable = p.swingTimer > 0 && !p.hasHit && this.z > HIT_MIN_Z && this.z < HIT_MAX_Z;
        if (!isHittable) return;
        // basic box-to-box collision detection
        const hitX = abs(this.x - p.x) < this.r + p.w / 2;
        const hitY = abs(this.y - p.y) < this.r + p.h / 2;
        if (hitX && hitY) {
            if (this.isGigaShot) { 
                p.stunTimer = 45;
            }
            this.r = GAME_CONFIG.BALL.RADIUS;
            this.isGigaShot = false;
            this.vz = HIT_Z;
            this.vy = p.isBottom ? -HIT_Y : HIT_Y;
            //Change the ball's angle based on where it hits the player
            this.vx = (this.x - p.x) * DIRECTION_MULT;
            // forces the ball to fly diagonally to the opposite side during a serve
            if (this.isTossing) {
                this.justServed = true;
                if (scoreManager.currentSide === 'RIGHT') {
                    this.vx = constrain(this.vx, -SERVE_MAX_VX, -SERVE_MIN_VX);
                } else {
                    this.vx = constrain(this.vx, SERVE_MIN_VX, SERVE_MAX_VX);
                }
            }

            // Single mode AI personality: "wide" forces big left/right split shots.
            // Guarded so it never affects humans or multiplayer.
            if (!this.isTossing &&
                typeof isMultiplayer !== 'undefined' && !isMultiplayer &&
                p && p.isAI &&
                typeof opponent !== 'undefined' && p === opponent &&
                typeof opponentAI !== 'undefined' && opponentAI &&
                opponentAI.personality === 'wide') {
                
                const minVx = opponentAI.wideVxMin ?? 4;
                const maxVx = opponentAI.wideVxMax ?? 10;
                const extremeProb = opponentAI.wideExtremeProb ?? 0.7;
                const aimAwayProb = opponentAI.wideAimAwayProb ?? 0.7;
                const applyProb = opponentAI.wideApplyProb ?? 0.65;

                // Not every shot needs wide-angle intent.
                if (random(1) >= applyProb) {
                    // Keep default vx from standard hit logic.
                } else {

                    // Choose direction: often aim away from player's x (make player run).
                    let sign;
                    if (random(1) < aimAwayProb && typeof player !== 'undefined') {
                        sign = (player.x < this.x) ? 1 : -1;
                    } else {
                        sign = (random(1) < 0.5) ? -1 : 1;
                    }

                    // Choose magnitude: bias toward extremes.
                    let mag;
                    if (random(1) < extremeProb) {
                        mag = random(max(minVx, maxVx * 0.8), maxVx);
                    } else {
                        mag = random(minVx, maxVx);
                    }

                    // Keep the 1st bounce roughly in-court by capping vx based on a simple prediction.
                    // (Uses airtime from HIT_Z and air resistance sum.)
                    const g = GAME_CONFIG.BALL.GRAVITY;
                    const air = GAME_CONFIG.BALL.AIR_RESISTANCE;
                    const t = max(8, floor((2 * HIT_Z) / max(0.01, g))); // frames until z returns ~0
                    const sum = (1 - pow(air, t)) / max(0.0001, (1 - air)); // \sum air^i

                    // Add an inward margin so "wide" still spreads but doesn't hug the lines too much.
                    const safetyMargin = 20;
                    const minX = layout.courtLeft + this.r + safetyMargin;
                    const maxX = layout.courtRight - this.r - safetyMargin;

                    const maxVxPos = (maxX - this.x) / sum;
                    const maxVxNeg = (this.x - minX) / sum;
                    const maxAbsForSign = (sign > 0) ? maxVxPos : maxVxNeg;

                    // Keep some risk (not 100% in), but reduce frequent outs by not using the full limit.
                    const limitScale = 0.85;
                    const cappedMag = constrain(mag, 0, max(0, maxAbsForSign * limitScale));
                    this.vx = sign * cappedMag;
                }
            }
            //hit sound
            if (typeof soundManager !== 'undefined') {
                soundManager.play('hit'); 
            }

            this.recordHit(p);
            p.hasHit = true;
            SkillManager.triggerHitSkill(p, this);
            p.feedbackText = "PERFECT";
            p.feedbackTimer = GAME_CONFIG.FEEDBACK.DISPLAY_DURATION;
        }
    }
    //transition ball state from serve or idle to active play
    recordHit(p) {
        this.bounceCount = 0;
        this.lastHitter = p;
        this.isTossing = false;
        this.roundEnding = false;

        // After the receiver returns the serve once, we're no longer in "serve return" phase.
        if (this.justServed && typeof scoreManager !== 'undefined' && scoreManager) {
            const server = (scoreManager.currentServer === 'PLAYER') ? player : opponent;
            if (p !== server) {
                this.justServed = false;
            }
        }
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
    }
}