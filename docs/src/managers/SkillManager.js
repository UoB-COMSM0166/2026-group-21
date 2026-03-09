class SkillManager {
    static execute(p, ball) {
        if (!p.skillType) return;

        switch (p.skillType) {
            // On activation, instantly teleports the player horizontally to the x-coordinate nearest to the ball.
            case 'SHADOW_TELEPORT':
                break;
            // Increases the ball's scale to 200% (2x) 1 second (remember the ball's hitbox should increase too, same as shrink)
            case 'GIGA_BALL':
                break;
            // Shrinks the ball to 50% (0.5x) of its original size and increases its movement speed 1 second
            case 'FEATHER_STORM':
                break;
            // Reduces the ball’s velocity to 0.5x speed 1 second
            case 'FOREST_ZEN':
                break;
            // just leave it now
            case '?':
                break;
            
        }
    }
}