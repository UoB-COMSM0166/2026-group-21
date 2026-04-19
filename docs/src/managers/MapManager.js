const MapManager = {
    windTimer: GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_TIMER_BASE,
    windDuration: GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_DURATION,
    currentWindActive: 0,
    windForce: 0,

    friction: GAME_CONFIG.MAP_PHYSICS.POLAR_FRICTION,
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

    // handles wind logic for the Egypt map, blows the ball left or right
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
                // set random waiting time for next wind
                this.windTimer = GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_TIMER_BASE + 
                                 floor(random(GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_TIMER_RANDOM));
                // random pick direction, left-, right+
                let forceMagnitude = GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_FORCE_MAGNITUDE;
                this.windForce = random([-forceMagnitude, forceMagnitude]);
            }
        }
    },

    // handles Ice Physics for players, makes them slide with inertia
    handlePolarIce: function (p1, p2) {
        this.p1Vel.x *= this.friction;
        this.p1Vel.y *= this.friction;

        if (p1.stunTimer <= 0) {
            let p1Vel = GAME_CONFIG.MAP_PHYSICS.POLAR_MOVE_VELOCITY;
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_LEFT)) this.p1Vel.x -= p1Vel;
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_RIGHT)) this.p1Vel.x += p1Vel;
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_UP)) this.p1Vel.y -= p1Vel;
            if (keyIsDown(GAME_CONFIG.CONTROLS.PLAYER_DOWN)) this.p1Vel.y += p1Vel;
        }

        p1.x += this.p1Vel.x;
        p1.y += this.p1Vel.y;
        if (typeof p1.applyConstraints === 'function') p1.applyConstraints();

        this.p2Vel.x *= this.friction;
        this.p2Vel.y *= this.friction;

        if (p2.stunTimer <= 0) {
            let p2Vel = GAME_CONFIG.MAP_PHYSICS.POLAR_OPPONENT_VELOCITY;
            if (!p2.isAI) {
                if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_LEFT)) this.p2Vel.x -= p2Vel;
                if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_RIGHT)) this.p2Vel.x += p2Vel;
                if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_UP)) this.p2Vel.y -= p2Vel;
                if (keyIsDown(GAME_CONFIG.CONTROLS.OPPONENT_DOWN)) this.p2Vel.y += p2Vel;
            }
        }

        p2.x += this.p2Vel.x;
        p2.y += this.p2Vel.y;
        if (typeof p2.applyConstraints === 'function') p2.applyConstraints();

    },

    draw: function () {
        if (selectedMap === 1 && this.currentWindActive > 0) {
            push();
            const [r, g, b] = GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_OVERLAY_COLOR;
            fill(r, g, b, GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_OVERLAY_ALPHA);
            rectMode(CORNER);
            rect(0, 0, layout.VIRTUAL_W, layout.VIRTUAL_H);
            pop();
            this.drawWindParticles();
        }
    },

    // draw wind for egypt map
    drawWindParticles: function () {
        push();
        noStroke();
        // precalculate variables outside the loop to save CPU cycles
        let vw = layout.VIRTUAL_W;
        let vh = layout.VIRTUAL_H;
        let speed = this.windForce * GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_SPEED_MULT;
        
        const MP = GAME_CONFIG.MAP_PHYSICS;
        let baseWave = frameCount * MP.EGYPT_WAVE_SPEED;
        let baseSpeed = frameCount * speed;
        let particleCount = MP.EGYPT_WIND_PARTICLES;
        const [pr, pg, pb] = MP.EGYPT_PARTICLE_COLOR;

        for (let i = 0; i < particleCount; i++) {
            // calculate X, make particles move and wrap around screen
            let xJiggle = random(-MP.EGYPT_PARTICLE_X_JITTER, MP.EGYPT_PARTICLE_X_JITTER);
            let x = (baseSpeed + (i * MP.EGYPT_PARTICLE_X_STAGGER) + xJiggle) % vw;
            if (x < 0) x += vw; // wraps particles arriving from the left back to the right side of the screen

            // calculate Y, make particles move up and down like a wave
            let wave = sin(baseWave + i * MP.EGYPT_WAVE_FREQ) * MP.EGYPT_WAVE_AMP;
            let yJiggle = random(-MP.EGYPT_PARTICLE_Y_JITTER, MP.EGYPT_PARTICLE_Y_JITTER);
            let y = (i * (vh / particleCount)) + wave + yJiggle;

            fill(pr, pg, pb, random(MP.EGYPT_PARTICLE_ALPHA_MIN, MP.EGYPT_PARTICLE_ALPHA_MAX));
            rect(x, y, random(MP.EGYPT_PARTICLE_W_MIN, MP.EGYPT_PARTICLE_W_MAX), 
                random(MP.EGYPT_PARTICLE_H_MIN, MP.EGYPT_PARTICLE_H_MAX)
            );
        }
        pop();
    },

    reset: function () {
        this.currentWindActive = 0;
        this.windTimer = GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_TIMER_BASE;
        this.windForce = 0;
        this.p1Vel = { x: 0, y: 0 };
        this.p2Vel = { x: 0, y: 0 };
    }
};