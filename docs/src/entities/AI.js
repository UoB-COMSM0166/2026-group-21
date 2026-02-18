class AI {
    constructor(playerInstance) {
        this.player = playerInstance;
        this.reactionSpeed = 0.15;
        this.targetSwingHeight = random(45, 65);
    }

    update(ball) {
        let targetX = ball.x;

        let dx = targetX - this.player.x;

        if (Math.abs(dx) > 2) {
            let moveStep = dx * 0.2;

            moveStep = constrain(moveStep, -this.player.speed, this.player.speed);

            this.player.x += moveStep;
        }

        if (!ball.isWaiting && !ball.isTossing && ball.vy < 0) {
            let distToBall = dist(this.player.x, this.player.y, ball.x, ball.y);
            if (distToBall < 80) {
                this.player.swing();
            }
        }

        if (ball.isWaiting && scoreManager.currentServer === 'OPPONENT') {
            if (frameCount % 60 === 0) {
                ball.toss();
            }
        }

        if (ball.isTossing && scoreManager.currentServer === 'OPPONENT') {
            if (ball.z > this.targetSwingHeight) {
                this.player.swing();
                this.targetSwingHeight = random(45, 65);
            }
        }
    }
}