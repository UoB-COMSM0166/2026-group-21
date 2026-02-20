class AI {
    constructor(playerInstance) {
        this.player = playerInstance;
        this.noiseOffset = random(1000);
        this.fidgetSpeed = 0.015;
        this.serveDelayTimer = -1;
        this.serveTargetX = -1;
        this.targetX = width / 2;
    
        // default: Normal
        const defaultLevel = GAME_CONFIG.AI_LEVELS.NORMAL;
        this.difficulty     = 'NORMAL';
        this.speedMult      = defaultLevel.speedMult;
        this.reactionDelay  = defaultLevel.reactionDelay;
        this.errorRange     = defaultLevel.errorRange;
        this.prediction     = defaultLevel.prediction;
    
        this._reactionCounter = 0;
    }
    
    update(ball) {
        this._reactionCounter++;
        if (this._reactionCounter >= this.reactionDelay) {
            this._reactionCounter = 0;
    
            if (ball.isWaiting || ball.isTossing) {
                if (scoreManager.currentServer === 'PLAYER') {
                    let isPlayerOnRight = player.x > layout.centerX;
                    let homeX = isPlayerOnRight ?
                        layout.courtLeft + (layout.COURT_W / 4) :
                        layout.courtRight - (layout.COURT_W / 4);
                    let fidgetRange = layout.COURT_W / 8;
                    let noiseValue = (noise(this.noiseOffset) - 0.5) * fidgetRange;
                    this.noiseOffset += this.fidgetSpeed;
                    this.targetX = homeX + noiseValue;
                } else {
                    this.targetX = this.calculateServePosition();
                }
            } else {
                let error = random(-this.errorRange, this.errorRange);
                this.targetX = ball.x + (ball.vx * this.prediction) + error;
                this.serveDelayTimer = -1;
                this.serveTargetX = -1;
            }
        }
    
        // moving and actions are executed per frame
        this.applySmoothMovement();
        this.handleActions(ball);
    }
    
    applySmoothMovement() {
        let dx = this.targetX - this.player.x;
        if (Math.abs(dx) < 3) return;
        let lerpFactor = (scoreManager.currentServer === 'PLAYER' && !ball.isWaiting) ? 0.2 : 0.1;
        let moveStep = dx * lerpFactor;
        // multiplying "speedMult" reflects the speed diff by difficulty
        moveStep = constrain(moveStep, -this.player.speed * this.speedMult, this.player.speed * this.speedMult);
        this.player.x += moveStep;
    }

    calculateServePosition() {
        if (this.serveTargetX !== -1) return this.serveTargetX;
        const { courtLeft, courtRight, centerX } = layout;
        const padding = 30;
        if (scoreManager.currentSide === 'RIGHT') {
            this.serveTargetX = random(centerX + padding, courtRight - padding);
        } else {
            this.serveTargetX = random(courtLeft + padding, centerX - padding);
        }
        return this.serveTargetX;
    }

    handleActions(ball) {
        if (!ball.isWaiting && !ball.isTossing && ball.vy < 0) {
            let xDiff = Math.abs(this.player.x - ball.x);
            let yDiff = Math.abs(this.player.y - ball.y);
            if (xDiff < 70 && yDiff < 100) {
                this.player.swing();
            }
        }

        if (scoreManager.currentServer === 'OPPONENT') {
            if (ball.isWaiting) {
                if (this.serveDelayTimer === -1) {
                    this.serveDelayTimer = int(random(90, 160));
                }
                let distToTarget = Math.abs(this.player.x - this.serveTargetX);
                if (distToTarget < 10 && this.serveDelayTimer > 0) {
                    this.serveDelayTimer--;
                } else if (this.serveDelayTimer === 0) {
                    ball.toss();
                    this.serveDelayTimer = -1;
                }
            } else if (ball.isTossing && ball.z > 55) {
                this.player.swing();
            }
        }
    }
}