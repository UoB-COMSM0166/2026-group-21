global.GAME_CONFIG = require('../docs/src/config/constants.js');
global.abs = Math.abs;
global.random = () => 0.5; // Fixed random for predictable testing
global.constrain = (n, low, high) => Math.max(Math.min(n, high), low);
global.dist = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
global.SkillManager = { triggerHitSkill: jest.fn() };

const Ball = require('../docs/src/entities/Ball.js');

describe('Ball Physics and Logic', () => {
    let ball;

    beforeEach(() => {
        // Prevent round timers from trying to run timeouts
        global.setTimeout = jest.fn();
        global.clearTimeout = jest.fn();
        
        ball = new Ball();
    });

    test('Initializes with center coordinates when reset', () => {
        ball.reset(100, 200, 'PLAYER');
        expect(ball.x).toBe(100);
        expect(ball.y).toBe(200);
        expect(ball.serveSide).toBe('PLAYER');
        expect(ball.vx).toBe(0);
        expect(ball.vy).toBe(0);
    });

    test('applyPhysics() correctly applies gravity and air resistance', () => {
        ball.vx = 10;
        ball.vy = -10;
        ball.vz = 5;
        ball.z = 10;
        
        let initialVx = ball.vx;
        let initialVz = ball.vz;
        
        ball.applyPhysics();
        
        // Check air resistance
        expect(ball.vx).toBe(initialVx * GAME_CONFIG.BALL.AIR_RESISTANCE);
        
        // Check gravity
        expect(ball.vz).toBe(initialVz - GAME_CONFIG.BALL.GRAVITY);
        
        // Check position update
        expect(ball.z).toBe(10 + initialVz); 
    });

    test('checkGroundCollision() handles ball out of bounds', () => {
        // Mock global layout and scoreManager and currentState
        global.layout = { courtLeft: 0, courtRight: 500, courtTop: 0, courtBottom: 800, netY: 400 };
        global.scoreManager = { recordPoint: jest.fn() };
        global.currentState = GAME_CONFIG.STATES.PLAYING;
        
        ball.z = -1; // Ball hit the ground
        ball.bounceCount = 0;
        ball.lastHitter = { isBottom: true }; // Player hit it
        
        // Ball lands way out of bounds
        ball.x = -100; 
        ball.y = -100;
        
        ball.checkGroundCollision();
        
        expect(ball.z).toBe(0); // Floor clamp
        expect(ball.bounceCount).toBe(1);
        
        // 1st bounce out of bounds -> Player loses the point
        // In handleFirstBounce -> terminateRound('OPPONENT') is called if hitter is bottom and it's out
        expect(ball.vx).toBe(0);
        expect(ball.vy).toBe(0);
        // terminateRound calls recordPoint if not tutorial
        expect(ball.roundEnding).toBe(true);
    });

    test('checkHit() successfully returns the ball when valid', () => {
        global.scoreManager = { recordPoint: jest.fn() };
        global.currentState = GAME_CONFIG.STATES.PLAYING;

        let mockPlayer = {
            id: 'player',
            isBottom: true,
            x: 200,
            y: 400,
            w: 100,
            h: 100,
            swingTimer: 5, // Currently swinging
            hasHit: false,
            skillType: null
        };
        
        ball.x = 200;
        ball.y = 400;
        ball.z = 20; // Within hittable Z range (bounds are typically 5 to 50)
        
        ball.checkHit(mockPlayer);
        
        expect(mockPlayer.hasHit).toBe(true);
        expect(ball.bounceCount).toBe(0);
        expect(ball.lastHitter).toBe(mockPlayer);
        // Ball velocity should be affected by hitting
        expect(ball.vy).toBeLessThan(0); // Player hits upwards (negative Y)
    });
});
