class Ball {
    constructor() {
        this.r = GAME_CONFIG.BALL.RADIUS;
        this.gravity = GAME_CONFIG.BALL.GRAVITY;
        this.bounceCount = 0;
        this.lastHitter = null;
        this.reset(0, 0, 'PLAYER');
    }
    //resets the ball to its starting state for a new serve
    reset(startX, startY, side) {
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
    }

    update() {
        if (this.handleServeState()) return;
        this.applyPhysics();
        this.checkGroundCollision();
        this.checkSafetyBounds();
    }

    display() {
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
        fill(COLORS.BALL);
        stroke(0);
        ellipse(this.x, this.y - visualZ - this.r, this.r * 2);
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
            let server = (this.serveSide === 'PLAYER') ? player : opponent;
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
        this.x += this.vx;
        this.y += this.vy;
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
                this.terminateRound();
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
                this.terminateRound();
            }
        }
    }
    //check the first bounce, out or wrong side?
    handleFirstBounce(isInside) {
        //ball must land in the oppoent's half relative to the hitter
        const hitterIsBottom = this.lastHitter.isBottom;
        const isCorrectSide = hitterIsBottom ? (this.y < layout.netY) : (this.y > layout.netY);

        if (!isInside || !isCorrectSide) {
            this.terminateRound();
        } else {
            // reduce velocity and bounce upward
            this.vz = GAME_CONFIG.BALL.BOUNCE_Z;
            this.vx *= GAME_CONFIG.BALL.BOUNCE_FRICTION;
            this.vy *= GAME_CONFIG.BALL.BOUNCE_FRICTION;
        }
    }
    //ends the round with slight delay
    terminateRound() {
        this.vz = 0; this.vx = 0; this.vy = 0;
        if (!this.roundEnding) {
            this.roundEnding = true;
            setTimeout(() => {
                this.roundEnding = false;
                nextRound();
            }, GAME_CONFIG.MATCH.ROUND_END_DELAY);
        }
    }
    // safe mechanism to reset game if ball is outside the playable area
    checkSafetyBounds() {
        const limit = GAME_CONFIG.MATCH.SAFETY_LIMIT;
        if (this.y < -limit || this.y > height + limit ||
            this.x < -limit || this.x > width + limit) {
            nextRound();
        }
    }
    // collision detection with player's racket during swing
    checkHit(p) {
        const { HIT_MIN_Z, HIT_MAX_Z, HIT_Z, HIT_Y, DIRECTION_MULT } = GAME_CONFIG.BALL;
        const { SERVE_MIN_VX, SERVE_MAX_VX } = GAME_CONFIG.BALL;
        // only hit if player is swing and ball is at hittable height
        const isHittable = p.swingTimer > 0 && this.z > HIT_MIN_Z && this.z < HIT_MAX_Z;
        if (!isHittable) return;
        // basic box-to-box collision detection
        const hitX = this.x > p.x - p.w / 2 && this.x < p.x + p.w / 2;
        const hitY = abs(this.y - p.y) < this.r + p.h / 2;
        if (hitX && hitY) {
            this.vz = HIT_Z;
            this.vy = p.isBottom ? -HIT_Y : HIT_Y;
            //Change the ball's angle based on where it hits the player
            this.vx = (this.x - p.x) * DIRECTION_MULT;
            // forces the ball to fly diagonally to the opposite side during a serve
            if (this.isTossing) {
                if (currentSide === 'RIGHT') {
                    this.vx = constrain(this.vx, -SERVE_MAX_VX, -SERVE_MIN_VX);
                } else {
                    this.vx = constrain(this.vx, SERVE_MIN_VX, SERVE_MAX_VX);
                }
            }
            this.recordHit(p);
            p.swingTimer = 0;
        }
    }
    //transition ball state from serve or idle to active play
    recordHit(p) {
        this.bounceCount = 0;
        this.lastHitter = p;
        this.isTossing = false;
        this.roundEnding = false;
    }
    //normalizes position to a 0-1 scale to maintain alignment during resizing
    getRelativePos(layout) {
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