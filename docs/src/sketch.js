let player, opponent, ball;
let playerImg, opponentImg, courtImg;
let COURT_LEFT, COURT_RIGHT, COURT_TOP, COURT_BOTTOM, NET_Y;
let SIDE_LEFT, SIDE_RIGHT;
let currentServer = 'PLAYER';
let currentSide = 'RIGHT';
const FIXED_COURT_W = 450;
const FIXED_COURT_H = 575;
//movement padding to allow players to move beyond the visual court lines
const MOVE_PADDING_X = 150;
const MOVE_PADDING_Y = 100;

function preload() {
    playerImg = loadImage('assets/images/player_bird_back.png');
    opponentImg = loadImage('assets/images/player_cat_front.png');
    courtImg = loadImage('assets/images/stadiumtest.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    updateDimensions(); //calculate layout before spawning objects
    player = new Player(SIDE_RIGHT, playerImg, true);
    opponent = new Player(SIDE_LEFT, opponentImg, false);
    ball = new Ball();
    ball.reset(player.x, player.y, 'PLAYER');
}

function draw() {
    background(255, 255, 255);
    imageMode(CORNER);
    image(courtImg, COURT_LEFT, COURT_TOP, FIXED_COURT_W, FIXED_COURT_H);
    player.update();
    player.display();
    opponent.update();
    opponent.display();
    ball.update();
    ball.checkHit(player);
    ball.checkHit(opponent);
    ball.display();
}
// handle keyboard triggers for serving and swinging
function keyPressed() {
    if (keyCode === ENTER) {
        if (currentServer === 'PLAYER' && ball.isWaiting) {
            ball.toss();
        } else {
            player.swing();
        }
    }
    if (key === ' ') {
        if (currentServer === 'OPPONENT' && ball.isWaiting) {
            ball.toss();
        } else {
            opponent.swing();
        }
    }
}
// transition between rounds and switch service sides
function nextRound() {
    currentServer = (currentServer === 'PLAYER') ? 'OPPONENT' : 'PLAYER';
    currentSide = (currentSide === 'RIGHT') ? 'LEFT' : 'RIGHT';
    let serverX = (currentSide === 'RIGHT') ? SIDE_RIGHT : SIDE_LEFT;
    let receiverX = (currentSide === 'RIGHT') ? SIDE_LEFT : SIDE_RIGHT;

    if (currentServer === 'PLAYER') {
        player.resetPosition(serverX);
        opponent.resetPosition(receiverX);
        ball.reset(player.x, player.y, 'PLAYER');
    } else {
        opponent.resetPosition(serverX);
        player.resetPosition(receiverX);
        ball.reset(opponent.x, opponent.y, 'OPPONENT');
    }
}
//dynamically calculate court boundaries based on current window size
function updateDimensions() {
    // center the court horizontally
    COURT_LEFT = (width - FIXED_COURT_W) / 2;
    COURT_RIGHT = (width + FIXED_COURT_W) / 2;
    //put the court near the bottom of the window
    COURT_BOTTOM = height - 150;
    COURT_TOP = COURT_BOTTOM - FIXED_COURT_H;
    //net is in the middle of the court
    NET_Y = (COURT_TOP + COURT_BOTTOM) / 2;
    //serve positions relative to the court boundaries
    let outsideOffset = 30;
    SIDE_LEFT = COURT_LEFT + outsideOffset;
    SIDE_RIGHT = COURT_RIGHT - outsideOffset;
}
// handle window resizing
function windowResized() {
    //calculate relative positions before resizing
    let relPX = (player.x - COURT_LEFT) / FIXED_COURT_W;
    let relPY = (player.y - COURT_TOP) / FIXED_COURT_H;
    let relOX = (opponent.x - COURT_LEFT) / FIXED_COURT_W;
    let relOY = (opponent.y - COURT_TOP) / FIXED_COURT_H;
    let relBX = (ball.x - COURT_LEFT) / FIXED_COURT_W;
    let relBY = (ball.y - COURT_TOP) / FIXED_COURT_H;
    //resize canvas and caculate layout boundaries
    resizeCanvas(windowWidth, windowHeight);
    updateDimensions();
    //remap objects positions to the new position
    player.x = COURT_LEFT + relPX * FIXED_COURT_W;
    player.y = COURT_TOP + relPY * FIXED_COURT_H;
    opponent.x = COURT_LEFT + relOX * FIXED_COURT_W;
    opponent.y = COURT_TOP + relOY * FIXED_COURT_H;
    ball.x = COURT_LEFT + relBX * FIXED_COURT_W;
    ball.y = COURT_TOP + relBY * FIXED_COURT_H;
    //safe check for constrain character to valid movement zones
    player.x = constrain(player.x, COURT_LEFT - MOVE_PADDING_X, COURT_RIGHT + MOVE_PADDING_X);
    player.y = constrain(player.y, NET_Y + 20, COURT_BOTTOM + MOVE_PADDING_Y);
    opponent.x = constrain(opponent.x, COURT_LEFT - MOVE_PADDING_X, COURT_RIGHT + MOVE_PADDING_X);
    opponent.y = constrain(opponent.y, COURT_TOP - MOVE_PADDING_Y, NET_Y - 20);
}