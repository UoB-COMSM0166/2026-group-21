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

    // cat: instantly teleport the player horizontally to the x-coordinate match the ball (keep the same y-coordinate)
    static shadowTeleport(p, ball) {
        p.x = ball.x;
        // offset to make player have time to react
        let hitOffset = GAME_CONFIG.PLAYER.HIT_OFFSET; 
        if (p.isBottom) {
            p.y = ball.y + hitOffset;
        } else {
            p.y = ball.y - hitOffset;
        }
        p.applyConstraints();
    }

    // dog: grow ball to 2x size for 1 second, then return to normal size, opponent will be stunned if they catch ball
    static gigaBall(ball) {
        ball.r = GAME_CONFIG.BALL.RADIUS * GAME_CONFIG.PLAYER.SKILLS.GIGA_BALL_SIZE;
        ball.sizeTimer = GAME_CONFIG.PLAYER.SKILLS.DURATION_FRAMES;
        ball.isGigaShot = true;
    }

    // bird: shrink ball to 0.5x size and increase speed for around 1 second, then return everything back to normal
    static featherStorm(ball) {
        ball.r = GAME_CONFIG.BALL.RADIUS * GAME_CONFIG.PLAYER.SKILLS.FEATHER_STORM_SIZE;
        ball.sizeTimer = GAME_CONFIG.PLAYER.SKILLS.DURATION_FRAMES;

        ball.speedMultiplier = GAME_CONFIG.PLAYER.SKILLS.FEATHER_STORM_SPEED; 
        ball.speedTimer = GAME_CONFIG.PLAYER.SKILLS.DURATION_FRAMES;
    }

    // deer: reduce the ball’s velocity to 0.5x speed for around 1 second, then return it back to normal
    static forestZen(ball) {
        ball.speedMultiplier = GAME_CONFIG.PLAYER.SKILLS.FOREST_ZEN_SPEED; 
        ball.speedTimer = GAME_CONFIG.PLAYER.SKILLS.DURATION_FRAMES;
    }
}