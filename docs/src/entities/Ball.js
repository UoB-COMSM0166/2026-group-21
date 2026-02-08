class Ball {
    constructor() {
        this.r = 10;
        this.gravity = 0.4;
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
        let visualZ = max(0, this.z);
        // draw shadow
        fill(0, 0, 0, 100);
        noStroke();
        let shadowSize = max(this.r * 2 - visualZ * 0.2, 5);
        ellipse(this.x, this.y, shadowSize, shadowSize * 0.5);
        // draw ball
        fill(255, 255, 0);
        stroke(0);
        ellipse(this.x, this.y - visualZ - this.r, this.r * 2);
    }
    // initialzie the serve toss
    toss() {
        if (this.isWaiting) {
            this.isWaiting = false;
            this.isTossing = true;
            this.vz = 8;
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
        this.vx *= 0.99;
        this.vy *= 0.99;
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
                nextRound();
                return;
            }
            this.bounceCount++;
            // is the ball in the court lines?
            let isInside = (this.x >= COURT_LEFT && this.x <= COURT_RIGHT &&
                this.y >= COURT_TOP && this.y <= COURT_BOTTOM);
            if (this.bounceCount === 1) {
                this.handleFirstBounce(isInside);
            } else if (this.bounceCount === 2) {
                this.handleSecondBounce();
            }
        }
    }
    //check the first bounce, out or wrong side?
    handleFirstBounce(isInside) {
        //ball must land in the oppoent's half relative to the hitter
        let isCorrectSide = (this.lastHitter.isBottom) ? (this.y < NET_Y) : (this.y > NET_Y);

        if (!isInside || !isCorrectSide) {
            nextRound();
        } else {
            // reduce velocity and bounce upward
            this.vz = 6;
            this.vx *= 0.8;
            this.vy *= 0.8;
        }
    }
    //ends the round after the second bounce with slight delay
    handleSecondBounce() {
        this.vz = 0; this.vx = 0; this.vy = 0;
        if (!this.roundEnding) {
            this.roundEnding = true;
            setTimeout(() => {
                this.roundEnding = false;
                nextRound();
            }, 500);
        }
    }
    // safe mechanism to reset game if ball is outside the playable area
    checkSafetyBounds() {
        if (this.y < -500 || this.y > height + 500 || 
            this.x < -1000 || this.x > width + 1000) {
            nextRound();
        }
    }
    // collision detection with player's racket during swing
    checkHit(p) {
        // only hit if player is swing and ball is at hittable height
        if (p.swingTimer > 0 && this.z > 5 && this.z < 50) {
            // basic box-to-box collision detection
            if (this.x > p.x - p.w / 2 && this.x < p.x + p.w / 2) {
                if (abs(this.y - p.y) < this.r + p.h / 2) {
                    this.vz = 7;
                    this.vy = p.isBottom ? -13 : 13;
                    //Change the ball's angle based on where it hits the player
                    let diff = this.x - p.x;
                    this.vx = diff * 0.2;
                    // forces the ball to fly diagonally to the opposite side during a serve
                    if (this.isTossing) {
                        if (currentSide === 'RIGHT') {
                            this.vx = constrain(this.vx, -12, -6);
                        } else {
                            this.vx = constrain(this.vx, 6, 12);
                        }
                    }
                    this.recordHit(p);
                    p.swingTimer = 0;
                }
            }
        }
    }
    //transition ball state from serve or idle to active play
    recordHit(p) {
        this.bounceCount = 0;
        this.lastHitter = p;
        this.isTossing = false;
        this.roundEnding = false;
    }
}