class Player {
    constructor(x, img, isBottom) {
        this.x = x;
        this.img = img;
        this.w = 64;
        this.h = 64;
        this.speed = 5;
        this.isBottom = isBottom; //true for bottom player, false for opponent
        this.score = 0;
        this.swingTimer = 0; //duration of the hit active window
        this.resetPosition(x); //initialize position to the starting baseline
    }

    update() {
        this.handleInput();
        this.updateTimers();
        this.applyConstraints();
    }

    display() {
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        // visual feedback when swinging
        if (this.swingTimer > 0) {
            tint(255, 200, 200);
            scale(1.1);
        }
        if (this.img) {
            image(this.img, 0, 0, this.w, this.h);
        } else {
            //fallback if image fails to load
            fill(this.isBottom ? 100 : 200);
            rect(0, 0, this.w, this.h);
        }
        pop();
    }

    //enable the hit detection for a short period
    swing() { this.swingTimer = 10; }

    // reset player's position
    resetPosition(newX) {
        this.x = newX;
        let serveBackDistance = 5;
        if (this.isBottom) {
            this.y = COURT_BOTTOM + serveBackDistance - this.h / 2;
        } else {
            this.y = COURT_TOP - serveBackDistance - this.h / 2;
        }
    }

    handleInput() {
        // handle keyboard inputs based on player role
        if (this.isBottom) {
            if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
            if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
            if (keyIsDown(UP_ARROW)) this.y -= this.speed;
            if (keyIsDown(DOWN_ARROW)) this.y += this.speed;
        } else {
            if (keyIsDown(65)) this.x -= this.speed; // 'A'
            if (keyIsDown(68)) this.x += this.speed; // 'D'
            if (keyIsDown(87)) this.y -= this.speed; // 'W'
            if (keyIsDown(83)) this.y += this.speed; // 'S'
        }
    }
    // decrement hit window timer
    updateTimers() {
        if (this.swingTimer > 0) { this.swingTimer--; }
    }
    //constraint player's position based on current state
    applyConstraints() {
        let minX = max(this.w / 2, COURT_LEFT - MOVE_PADDING_X);
        let maxX = min(width - this.w / 2, COURT_RIGHT + MOVE_PADDING_X);
        let minY, maxY;
        const isServingNow = 
            (ball.isWaiting || ball.isTossing) &&
            ((this.isBottom && currentServer === 'PLAYER') ||
            (!this.isBottom && currentServer === 'OPPONENT'));
        //serve mode boundaries
        if (isServingNow) {
            if (currentSide === 'RIGHT') {
                minX = CENTER_X + this.w / 2;
            } else {
                maxX = CENTER_X - this.w / 2;
            }
            if (this.isBottom) {
                minY = COURT_BOTTOM - this.h / 2;
                maxY = min(height - this.h / 2, minY + 50);
            } else {
                maxY = COURT_TOP - this.h / 2;
                minY = max(this.h / 2, maxY - 50);
            }
        //standard mode boundaries
        } else {
            if (this.isBottom) {
                minY = NET_Y + 10 + this.h / 2;
                maxY = min(height - this.h / 2, COURT_BOTTOM + MOVE_PADDING_Y);
            } else {
                minY = max(this.h / 2, COURT_TOP - MOVE_PADDING_Y);
                maxY = NET_Y - 10 - this.h / 2;
            }
        }
        //update position based on calculation
        this.x = constrain(this.x, minX, maxX);
        this.y = constrain(this.y, minY, maxY);
    }
}