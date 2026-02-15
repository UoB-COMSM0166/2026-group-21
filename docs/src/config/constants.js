const GAME_CONFIG = {
    COURT: {
        WIDTH: 450,
        HEIGHT: 575,
        SERVE_OUTSIDE_OFFSET: 30,
        TALL_SCREEN_THRESHOLD: 775, // Threshold to optimize layout for laptop screens
        TALL_SCREEN_TOP: 150,
        MIN_TOP_MARGIN: 20,
        MOVE_PADDING_X: 150,        // Allows movement beyond visual lines for gameplay feel
        MOVE_PADDING_Y: 100
    },

    MATCH: {
        DEFAULT_SERVER: 'PLAYER',
        DEFAULT_SIDE: 'RIGHT',
        ROUND_END_DELAY: 500,       // ms: pause before next round starts
        SAFETY_LIMIT: 500,          // Failsafe: resets if ball flies too far
        WINNING_GAMES: 3,
        POINTS_TO_WIN: 4,
        POINT_GAP: 2,
        SCORE_LABELS: ["0", "15", "30", "40"],
        DEUCE_THRESHOLD: 3,
        LABEL_DEUCE: "Deuce",
        LABEL_AD: "AD",
        LABEL_EMPTY: " "
    },

    BALL: {
        RADIUS: 10,
        GRAVITY: 0.4,
        AIR_RESISTANCE: 0.99,       // Multiplier applied per frame
        BOUNCE_FRICTION: 0.8,       // Velocity retention after floor impact
        TOSS_Z: 8,                  // Initial upward force for serve toss
        BOUNCE_Z: 6,                // Upward force after first bounce
        HIT_Y: 13,                  // Forward power imparted by racket
        HIT_Z: 7,                   // Upward lift imparted by racket
        DIRECTION_MULT: 0.2,        // Sensitivity of horizontal angle deflection
        HIT_MIN_Z: 5,               // Hit window: minimum height required
        HIT_MAX_Z: 50,              // Hit window: maximum height allowed
        SERVE_MIN_VX: 6,
        SERVE_MAX_VX: 12
    },

    COLORS: {
        WHITE: [255, 255, 255],
        BLACK: [0, 0, 0],
        YELLOW: [255, 255, 0],
        GOLD: [255, 215, 0],
        SHADOW: [0, 0, 0, 100],
        PINK: [255, 200, 200],
        DARK_GRAY: [0, 0, 0, 180],
        FALLBACK: 150,
    },

    PLAYER: {
        WIDTH: 64,
        HEIGHT: 64,
        SPEED: 5,
        SWING_DURATION: 10,         // frames: how long the hit window stays active
        SERVE_OFFSET: 5,            // Starting distance behind baseline
        NET_MARGIN: 10,             // Minimum safe distance from net
        SWING_SCALE: 1.1            // Visual feedback multiplier during swing
    },

    ASSETS: {
        PLAYER_IMG: 'assets/images/player_bird_back.png',
        BACKGROUND_IMG: 'assets/images/bg_polar.png',
        OPPONENT_IMG: 'assets/images/player_cat_front.png',
        COURT_IMG: 'assets/images/stadiumtest.png'
    },

    CONTROLS: {
        RESTART: 'r',
        PLAYER_ACTION: 13, // Enter
        PLAYER_LEFT: 37,   // LEFT_ARROW
        PLAYER_RIGHT: 39,  // RIGHT_ARROW
        PLAYER_UP: 38,     // UP_ARROW
        PLAYER_DOWN: 40,   // DOWN_ARROW
        OPPONENT_ACTION: 32, //space
        OPPONENT_LEFT: 65, // A
        OPPONENT_RIGHT: 68,// D
        OPPONENT_UP: 87,   // W
        OPPONENT_DOWN: 83  // S
    },

    VISUALS: {
        SHADOW_SIZE_BASE: 2,
        SHADOW_MIN_SIZE: 5,
        SHADOW_Z_FACTOR: 0.2,       // how fast the shadow shrinks as ball rises
        SHADOW_ELLIPSE_H: 0.5,      // flattening ratio for the shadow ellipse
        BASE_STROKE_WEIGHT: 2
    },

    UI: {
        SIZE_MAIN: 32,
        SIZE_SUB: 16,
        OFFSET_Y: 40,               // vertical distance from the court top
        GAMES_OFFSET_Y: 30,         // spacing between score and games
        WINNER_TEXT_SIZE: 64,
        RESTART_TEXT_SIZE: 24,
        OVERLAY_TEXT_STROKE: 4,
        WINNER_Y_OFFSET: 50,        // winner text vertical offset from center
        RESTART_Y_OFFSET: 50,       // restart hint vertical offset from center
        SCORE_MARGIN_TOP: 10        // safety margin from top edge
    }
};