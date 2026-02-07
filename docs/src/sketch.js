let player;
let opponent;
let playerImg;
let backgroundImg;

const COURT_LEFT = 375;
const COURT_RIGHT = 825;
const COURT_TOP = 50;
const COURT_BOTTOM = 625;


function preload() {
    playerImg = loadImage('assets/images/playertest.png');
    backgroundImg = loadImage('assets/images/backgroudtest.png');
}

function setup() {
    createCanvas(1200, 675);
    player = new Player(width / 2, playerImg, true);
    opponent = new Player(width / 2, playerImg, false);
}

function draw() {
    background(220);
    
    image(backgroundImg, 0, 0, 1200, 675);

    player.update(COURT_LEFT, COURT_RIGHT);
    player.display();

    opponent.update(COURT_LEFT, COURT_RIGHT);
    opponent.display();
}