class SkillManager {
    static execute(p, ball) {
        if (!p.skillType) return;

        switch (p.skillType) {
            // On activation, instantly teleports the player horizontally to the x-coordinate nearest to the ball.
            case 'SHADOW_TELEPORT':
                SkillManager.shadowTeleport(p, ball);
                break;
            // Increases the ball's scale to 200% (2x) 1 second (remember the ball's hitbox should increase too, same as shrink)
            case 'GIGA_BALL':
                SkillManager.gigaBall(ball);
                break;
            // Shrinks the ball to 50% (0.5x) of its original size and increases its movement speed 1 second
            case 'FEATHER_STORM':
                SkillManager.featherStorm(ball);
                break;
            // Reduces the ball’s velocity to 0.5x speed 1 second
            case 'FOREST_ZEN':
                SkillManager.forestZen(ball);
                break;
            // just leave it now
            case '?':
                break;
            
        }
    }

    // Instantly teleport the player horizontally to the x-coordinate match the ball (while keeping the same y-coordinate)
    static shadowTeleport(p, ball) {
        const hw = p.w / 2;
        const { courtLeft, courtRight } = layout;
        p.x = constrain(ball.x, courtLeft + hw, courtRight - hw);
    }

    // Grow ball to 2x size for 1 second, then return to normal size
    static gigaBall(ball) {
        // Clear any existing size effects
        if (ball._sizeEffectTimeout) {
            clearTimeout(ball._sizeEffectTimeout);
            ball._sizeEffectTimeout = null;
        }
        const baseR = GAME_CONFIG.BALL.RADIUS;
        ball.r = baseR * 2;
        ball._sizeEffectTimeout = setTimeout(() => {
            ball.r = baseR;
            ball._sizeEffectTimeout = null;
        }, 1000);
    }

    // Shrink ball to 0.5x size and increase speed for around 1 second, then return everything back to normal
    static featherStorm(ball) {
        // This will be used to clear any existing size effects
        if (ball._sizeEffectTimeout) {
            clearTimeout(ball._sizeEffectTimeout);
            ball._sizeEffectTimeout = null;
        }
        // This will be used to clear any existing speed effects
        if (ball._speedEffectTimeout) {
            clearTimeout(ball._speedEffectTimeout);
            ball._speedEffectTimeout = null;
        }
        const baseR = GAME_CONFIG.BALL.RADIUS;
        ball.r = baseR * 0.5;
        // This will be used to boost current velocity by 2x
        ball.vx *= 2;
        ball.vy *= 2;
        ball.vz *= 2;
        
        const restoreR = () => {
            ball.r = baseR;
            ball._sizeEffectTimeout = null;
        };
        const restoreSpeed = () => {
            // Halve the velocity to restore it back to normal (since we boosted it by 2x)
            ball.vx *= 0.5;
            ball.vy *= 0.5;
            ball.vz *= 0.5;
            ball._speedEffectTimeout = null;
        };

        ball._sizeEffectTimeout = setTimeout(restoreR, 1000);
        ball._speedEffectTimeout = setTimeout(restoreSpeed, 1000);
    }

    // This would be used to reduce the ball’s velocity to 0.5x speed for around 1 second, then return it back to normal
    static forestZen(ball) {
        // This will be used to clear any existing speed effects
        if (ball._zenEffectActive) return;
        ball._zenEffectActive = true;
        // This will be used to slow down current velocity by 0.5x
        ball.vx *= 0.5;
        ball.vy *= 0.5;
        ball.vz *= 0.5;

        setTimeout(() => {
            //Restore speed by multiplying velocity by 2x (since we slowed it down by 0.5x)
            ball.vx *= 2;
            ball.vy *= 2;
            ball.vz *= 2;
            ball._zenEffectActive = false;
        }, 1000);
    }
}