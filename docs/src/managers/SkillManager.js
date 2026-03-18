class SkillManager {
    static execute(p, ball) {
        if (!p.skillType) return;
        if (p.skillType === 'SHADOW_TELEPORT') {
            SkillManager.shadowTeleport(p, ball);
            p.skillCooldown = p.maxCooldown; 
            p.activeBuff = null;
        } else {
            p.activeBuff = p.skillType;
        }
    }

    static triggerHitSkill(p, ball) {
        if (!p.activeBuff) return;

        switch (p.activeBuff) {
            case 'GIGA_BALL':
                SkillManager.gigaBall(ball);
                break;
            case 'FEATHER_STORM':
                SkillManager.featherStorm(ball);
                break;
            case 'FOREST_ZEN':
                SkillManager.forestZen(ball);
                break;
        }
        p.skillCooldown = p.maxCooldown;
        p.activeBuff = null;
    }

    // Instantly teleport the player horizontally to the x-coordinate match the ball (while keeping the same y-coordinate)
    static shadowTeleport(p, ball) {
        p.x = ball.x;
        // offset to make player have time to react
        let hitOffset = 100; 
        if (p.isBottom) {
            p.y = ball.y + hitOffset;
        } else {
            p.y = ball.y - hitOffset;
        }
        p.applyConstraints();
    }

    // Grow ball to 2x size for 1 second, then return to normal size, opponent will be stunned if they catch ball
    static gigaBall(ball) {
        ball.r = GAME_CONFIG.BALL.RADIUS * 2;
        ball.sizeTimer = 60;
        ball.isGigaShot = true;
    }

    // Shrink ball to 0.5x size and increase speed for around 1 second, then return everything back to normal
    static featherStorm(ball) {
        ball.r = GAME_CONFIG.BALL.RADIUS * 0.5;
        ball.sizeTimer = 60;

        ball.speedMultiplier = 1.1; 
        ball.speedTimer = 60;
    }

    // This would be used to reduce the ball’s velocity to 0.5x speed for around 1 second, then return it back to normal
    static forestZen(ball) {
        ball.speedMultiplier = 0.7; 
        ball.speedTimer = 60;
    }
}