let player, opponent, ball, layout;
let playerImg, opponentImg, courtImg;
let currentServer = GAME_CONFIG.MATCH.DEFAULT_SERVER;
let currentSide = GAME_CONFIG.MATCH.DEFAULT_SIDE;

function preload() {
    playerImg = loadImage(GAME_CONFIG.ASSETS.PLAYER_IMG);
    opponentImg = loadImage(GAME_CONFIG.ASSETS.OPPONENT_IMG);
    courtImg = loadImage(GAME_CONFIG.ASSETS.COURT_IMG);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    layout = new LayoutManager();
    player = new Player(layout.sideRight, playerImg, true);
    opponent = new Player(layout.sideLeft, opponentImg, false);
    ball = new Ball();
    ball.reset(player.x, player.y, 'PLAYER');
}

function draw() {
    background(GAME_CONFIG.COLORS.COURT_BG);
    imageMode(CORNER);
    image(courtImg, layout.courtLeft, layout.courtTop, layout.COURT_W, layout.COURT_H);
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
    if (keyCode === GAME_CONFIG.CONTROLS.PLAYER_ACTION) {
        if (currentServer === 'PLAYER' && ball.isWaiting) {
            ball.toss();
        } else {
            player.swing();
        }
    }
    if (keyCode === GAME_CONFIG.CONTROLS.OPPONENT_ACTION) {
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
    let serverX = (currentSide === 'RIGHT') ? layout.sideRight : layout.sideLeft;
    let receiverX = (currentSide === 'RIGHT') ? layout.sideLeft : layout.sideRight;

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

// handle window resizing
function windowResized() {
    //calculate relative positions before resizing
    let relP = player.getRelativePos(layout);
    let relO = opponent.getRelativePos(layout);
    let relB = ball.getRelativePos(layout);
    //resize canvas and caculate layout boundaries
    resizeCanvas(windowWidth, windowHeight);
    layout.update();
    //remap objects positions to the new position
    player.reposition(relP, layout);
    opponent.reposition(relO, layout);
    ball.reposition(relB, layout);
}