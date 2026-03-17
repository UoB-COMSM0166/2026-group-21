let player, opponent, ball, layout;
let courtImg, backgroundImg;
let scoreManager;
let currentState = GAME_CONFIG.STATES.MENU;
let isMultiplayer = false;
let selectedCharacter = 0;
let selectedMap = 0;
let p1CharIndex = -1; 
let p2CharIndex = -1;
let opponentAI;
let characterImages = [];
let tutorialManager;
let mapImages = [];
const STATES = GAME_CONFIG.STATES;

function preload() {
    courtImg = loadImage(GAME_CONFIG.ASSETS.COURT_IMG);
    backgroundImg = loadImage(GAME_CONFIG.ASSETS.BACKGROUND_IMG);
    bgImg = loadImage(GAME_CONFIG.ASSETS.MENU_BG);
    escImg = loadImage(GAME_CONFIG.ASSETS.ESC_IMG);

    if (GAME_CONFIG.ASSETS.MAP_IMGS) {
        GAME_CONFIG.ASSETS.MAP_IMGS.forEach((path, index) => {
            mapImages[index] = loadImage(path);
        });
    }
    
    // preload every character's sprite images
    GAME_CONFIG.CHARACTERS.forEach((char, index) => {
        characterImages[index] = {};
        if (char.assets) {
            if (char.assets.front) characterImages[index].front = loadImage(char.assets.front);
            if (char.assets.back) characterImages[index].back = loadImage(char.assets.back);
            if (char.assets.portrait) {
                characterImages[index].portrait = loadImage(char.assets.portrait);
            }
        }
    });
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    layout = new LayoutManager();
    player = new Player(layout.sideRight, null, true);
    opponent = new Player(layout.sideLeft, null, false);
    opponentAI = new AI(opponent);
    ball = new Ball();
    scoreManager = new ScoreManager();
    ball.reset(player.x, player.y, 'PLAYER');
}

function draw() {
    background(GAME_CONFIG.COLORS.WHITE);
    switch (currentState) {
        case STATES.MENU:        Scene_Menu.draw();       break;
        case STATES.CHAR_SELECT: Scene_CharSelect.draw(); break;
        case STATES.MAP_SELECT:  Scene_MapSelect.draw();  break;
        case STATES.PLAYING:     Scene_Game.draw();       break;
        case STATES.PAUSED:      Scene_Pause.draw();      break;
        case STATES.TUTORIAL:    Scene_Tutorial.draw();   break;
        case STATES.DIFFICULTY_SELECT: Scene_DifficultySelect.draw(); break;

    }
}

function mousePressed() {
    switch (currentState) {
        case STATES.MENU:        Scene_Menu.handleMouse();       break;
        case STATES.CHAR_SELECT: Scene_CharSelect.handleMouse(); break;
        case STATES.MAP_SELECT:  Scene_MapSelect.handleMouse();  break;
        case STATES.PAUSED:      Scene_Pause.handleMouse();      break;
        case STATES.DIFFICULTY_SELECT: Scene_DifficultySelect.handleMouse(); break;
    }
}

function keyPressed() {
    switch (currentState) {
        case STATES.MENU:        Scene_Menu.handleInput();       break;
        case STATES.CHAR_SELECT: Scene_CharSelect.handleInput(); break;
        case STATES.MAP_SELECT:  Scene_MapSelect.handleInput();  break;
        case STATES.PLAYING:     Scene_Game.handleInput();       break;
        case STATES.TUTORIAL:    Scene_Tutorial.handleInput();   break;
        case STATES.PAUSED:      Scene_Pause.handleInput();      break;
        case STATES.DIFFICULTY_SELECT: Scene_DifficultySelect.handleInput(); break;
    }
}
// handle window resizing
function windowResized() {
    //calculate relative positions before resizing
    let relP = player.relativePos;
    let relO = opponent.relativePos;
    let relB = ball.relativePos;
    //resize canvas and caculate layout boundaries
    resizeCanvas(windowWidth, windowHeight);
    layout.update();
    //remap objects positions to the new position
    player.reposition(relP, layout);
    opponent.reposition(relO, layout);
    ball.reposition(relB, layout);
}