let player, opponent, ball, layout;
let playerImg, opponentImg, courtImg, backgroundImg;
let scoreManager;

function preload() {
    playerImg = loadImage(GAME_CONFIG.ASSETS.PLAYER_IMG);
    opponentImg = loadImage(GAME_CONFIG.ASSETS.OPPONENT_IMG);
    courtImg = loadImage(GAME_CONFIG.ASSETS.COURT_IMG);
    backgroundImg = loadImage(GAME_CONFIG.ASSETS.BACKGROUND_IMG);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    layout = new LayoutManager();
    player = new Player(layout.sideRight, playerImg, true);
    opponent = new Player(layout.sideLeft, opponentImg, false);
    ball = new Ball();
    scoreManager = new ScoreManager();
    ball.reset(player.x, player.y, 'PLAYER');
}

function draw() {
    strokeWeight(GAME_CONFIG.VISUALS.BASE_STROKE_WEIGHT); 
    stroke(GAME_CONFIG.COLORS.BLACK);
    background(backgroundImg);
    imageMode(CORNER);
    image(courtImg, layout.courtLeft, layout.courtTop, layout.COURT_W, layout.COURT_H);
    if (scoreManager.isMatchOver) {
        scoreManager.displayGameOver();
        return;
    }
    player.update();
    player.display();
    opponent.update();
    opponent.display();
    ball.update();
    ball.checkHit(player);
    ball.checkHit(opponent);
    ball.display();
    scoreManager.display();
}
// handle keyboard triggers for serving and swinging
function keyPressed() {
    const { CONTROLS } = GAME_CONFIG;
    if (scoreManager.isMatchOver) {
        if (key.toLowerCase() === CONTROLS.RESTART) {
            restartGame();
        }
        return;
    }
    if (keyCode === CONTROLS.PLAYER_ACTION) {
        if (scoreManager.currentServer === 'PLAYER' && ball.isWaiting) {
            ball.toss();
        } else {
            player.swing();
        }
    }
    if (keyCode === CONTROLS.OPPONENT_ACTION) {
        if (scoreManager.currentServer === 'OPPONENT' && ball.isWaiting) {
            ball.toss();
        } else {
            opponent.swing();
        }
    }
}

function restartGame() {
    scoreManager.init();
    nextRound();
}
// transition between rounds and switch service sides
function nextRound() {
    let serverX = (scoreManager.currentSide === 'RIGHT') ? layout.sideRight : layout.sideLeft;
    let receiverX = (scoreManager.currentSide === 'RIGHT') ? layout.sideLeft : layout.sideRight;

    if (scoreManager.currentServer === 'PLAYER') {
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