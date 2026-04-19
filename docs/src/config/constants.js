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
        HIT_VY_THRESHOLD: -2,          // vy is negative when ball travels upward (toward opponent)
        DEAD_BALL_VZ_THRESHOLD: 1.5,   // ball is "dead" when vertical bounce speed drops below this
        OUT_OFFSET_Y: 50,
        SKILL_TRIGGER_MARGIN: 5,       // frames of cooldown reset that count as "skill just fired"

        PAUSE_MINOR: 60,               // frames: short freeze after each small success
        PAUSE_MAJOR: 90,               // frames: longer freeze when a full point is scored
        RESET_WAIT_LIMIT: 60,          // frames: delay before resetting failed ball

        TARGET_ZONE_W: 60,             // width of the target zone ellipse in pixels
        TARGET_ZONE_H: 30,
        UI_TEXT_SIZE: 36,
        UI_BOX_W: 950,                 // width of the tutorial prompt text box
        UI_BOX_H: 300,
        SUCCESS_TEXT_SIZE: 50
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

    MAP_PHYSICS: {
        POLAR_FRICTION: 0.95,
        POLAR_MOVE_VELOCITY: 0.9,
        POLAR_OPPONENT_VELOCITY: 0.9,
        POLAR_AI_DEADZONE: 3,

        EGYPT_WIND_DURATION: 80,
        EGYPT_WIND_TIMER_BASE: 300,
        EGYPT_WIND_TIMER_RANDOM: 200,
        EGYPT_WIND_FORCE_MAGNITUDE: 0.2,
        EGYPT_WIND_PARTICLES: 120,
        EGYPT_WIND_SPEED_MULT: 60,

        EGYPT_WIND_OVERLAY_COLOR: [200, 150, 50], // RGB tint of the wind screen overlay
        EGYPT_WIND_OVERLAY_ALPHA: 25,             // opacity of the wind screen overlay (0-255)
        EGYPT_WAVE_SPEED: 0.08,                   // frameCount multiplier for particle wave animation
        EGYPT_WAVE_AMP: 20,                       // pixel amplitude of particle vertical wave
        EGYPT_WAVE_FREQ: 0.5,                     // wave phase offset per particle index
        EGYPT_PARTICLE_X_STAGGER: 111,            // pixel spacing between particle base X positions
        EGYPT_PARTICLE_X_JITTER: 20,              // max random X offset per particle
        EGYPT_PARTICLE_Y_JITTER: 15,
        EGYPT_PARTICLE_COLOR: [230, 190, 100],    // base RGB of sand particles
        EGYPT_PARTICLE_ALPHA_MIN: 150,            // minimum opacity of sand particles
        EGYPT_PARTICLE_ALPHA_MAX: 230,
        EGYPT_PARTICLE_W_MIN: 15,                 // minimum particle width in pixels
        EGYPT_PARTICLE_W_MAX: 30,
        EGYPT_PARTICLE_H_MIN: 1.5,
        EGYPT_PARTICLE_H_MAX: 3
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
        HIT_MIN_Z: 2,               // Hit window: minimum height required
        HIT_MAX_Z: 50,
        SERVE_MIN_VX: 6,
        SERVE_MAX_VX: 12
    },

    BALL_HIT_BEHAVIOR: {
        SCORE_DISPLAY_DURATION: 3000,  // ms: duration to show game score after winning | ↓: faster between-game transitions
        GIGA_SHOT_STUN: 45,            // frames: stun duration when hit by giga shot | ↑: opponent stunned longer
        MIN_VX_FOR_SIGN: 0.25,         // minimum vx to determine shot direction | ↑: requires faster ball to detect direction
        AIRTIME_CALC_MIN_FRAMES: 8,    // minimum frames for airtime calculation | ↑: assumes longer flight time
        GRAVITY_MIN: 0.01,             // minimum gravity value for calculations | ↑: prevents division errors
        AIR_RESISTANCE_MIN: 0.0001,    // minimum air resistance for calculations | ↑: prevents division errors
        HIT_Y_TOLERANCE: 5,            // ↑: more forgiving Y-axis hit detection
        
        // Wall personality shot physics
        WALL_RETURN_SPREAD_DEFAULT: 26,    // ↓: tighter center returns
        WALL_RETURN_CLAMP_DEFAULT: 0.72,   // ↑: more risky returns (closer to lines)
        WALL_SAFETY_MARGIN: 36,            // ↓: allows shots closer to sidelines
        
        // Attacker personality shot physics
        ATTACKER_SAFETY_MARGIN: 32,        // ↓: allows shots closer to sidelines
        ATTACKER_MAX_ABS_SCALE: 0.78,      // ↑: more aggressive angles
        ATTACKER_EXTREME_MULT: 0.8,        // multiplier for extreme angle shots | ↑: more extreme angles
        
        // Wide personality shot physics
        WIDE_SAFETY_MARGIN: 20,            // ↓: allows shots even closer to sidelines
        WIDE_LIMIT_SCALE: 0.85             // ↑: more risky wide shots
    },

    COLORS: {
        WHITE: [255, 255, 255],
        BLACK: [0, 0, 0],
        YELLOW: [255, 255, 0],
        GOLD: [253, 203, 2],
        SHADOW: [0, 0, 0, 100],
        PINK: [255, 200, 200],
        DARK_GRAY: [0, 0, 0, 180],
        FALLBACK: 150,
        FEEDBACK_PERFECT: [50, 205, 50],
        FEEDBACK_MISS: [220, 20, 60],
        INDICATOR_YELLOW: [255, 215, 0],
        PLAYER_ONE: [255, 100, 100],
        PLAYER_TWO: [100, 200, 255],
        MENU_BG_LIGHT: 250,
        MENU_BG_DARK: 200,
        MENU_TEXT_SHADOW: [56, 49, 78],
        OVERLAY_DARK: [20, 20, 25, 220],
        UI_STROKE_DARK: [51, 44, 74],
        UI_STROKE_LIGHT: [64, 57, 85],
        UI_PANEL_BG: [255, 200],
        UI_MASK: [0, 0, 0, 100],
        TEXT_ERROR: [200, 30, 30],
        TUTORIAL_TEXT_HIGHLIGHT: [255, 255, 0, 50],
        GAME_GOLD: [255, 188, 31],         // opaque HUD gold (same hue as GOLD_COLOR, no alpha)
        SERVER_INDICATOR: [0, 255, 0]      // next-server text in score overlay
    },

    PLAYER: {
        WIDTH: 100,
        HEIGHT: 64,
        SPEED: 6,
        SWING_DURATION: 10,            // frames: how long the hit window stays active
        SERVE_OFFSET: 5,               // Starting distance behind baseline
        NET_MARGIN: 10,                // Minimum safe distance from net
        SKILL_COOLDOWN: 180,           // frames before skill can be used again
        TOTAL_FRAMES: 6,               // total sprite animation frames in the swing sheet
        ANIM_SPEED: 0.4,               // frames advanced per game tick during swing animation
        SPRITE_WIDTH: 100,
        SPRITE_HEIGHT: 64,
        SPRITE_COLS: 2,                // number of columns in the sprite sheet grid
        SKILL_BAR_COLORS: { BG: [50, 50, 50, 200], BORDER_RADIUS: 5 },
        SKILL_AURA_STROKE_INNER: 200,  // alpha of the inner aura ring (brighter)
        SKILL_AURA_STROKE_OUTER: 80,   // dimmer
        AURA_PULSE_SPEED: 0.15,        // radians per frame for aura size sine wave
        AURA_PULSE_AMP: 15,            // pixel amplitude of the aura size
        AURA_BASE_PADDING: 10,         // extra pixels added to player size for the base aura ring
        AURA_OUTER_RING_GAP: 10,       // extra size of the outer aura ring beyond the inner ring
        AURA_STROKE_WEIGHT_OUTER: 6,
        AURA_STROKE_WEIGHT_INNER: 3,
        STUN_STAR_COUNT: 3,
        STUN_HEAD_OFFSET: 10,
        STUN_STAR_ROTATION_SPEED: 0.2,
        STUN_STAR_ORBIT_X: 20,         // horizontal circle radius for stun stars
        STUN_STAR_ORBIT_Y: 5,
        STUN_STAR_SIZE: 8,
        HIT_OFFSET: 100,               // pixel gap between teleported player and ball (shadow teleport skill)
        SKILLS: {
            DURATION_FRAMES: 60,
            FEATHER_STORM_SPEED: 1.1,
            FEATHER_STORM_SIZE: 0.5,
            FOREST_ZEN_SPEED: 0.7,
            GIGA_BALL_SIZE: 2.0
        }
    },

    ASSETS: {
        MENU_BG: 'assets/images/bg_menu.png',
        ESC_IMG: 'assets/images/button_esc.png',
        DIFFICULTY_IMGS: [
            'assets/images/mode_easy.png',
            'assets/images/mode_normal.png',
            'assets/images/mode_hard.png'
        ],
        MAP_IMGS: [
            'assets/images/preview_polar_bg.png',
            'assets/images/preview_egypt_bg.png',
            'assets/images/preview_wimbledon_bg.png'
        ],
        PLAYER_IMG: 'assets/images/player_bird_back.png',
        BACKGROUND_IMG: 'assets/images/bg_polar_1.png',
        TUTORIAL_IMG: 'assets/images/game_key_instruction.png',
        COURT_IMG: 'assets/images/bg_stadium.png',
        GEAR_IMG: 'assets/images/button_settings.png',
        SCORE_PATH: 'assets/images/',
        PAW_ICON: 'assets/images/menu_icon_paw.png',
        SKILL_ICONS: {
            cat: 'assets/images/skill_cat.png',
            dog: 'assets/images/skill_dog.png',
            deer: 'assets/images/skill_deer.png',
            bird: 'assets/images/skill_bird.png'
        },
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

    SOUND: {
        FADE_TIME_DEFAULT: 1.5,       // seconds for BGM fade-in / fade-out
        FADE_TIME_MULTIPLIER: 2.5,    
        BUFFER_MS: 100,               // brief delay before starting new BGM to prevent audio glitches
        TARGET_VOLUME_DEFAULT: 0.3,
        SFX_VOLUME_DEFAULT: 0.5,
        COOLDOWN: {
            'success': 200,
            'select': 50,
            'confirm': 100,
            'swing': 200,
            'hit': 100,
            'clap': 500,
            'boo': 500
        },
        VOLUME: {
            'success': 2.0,
            'victory': 0.8,
            'select': 1.5,
            'confirm': 0.6,
            'swing': 2.0,
            'hit': 0.3,
            'clap': 0.5,
            'boo': 0.4
        }
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
        SCORE_MARGIN_TOP: 10,       // safety margin from top edge
        SKILL_BUTTON_SIZE: 110,
        SKILL_MASK_OPACITY: 180,
        SKILL_MASK_INSET: 10,       
        GOLD_COLOR: [255, 188, 31, 200],
        HUD_SCORE_TITLE: 50,
        HUD_SCORE_MAIN: 54,
        HUD_SCORE_SUB: 12,
        ROUND_END_MAIN: 80,
        ROUND_END_SUB: 24,
        DEV_MODE_TEXT: 14,
        GEAR_MARGIN: 60,
        GEAR_SIZE: 72,
        SCORE_OVERLAY_SERVER_TEXT: 26, // text size for the "Next Serve" line in the game-won overlay
        HUD_GAMES_TEXT: 22             // text size for the games score in the in-game scoreboard
    },

    FEEDBACK: {
        MISS_DISTANCE_THRESHOLD: 300, // max px distance from ball that still counts as a near-miss swing
        DISPLAY_DURATION: 60,          // frames to show PERFECT / MISS text
        TEXT_SIZE: 24,
        TEXT_OFFSET_Y: 20,
        INDICATOR_OFFSET_Y: 50,
        INDICATOR_ANIM_SPEED: 0.1,    // speed of the bouncing serve arrow (radians per frame)
        INDICATOR_ANIM_AMP: 5,        // pixel amplitude of the bouncing serve arrow
        INDICATOR_WIDTH: 10,
        INDICATOR_HEIGHT: 15
    },

    MAPS: [
        { name: "Polar", bgPath: "assets/images/bg_polar_1.png", courtPath: "assets/images/bg_stadium.png" },
        { name: "Egypt", bgPath: "assets/images/bg_egypt_1.png", courtPath: "assets/images/bg_stadium.png" },
        { 
            name: "Hard Court", 
            bgPath: "assets/images/bg_hardcourt_1.png", 
            courtPath: "assets/images/bg_stadium.png" 
        }
    ],

    CHARACTERS: [
        {
            name: "Cat",
            charName: "cat",
            speed: 8,
            skillType: 'SHADOW_TELEPORT',
            assets: {
                front: 'assets/images/player_cat_swing_front_2.png',
                back: 'assets/images/player_cat_swing_back.png',
                portrait: 'assets/images/player_cat_front.png'
            }
        },
        {
            name: "Dog",
            charName: "dog",
            speed: 8,
            skillType: 'GIGA_BALL',
            assets: {
                front: 'assets/images/player_dog_swing_front.png',
                back: 'assets/images/player_dog_swing_back.png',
                portrait: 'assets/images/player_dog_front.png'
            }
        },
        {
            name: "Deer",
            charName: "deer",
            speed: 8,
            skillType: 'FOREST_ZEN',
            assets: {
                front: 'assets/images/player_deer_swing_front.png',
                back: 'assets/images/player_deer_swing_back.png',
                portrait: 'assets/images/player_deer_front.png'
            }
        },
        {
            name: "Bird",
            charName: "bird",
            speed: 8,
            skillType: 'FEATHER_STORM',
            assets: {
                front: 'assets/images/player_bird_swing_front.png',
                back: 'assets/images/player_bird_swing_back.png',
                portrait: 'assets/images/player_bird_front.png'
            }
        },
    ],

    AI_LEVELS: {
        EASY: {
            speedMult: 0.6,     // ↑: AI moves faster
            reactionDelay: 11,  // ↓: AI reacts quicker to ball
            errorRange: 40,     // ↓: more accurate positioning
            prediction: 4       // ↑: better at predicting ball trajectory
        },
        NORMAL: {
            speedMult: 0.7,     // ↑: AI moves faster
            reactionDelay: 8,   // ↓: AI reacts quicker to ball
            errorRange: 25,     // ↓: more accurate positioning
            prediction: 7       // ↑: better at predicting ball trajectory
        },
        HARD: {
            speedMult: 0.8,     // ↑: AI moves faster
            reactionDelay: 5,   // ↓: AI reacts quicker to ball
            errorRange: 15,     // ↓: more accurate positioning
            prediction: 10      // ↑: better at predicting ball trajectory
        }
    },

    AI: {
        FIDGET_SPEED: 0.015,        // Speed of lateral sway while receiving | ↑: more side-to-side wobble
        HOME_X_DIVISOR: 4,          // Court ratio for receive home pos | ↑: stands closer to sideline
        RECEIVE_X_THRESHOLD: 70,    // ↑: AI starts moving to ball earlier (more responsive)
        RECEIVE_Y_THRESHOLD: 100,   // ↑: AI moves forward earlier after bounce
        SERVE_DELAY_MIN: 90,        // ↓: faster serves (less thinking time)
        SERVE_DELAY_MAX: 160,       // ↓: faster serves (less variation)
        SERVE_POS_PADDING: 10,      // ↑: AI positions farther from target serve spot
        SERVE_DIST_THRESHOLD: 20,   // ↑: AI tosses from farther away (sloppier serves)
        SERVE_SWING_Z_MIN: 10,      // Min z height to swing during serve | ↓: hits toss earlier
        SERVE_SWING_Z_MAX: 40,      // Max z height to swing during serve | ↑: more patient with high tosses
        SERVE_LINE_RATIO: 0.18,     // Service line position ratio from court top | ↑: service line moves back
        BOUNCE_DISTANCE: 140,       // Estimated Y distance ball travels after bounce | ↑: AI stands farther back
        MOVE_DEADZONE: 3,           // Minimum movement delta to apply motion | ↑: less micro-adjustments (more robotic)
        BOUNCE_DISTANCE_FACTOR: 0.5, // Multiplier for minimum bounce distance | ↑: AI keeps more distance on slow balls
        BOUNCE_POSITION_FACTOR: 0.45, // Factor for preferring net position | ↑: AI rushes net more aggressively
        RECEIVE_Y_FACTOR: 0.8,      // Factor for attacker Y positioning | ↑: attacker moves up even more
        NOISE_TIME_SCALE: 0.05,     // time scaling for standard prediction shaking
        WALL_NOISE_TIME_SCALE: 0.03, // time scaling for wall personality center shaking
        MOVE_FRICTION: 0.85,        // Default deceleration multiplier per frame (non-ice maps)
        MOVE_ACC_FACTOR: 0.22,      // Acceleration as a fraction of (speed × speedMult)
        DEADZONE_BRAKE_MULT: 0.5,   // Extra friction applied inside the movement deadzone to prevent shake
        VELOCITY_SNAP_THRESHOLD: 1  // Speed below which velocity is zeroed out
    },

    AI_PERSONALITIES: {
        // Default initialization values for constructor
        DEFAULT_INIT: {
            NOISE_OFFSET_MAX: 1000,       // random seed range for Perlin noise movement
            TARGET_X_FALLBACK: 450,       // used before layout is ready
            SKILL_USE_MIN_FRAMES: 60,     // earliest frame after cooldown ends that AI uses skill
            SKILL_USE_MAX_FRAMES: 300     // latest frame after cooldown ends that AI uses skill
        },

        // Basic personality (used as fallback)
        BASIC: {
            SKILL_USE_MIN_FRAMES: { EASY: 100, NORMAL: 60, HARD: 35 },
            SKILL_USE_MAX_FRAMES: { EASY: 360, NORMAL: 300, HARD: 180 },
            PROTECT_PROB: { EASY: 0.25, NORMAL: 0.35, HARD: 0.65, DEFAULT: 0.65 }
        },

        // Attacker personality: aggressive net play
        ATTACKER: {
            EASY: {
                CHOOSE_BASELINE_PROB: 0.52,         // ↑: retreats to baseline more often
                BASELINE_WHEN_BALL_DEEP_PROB: 0.78, // ↑: more likely to retreat when pressured
                DEEP_BALL_THRESHOLD: 0.42,          // ↑: considers ball "deep" from further up court
                PREFER_NET_PROB: 0.42,              // ↑: rushes net more aggressively
                NORMAL_NET_PROB: 0.18,              // ↑: default net aggression
                FRONT_COURT_RATIO: 0.26,            // ↑: plays farther back (safer)
                HIT_SAFE_COURT_RATIO: 0.16,         // ↑: willing to hit from deeper in court
                ANGLE_VX_MIN: 1.2,                  // ↑: minimum angle shot speed
                ANGLE_VX_MAX: 3,                    // ↑: maximum angle shot speed
                ANGLE_APPLY_PROB: 0.42,             // ↑: uses angle shots more often
                ANGLE_AIM_AWAY_PROB: 0.58,          // ↑: aims away from opponent more
                REPOSITION_MIN: 18,                 // ↓: faster repositioning
                REPOSITION_MAX: 34,                 // ↓: faster repositioning
                RETREAT_REPOSITION_MIN: 20,         // ↓: faster retreat speed
                RETREAT_REPOSITION_MAX: 40,         // ↓: faster retreat speed
                AFTER_HIT_RETREAT_PROB: 0.8,        // ↑: retreats after hitting more often
                AFTER_HIT_MIN: 22,                  // ↓: starts retreat sooner
                AFTER_HIT_MAX: 44                   // ↓: starts retreat sooner
            },
            NORMAL: {
                CHOOSE_BASELINE_PROB: 0.38,
                BASELINE_WHEN_BALL_DEEP_PROB: 0.66,
                DEEP_BALL_THRESHOLD: 0.35,
                PREFER_NET_PROB: 0.58,
                NORMAL_NET_PROB: 0.3,
                FRONT_COURT_RATIO: 0.29,
                HIT_SAFE_COURT_RATIO: 0.16,
                ANGLE_VX_MIN: 1.7,
                ANGLE_VX_MAX: 4.2,
                ANGLE_APPLY_PROB: 0.58,
                ANGLE_AIM_AWAY_PROB: 0.72,
                REPOSITION_MIN: 12,
                REPOSITION_MAX: 26,
                RETREAT_REPOSITION_MIN: 16,
                RETREAT_REPOSITION_MAX: 34,
                AFTER_HIT_RETREAT_PROB: 0.68,
                AFTER_HIT_MIN: 18,
                AFTER_HIT_MAX: 40
            },
            HARD: {
                CHOOSE_BASELINE_PROB: 0.28,
                BASELINE_WHEN_BALL_DEEP_PROB: 0.48,
                DEEP_BALL_THRESHOLD: 0.3,
                PREFER_NET_PROB: 0.72,
                NORMAL_NET_PROB: 0.42,
                FRONT_COURT_RATIO: 0.32,
                HIT_SAFE_COURT_RATIO: 0.18,
                ANGLE_VX_MIN: 2.2,
                ANGLE_VX_MAX: 5.5,
                ANGLE_APPLY_PROB: 0.72,
                ANGLE_AIM_AWAY_PROB: 0.82,
                REPOSITION_MIN: 8,
                REPOSITION_MAX: 18,
                RETREAT_REPOSITION_MIN: 12,
                RETREAT_REPOSITION_MAX: 24,
                AFTER_HIT_RETREAT_PROB: 0.55,
                AFTER_HIT_MIN: 12,
                AFTER_HIT_MAX: 26
            },
            DEFAULT: {
                CHOOSE_BASELINE_PROB: 0.25,
                BASELINE_WHEN_BALL_DEEP_PROB: 0.55,
                DEEP_BALL_THRESHOLD: 0.35,
                PREFER_NET_PROB: 0.75,
                NORMAL_NET_PROB: 0.45,
                FRONT_COURT_RATIO: 0.25,
                HIT_SAFE_COURT_RATIO: 0.16,
                ANGLE_VX_MIN: 1.5,
                ANGLE_VX_MAX: 4,
                ANGLE_APPLY_PROB: 0.55,
                ANGLE_AIM_AWAY_PROB: 0.7,
                REPOSITION_MIN: 12,
                REPOSITION_MAX: 26,
                RETREAT_REPOSITION_MIN: 16,
                RETREAT_REPOSITION_MAX: 34,
                AFTER_HIT_RETREAT_PROB: 0.55,
                AFTER_HIT_MIN: 18,
                AFTER_HIT_MAX: 40
            }
        },

        // Wall personality: defensive center play
        WALL: {
            EASY: {
                TRACK_RATIO: 0.55,           // ↑: follows ball more (drifts from center)
                CENTER_JITTER: 32,          // ↓: less random positioning (more robotic)
                RETURN_SPREAD: 42,          // ↓: tighter shots to center
                RETURN_CLAMP_SCALE: 0.64    // ↑: takes more risk (shots closer to lines)
            },
            NORMAL: {
                TRACK_RATIO: 0.65,
                CENTER_JITTER: 22,
                RETURN_SPREAD: 26,
                RETURN_CLAMP_SCALE: 0.74
            },
            HARD: {
                TRACK_RATIO: 0.82,
                CENTER_JITTER: 10,
                RETURN_SPREAD: 14,
                RETURN_CLAMP_SCALE: 0.82
            },
            DEFAULT: {
                TRACK_RATIO: 0.65,
                CENTER_JITTER: 18,
                RETURN_SPREAD: 26,
                RETURN_CLAMP_SCALE: 0.72
            }
        },

        // Wide personality: extreme angle shots
        WIDE: {
            EASY: {
                AIM_AWAY_PROB: 0.35,    // ↑: aims away from opponent more
                APPLY_PROB: 0.25,       // ↑: uses wide shots more frequently
                SPREAD_RATIO_MIN: 0.3,  // Minimum lerp ratio towards the boundary line
                SPREAD_RATIO_MAX: 0.65  // Maximum lerp ratio towards the boundary line
            },
            NORMAL: {
                AIM_AWAY_PROB: 0.40,
                APPLY_PROB: 0.30,
                SPREAD_RATIO_MIN: 0.3,
                SPREAD_RATIO_MAX: 0.65
            },
            HARD: {
                AIM_AWAY_PROB: 0.50,
                APPLY_PROB: 0.65,
                SPREAD_RATIO_MIN: 0.5,
                SPREAD_RATIO_MAX: 0.75
            },
            DEFAULT: {
                AIM_AWAY_PROB: 0.7,
                APPLY_PROB: 0.65,
                SPREAD_RATIO_MIN: 0.5,
                SPREAD_RATIO_MAX: 0.85
            }
        }
    }
};if (typeof module !== 'undefined' && module.exports) { module.exports = GAME_CONFIG; }
