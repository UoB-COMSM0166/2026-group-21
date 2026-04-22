class Ball {
    constructor() {
        this.r = GAME_CONFIG.BALL.RADIUS;
        this.gravity = GAME_CONFIG.BALL.GRAVITY;
        this.reset(0, 0, 'PLAYER');
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
        this.lastHitter = null;
        this.isWaiting = true; // holding the ball before tossing
        this.isTossing = false; // ball is in the air but not yet hit
        this.serveSide = side; // track who is serving
        this.isGigaShot = false;
        this.justServed = false;
        this.speedMultiplier = 1.0;
        this.speedTimer = 0;
        this.sizeTimer = 0;
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
        // only apply gravity while the ball is in the air or still rising (vz > 0 catches the peak frame)
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
        if (!this.lastHitter) return;
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

    // ends the round with a slight delay granting time for audio and visual cues to play before resetting
    terminateRound(winner) {
        this.vz = 0; this.vx = 0; this.vy = 0;
        if (currentState === GAME_CONFIG.STATES.TUTORIAL) {
            // instantly record the score and stop further logic during the tutorial mode
            if (scoreManager && !this.roundEnding) {
                this.roundEnding = true;
                scoreManager.recordPoint(winner); 
            }
            return; 
        }

        if (!this.roundEnding) {
            this.roundEnding = true;

            if (currentState === GAME_CONFIG.STATES.PLAYING) {
                // wait for a bit allowing the player can see where the ball landed
                this.roundTimer = setTimeout(() => {
                    let gameWon = false;
                    if (scoreManager) {
                        gameWon = scoreManager.recordPoint(winner);
                        scoreManager.prepareNextPoint();
                    }
                    // decide next scene
                    if (gameWon && !scoreManager.isMatchOver) {
                        Scene_Game.isShowingScore = true;
                        this.scoreTimer = setTimeout(() => {
                            Scene_Game.nextRound();
                            this.roundEnding = false;
                            Scene_Game.isShowingScore = false;
                        }, GAME_CONFIG.BALL_HIT_BEHAVIOR.SCORE_DISPLAY_DURATION);
                        
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
        const hitY = abs(this.y - p.y) < this.r + p.h / 2 + GAME_CONFIG.BALL_HIT_BEHAVIOR.HIT_Y_TOLERANCE;
        if (hitX && hitY) {
            if (this.isGigaShot) { 
                p.stunTimer = GAME_CONFIG.BALL_HIT_BEHAVIOR.GIGA_SHOT_STUN;
            }
            this.r = GAME_CONFIG.BALL.RADIUS;
            this.isGigaShot = false;
            this.vz = HIT_Z;
            this.vy = p.isBottom ? -HIT_Y : HIT_Y;
            // change the ball's angle based on where it hits the player
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

            // apply custom shot modifier from the hitter (for AI personality adjustments)
            if (p.shotModifier) {
                p.shotModifier(this);
            }

            // hit sound
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

    // transition ball state from serve or idle to active play
    recordHit(p) {
        this.bounceCount = 0;
        this.lastHitter = p;
        this.isTossing = false;
        this.roundEnding = false;

        // after the receiver returns the serve once, no longer in "serve return" phase.
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

    // re-maps normalized coordinates back to absolute pixels after resizing
    reposition(rel, layout) {
        this.x = layout.courtLeft + rel.x * layout.COURT_W;
        this.y = layout.courtTop + rel.y * layout.COURT_H;
    }
}if (typeof module !== 'undefined' && module.exports) { module.exports = Ball; }
