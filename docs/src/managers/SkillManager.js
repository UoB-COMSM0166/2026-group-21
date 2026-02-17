class SkillManager {
    static execute(p, ball) {
        if (!p.skillType) return;

        switch (p.skillType) {
            case 'SPEED_BURST':
                let originalSpeed = p.speed;
                p.speed *= 3;
                setTimeout(() => p.speed = originalSpeed, 500);
                break;

            case 'TELEPORT':
                p.x = lerp(p.x, ball.x, 0.8);
                break;
            
            case 'POWER_SHOT':
                break;

            case 'LONG_REACH':
                break;
            
            case 'RANDOM':
                break;
            
        }
    }
}