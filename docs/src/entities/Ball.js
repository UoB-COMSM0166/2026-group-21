class Ball {
    constructor() {
        this.r = 10;
        this.gravity = 0.4;
        this.reset(0, 0, 'PLAYER');
    }

    reset(startX, startY, side) {
        this.x = startX;
        this.y = startY;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;

        this.serveTimer = millis();
        this.isWaiting = true;
        this.isDropping = false;
        this.serveSide = side;
    }


    update(courtBottom) {
        if (this.isWaiting) {
            if (millis() - this.serveTimer > 2000) {
                this.isWaiting = false;
                this.isDropping = true;
                this.vy = 4;
            }
            return;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        if (this.z > 0 || this.vz > 0) {
            this.vz -= this.gravity;
        }

        if (this.z < 0) {
            this.z = 0;
            this.vz *= -0.6;
            this.vx *= 0.98;
            this.vy *= 0.98;
        }

        if (!this.isWaiting) {
            let outOfBounds = false;
            if (this.isDropping) {
                let serverY = (this.serveSide === 'PLAYER') ? player.y : opponent.y;
                if (this.y >= serverY + 20) outOfBounds = true;
            } else {
                if (this.y < -200 || this.y > height + 100 || this.x < 100 || this.x > 1100) {
                    outOfBounds = true;
                }
            }
            if (outOfBounds) nextRound();
        }
    }

    checkHit(p) {
        if (p.swingTimer > 0) {
            if (this.isDropping || (!this.isWaiting && this.vy !== 0)) {
                if (this.x > p.x - p.w / 2 && this.x < p.x + p.w / 2) {
                    if (abs(this.y - p.y) < this.r + p.h / 2) {

                        this.isDropping = false;

                        this.vz = 6;
                        this.vy = p.isBottom ? -10 : 10;

                        let diff = this.x - p.x;
                        this.vx = diff * 0.2;
                        this.z = 5;

                        p.swingTimer = 0;
                    }
                }
            }
        }
    }

    display() {
        fill(0, 0, 0, 100);
        noStroke();

        let shadowSize = max(this.r * 2 - this.z * 0.2, 5);
        ellipse(this.x, this.y, shadowSize, shadowSize * 0.5);

        fill(255, 255, 0);
        stroke(0);
        ellipse(this.x, this.y - this.z, this.r * 2);
    }
}