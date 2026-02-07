class Player {
    constructor(x, img, isBottom) {
        this.x = x;
        this.img = img;
        this.w = 64;
        this.h = 64;
        this.speed = 5;
        this.isBottom = isBottom;
        this.score = 0;
        this.swingTimer = 0;
        // setup player's y position
        let margin = 50;
        if (this.isBottom) {
            this.y = COURT_BOTTOM - margin - (this.h / 2);
        } else {
            this.y = COURT_TOP + margin - (this.h / 2);
        }
    }

    swing() {
        this.swingTimer = 10;
    }

    update(courtLeft, courtRight) {
        // bottom player uses left and right arrow keys
        if (this.isBottom) {
            if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
            if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
        } else {
            // top player uses A and D keys
            if (keyIsDown(65)) this.x -= this.speed; // 'A'
            if (keyIsDown(68)) this.x += this.speed; // 'D'
        }
        if (this.swingTimer > 0) {
            this.swingTimer--;
        }
        let extraPadding = 10;
        // ensure player won't go outside of stadium
        this.x = constrain(
            this.x,
            courtLeft + this.w / 2 + extraPadding,
            courtRight - this.w / 2 - extraPadding);
    }

    display() {
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        if (this.swingTimer > 0) {
            tint(255, 200, 200);
            scale(1.1);
        }
        if (this.img) {
            image(this.img, 0, 0, this.w, this.h);
        } else {
            fill(this.isBottom ? 100 : 200);
            rect(0, 0, this.w, this.h);
        }
        pop();
    }
}