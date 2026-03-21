const MapManager = {
    windTimer: 300,
    windDuration: 80,
    currentWindActive: 0,
    windForce: 0,

    friction: 0.95,
    p1Vel: { x: 0, y: 0 },
    p2Vel: { x: 0, y: 0 },

    update: function (player, opponent, ball) {
        switch (selectedMap) {
            case 0:
                this.handlePolarIce(player, opponent);
                break;
            case 1:
                this.handleEgyptWind(ball);
                break;
        }
    },

    handleEgyptWind: function (ball) {
        if (this.currentWindActive > 0) {
            this.currentWindActive--;
            if (!ball.isWaiting) {
                ball.vx += this.windForce;
            }
        } else {
            this.windTimer--;
            if (this.windTimer <= 0) {
                this.currentWindActive = this.windDuration;
                this.windTimer = 300 + floor(random(200));
                this.windForce = random([-0.2, 0.2]);
            }
        }
    },

    handlePolarIce: function (p1, p2) {
        this.p1Vel.x *= this.friction;
        this.p1Vel.y *= this.friction;

        if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_LEFT)) this.p1Vel.x -= 0.5;
        if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_RIGHT)) this.p1Vel.x += 0.5;
        if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_UP)) this.p1Vel.y -= 0.5;
        if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_DOWN)) this.p1Vel.y += 0.5;

        p1.x += this.p1Vel.x;
        p1.y += this.p1Vel.y;
        if (typeof p1.applyConstraints === 'function') p1.applyConstraints();

        this.p2Vel.x *= this.friction;
        this.p2Vel.y *= this.friction;

        if (!p2.isAI) {
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_LEFT)) this.p2Vel.x -= 0.4;
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_RIGHT)) this.p2Vel.x += 0.4;
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_UP)) this.p2Vel.y -= 0.4;
            if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_DOWN)) this.p2Vel.y += 0.4;
        } else {
            if (typeof opponentAI !== 'undefined' && opponentAI) {
                let dx = opponentAI.targetX - p2.x;
                if (dx < -3) this.p2Vel.x -= 0.4;
                else if (dx > 3) this.p2Vel.x += 0.4;
            }
        }

        p2.x += this.p2Vel.x;
        p2.y += this.p2Vel.y;
        if (typeof p2.applyConstraints === 'function') p2.applyConstraints();

    },

    draw: function () {
        if (selectedMap === 1 && this.currentWindActive > 0) {
            push();
            fill(200, 150, 50, 25);
            rectMode(CORNER);
            rect(0, 0, layout.VIRTUAL_W, layout.VIRTUAL_H);
            pop();
            this.drawWindParticles();
        }
    },

    drawWindParticles: function () {
        push();
        noStroke();
        // Precalculate variables outside the loop to save CPU cycles
        let vw = layout.VIRTUAL_W;
        let vh = layout.VIRTUAL_H;
        let speed = this.windForce * 60;
        let baseWave = frameCount * 0.08;
        let baseSpeed = frameCount * speed;
        
        // Reduced from 180 to 120 (hardly noticeable visually, massive CPU saving)
        for (let i = 0; i < 120; i++) {
            let xJiggle = random(-20, 20);
            let x = (baseSpeed + (i * 111) + xJiggle) % vw;
            if (x < 0) x += vw;

            let wave = sin(baseWave + i * 0.5) * 20;
            let yJiggle = random(-15, 15);
            let y = (i * (vh / 120)) + wave + yJiggle;

            fill(230, 190, 100, random(150, 230));
            // rect is significantly faster to render than ellipse on unaccelerated canvas
            rect(x, y, random(15, 30), random(1.5, 3));
        }
        pop();
    },
    reset: function () {
        this.currentWindActive = 0;
        this.windTimer = 300;
        this.windForce = 0;
        this.p1Vel = { x: 0, y: 0 };
        this.p2Vel = { x: 0, y: 0 };
    }
};