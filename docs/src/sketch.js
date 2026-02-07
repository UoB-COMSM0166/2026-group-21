let player, opponent, ball;
let playerImg, backgroundImg;

let currentServer = 'PLAYER';
let currentSide = 'RIGHT';

const COURT_LEFT = 375;
const COURT_RIGHT = 825;
const COURT_TOP = 50;
const COURT_BOTTOM = 625;

const SIDE_LEFT = 450;
const SIDE_RIGHT = 750;

function preload() {
    playerImg = loadImage('assets/images/playertest.png');
    backgroundImg = loadImage('assets/images/backgroudtest.png');
}

function setup() {
    createCanvas(1200, 675);
    player = new Player(SIDE_RIGHT, playerImg, true);
    opponent = new Player(SIDE_LEFT, playerImg, false);
    ball = new Ball();
    let tossOffset = 50;
    ball.reset(player.x, player.y - tossOffset, 'PLAYER');
}

function draw() {
    image(backgroundImg, 0, 0, 1200, 675);

    player.update(COURT_LEFT, COURT_RIGHT);
    player.display();
    opponent.update(COURT_LEFT, COURT_RIGHT);
    opponent.display();

    ball.update(COURT_TOP, COURT_BOTTOM);
    ball.checkHit(player);
    ball.checkHit(opponent);
    ball.display();
}

function keyPressed() {
    if (keyCode === ENTER) {
        player.swing();
    }
    if (key === ' ') {
        opponent.swing();
    }
}

function nextRound() {
    currentServer = (currentServer === 'PLAYER') ? 'OPPONENT' : 'PLAYER';
    currentSide = (currentSide === 'RIGHT') ? 'LEFT' : 'RIGHT';

    let serverX = (currentSide === 'RIGHT') ? SIDE_RIGHT : SIDE_LEFT;
    let receiverX = (currentSide === 'RIGHT') ? SIDE_LEFT : SIDE_RIGHT;
    let tossOffset = 50; 

    if (currentServer === 'PLAYER') {
        player.x = serverX;
        opponent.x = receiverX;
        ball.reset(player.x, player.y - tossOffset, 'PLAYER');
    } else {
        opponent.x = serverX;
        player.x = receiverX;
        ball.reset(opponent.x, opponent.y - tossOffset, 'OPPONENT');
    }
}