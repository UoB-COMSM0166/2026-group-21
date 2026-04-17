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
                this.windTimer = GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_TIMER_BASE + 
                                 floor(random(GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_TIMER_RANDOM));
                let forceMagnitude = GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_FORCE_MAGNITUDE;
                this.windForce = random([-forceMagnitude, forceMagnitude]);
            }
        }
    },

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
            } else {
                if (typeof opponentAI !== 'undefined' && opponentAI) {
                    let dx = opponentAI.targetX - p2.x;
                    let deadzone = GAME_CONFIG.MAP_PHYSICS.POLAR_AI_DEADZONE;
                    if (dx < -deadzone) this.p2Vel.x -= p2Vel;
                    else if (dx > deadzone) this.p2Vel.x += p2Vel;
                }
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
        let speed = this.windForce * GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_SPEED_MULT;
        
        // Base sine wave counter. Changing the multiplier affects how fast the wind 'wiggles' vertically.
        let baseWave = frameCount * 0.08;
        
        // Horizontal displacement factor driven by the raw map windForce configuration
        let baseSpeed = frameCount * speed;
        let particleCount = GAME_CONFIG.MAP_PHYSICS.EGYPT_WIND_PARTICLES;
        
        for (let i = 0; i < particleCount; i++) {
            // Apply a slight horizontal stagger per particle (i * 111 pseudo-randomizes mapping)
            let xJiggle = random(-20, 20);
            let x = (baseSpeed + (i * 111) + xJiggle) % vw;
            if (x < 0) x += vw; // Wraps particles arriving from the left back to the right side of the screen

            // Overlay the base sine wave with a phase shift (i * 0.5) so particles don't identically wiggle
            let wave = sin(baseWave + i * 0.5) * 20;
            let yJiggle = random(-15, 15);
            
            // Distribute particles evenly across the vertical axis, then displace them visually by the sine wave
            let y = (i * (vh / particleCount)) + wave + yJiggle;

            fill(230, 190, 100, random(150, 230));
            // rect is significantly faster to render than ellipse on unaccelerated canvas
            rect(x, y, random(15, 30), random(1.5, 3));
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