const GAME_CONFIG = {
    STATES: {
        MENU: 'MENU',
        CHAR_SELECT: 'CHAR_SELECT',
        MAP_SELECT: 'MAP_SELECT',
        PLAYING: 'PLAYING',
        PAUSED: 'PAUSED',
        SETTINGS: 'SETTINGS',

        TUTORIAL: 'TUTORIAL',
        DIFFICULTY_SELECT: "DIFFICULTY_SELECT"
    },

    TUTORIAL: {
        TARGET_SUCCESS_COUNT: 3,

        TARGET_ZONE_OFFSET_X: 300,
        TARGET_ZONE_OFFSET_Y: 200,
        PLAYER_SERVE_Y_OFFSET: 20,
        OPPONENT_START_Y_OFFSET: 20,

        TARGET_RADIUS: 40,
        HIT_VY_THRESHOLD: -2,
        DEAD_BALL_VZ_THRESHOLD: 1.5,
        OUT_OFFSET_Y: 50,
        SKILL_TRIGGER_MARGIN: 2,

        PAUSE_MINOR: 60,
        PAUSE_MAJOR: 90,
        RESET_WAIT_LIMIT: 60
    },

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
        DIRECTION_MULT: 0.15,       // Sensitivity of horizontal angle deflection
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
        FEEDBACK_PERFECT: [50, 205, 50],
        FEEDBACK_MISS: [220, 20, 60],
        INDICATOR_YELLOW: [255, 215, 0],
    },

    PLAYER: {
        WIDTH: 100,
        HEIGHT: 64,
        SPEED: 6,
        SWING_DURATION: 10,         // frames: how long the hit window stays active
        SERVE_OFFSET: 5,            // Starting distance behind baseline
        NET_MARGIN: 10,             // Minimum safe distance from net
        SWING_SCALE: 1.1,            // Visual feedback multiplier during swing
        SKILL_COOLDOWN: 180,
        TOTAL_FRAMES: 6,
        ANIM_SPEED: 0.4,
        SPRITE_WIDTH: 100,
        SPRITE_HEIGHT: 64,
        SPRITE_COLS: 2
    },

    ASSETS: {
        MENU_BG: 'assets/images/menu_background_picture.png',
        ESC_IMG: 'assets/images/esc.png',
        DIFFICULTY_IMGS: [
            'assets/images/easy_mode.png',
            'assets/images/normal_mode.png',
            'assets/images/hard_mode.png'
        ],
        MAP_IMGS: [
            'assets/images/preview_polar_bg.png',
            'assets/images/preview_eygpt_bg.png',
            'assets/images/preview_wimbledon_bg.png'
        ],
        PLAYER_IMG: 'assets/images/player_bird_back.png',
        BACKGROUND_IMG: 'assets/images/bg_polar.png',
        TUTORIAL_IMG: 'assets/images/game_key_instruction.png',
        COURT_IMG: 'assets/images/bg_stadium.png'
    },

    CONTROLS: {
        RESTART: 'r',
        ESCAPE: 27,          // esc
        OPPONENT_ACTION: 13, // Enter
        OPPONENT_LEFT: 37,   // LEFT_ARROW
        OPPONENT_RIGHT: 39,  // RIGHT_ARROW
        OPPONENT_UP: 38,     // UP_ARROW
        OPPONENT_DOWN: 40,   // DOWN_ARROW
        PLAYER_ACTION: 32,   //space
        PLAYER_LEFT: 65,     // A
        PLAYER_RIGHT: 68,    // D
        PLAYER_UP: 87,       // W
        PLAYER_DOWN: 83,     // S
        OPPONENT_SKILL: 191, // /
        PLAYER_SKILL: 81     // Q 
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
    },

    FEEDBACK: {
        MISS_DISTANCE_THRESHOLD: 300,
        DISPLAY_DURATION: 60,
        TEXT_SIZE: 24,
        TEXT_OFFSET_Y: 20,
        INDICATOR_OFFSET_Y: 50,
        INDICATOR_ANIM_SPEED: 0.1,
        INDICATOR_ANIM_AMP: 5,
        INDICATOR_WIDTH: 10,
        INDICATOR_HEIGHT: 15
    },

    MAPS: [
        { name: "Polar", bgPath: "assets/images/bg_polar.png", courtPath: "assets/images/bg_stadium.png" },
        { name: "Egypt", bgPath: "assets/images/bg_egypt.png", courtPath: "assets/images/bg_stadium.png" },
        { name: "Hard Court", bgPath: "assets/images/bg_hardcourt.png", courtPath: "assets/images/bg_stadium.png" }
    ],

    CHARACTERS: [
        {
            name: "Cat",
            speed: 6,
            skillType: 'SHADOW_TELEPORT',
            assets: {
                front: 'assets/images/player_cat_swing_front.png',
                back: 'assets/images/player_cat_swing_back.png',
                portrait: 'assets/images/player_cat_front.png'
            }
        },
        {
            name: "Dog",
            speed: 6,
            skillType: 'GIGA_BALL',
            assets: {
                front: 'assets/images/player_dog_swing_front.png',
                back: 'assets/images/player_dog_swing_back.png',
                portrait: 'assets/images/player_dog_front.png'
            }
        },
        {
            name: "Deer",
            speed: 6,
            skillType: 'FOREST_ZEN',
            assets: {
                front: 'assets/images/player_deer_swing_front.png',
                back: 'assets/images/player_deer_swing_back.png',
                portrait: 'assets/images/player_deer_front.png'
            }
        },
        {
            name: "Bird",
            speed: 6,
            skillType: 'FEATHER_STORM',
            assets: {
                front: 'assets/images/player_bird_swing_front.png',
                back: 'assets/images/player_bird_swing_back.png',
                portrait: 'assets/images/player_bird_front.png'
            }
        },
        { name: "?", speed: 6, skillType: '?', assets:{}}
    ],

    AI_LEVELS: {
        EASY: {
            speedMult: 0.7,     // Directly proportional
            reactionDelay: 13,  // Inversely proportional
            errorRange: 45,     // Inversely proportional
            prediction: 4       // Directly proportional
        },
        NORMAL: {
            speedMult: 0.8,
            reactionDelay: 8,
            errorRange: 25,
            prediction: 8
        },
        HARD: {
            speedMult: 0.89,
            reactionDelay: 5,
            errorRange: 15,
            prediction: 10
        }
    },

    AI: {
        FIDGET_SPEED: 0.015,        // Speed of lateral sway while receiving
        HOME_X_DIVISOR: 4,          // Court ratio for receive home pos
        FIDGET_RANGE_DIVISOR: 8,    // Court ratio for  lateral sway range
        RECEIVE_X_THRESHOLD: 70,    
        RECEIVE_Y_THRESHOLD: 100,
        SERVE_DELAY_MIN: 90,
        SERVE_DELAY_MAX: 160,
        LERP_FACTOR_NORMAL: 0.2,
        LERP_FACTOR_SERVE: 0.1,
        SERVE_POS_PADDING: 10,
        SERVE_DIST_THRESHOLD: 20,
        SERVE_SWING_Z_MIN: 10,      // Min z height to swing during serve
        SERVE_SWING_Z_MAX: 40       // Max z height to swing during serve
    }
};