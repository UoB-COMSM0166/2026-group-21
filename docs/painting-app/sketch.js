let isDrawing = true;
let colour = 0;
let img;
const BLUE_MODE = 0;
const YELLOW_MODE = 1;
const ERASE_MODE = 2;
const CLEAR_MODE = 3;

//preload the image before the app starts
function preload() {
  img = loadImage('https://magicoloriage.com/wp-content/uploads/2024/09/Coloriage-Minion-avec-une-banane-600x600.jpg?crop=1');
}

function setup() {
  createCanvas(1000, 1000);
  
  //clear button
  let btnClear = createButton('Clear All');
  btnClear.position(10, 10);
  btnClear.mousePressed(() => buttonClicked(CLEAR_MODE));
  //blue button
  let btnRed = createButton('Blue Color');
  btnRed.position(10, 40);
  btnRed.style('background-color', 'blue');
  btnRed.style('color', 'white');
  btnRed.mousePressed(() => buttonClicked(BLUE_MODE));
  //yellow button
  let btnYellow = createButton('Yellow Color');
  btnYellow.position(10, 70);
  btnYellow.style('background-color', 'yellow');
  btnYellow.mousePressed(() => buttonClicked(YELLOW_MODE));
  //erase button
  let btnEraser = createButton('Eraser');
  btnEraser.position(10, 100);
  btnEraser.mousePressed(() => buttonClicked(ERASE_MODE));
  //initial the background and instructions
  drawElement();
}

//used for both initialization and clearing the canvas
function drawElement() {
  background(255);
  image(img, 200, 100);
  noStroke();
  fill(100);
  textSize(20);
  textStyle(BOLD);
  text("Click to paint; Double click (or press Eraser) to erase.", 220, 30);
  text("Use buttons on the left to change color.", 300, 60);
}

function draw() {
  if (mouseIsPressed) {
    if (isDrawing) {
      if (colour == BLUE_MODE) {
        stroke('blue');
      } else if (colour == YELLOW_MODE) {
        stroke('yellow');
      }
      strokeWeight(10);
      line(pmouseX, pmouseY, mouseX, mouseY);
    } else {
      stroke(255, 255, 255);
      strokeWeight(20);
      line(pmouseX, pmouseY, mouseX, mouseY);
    }
  }
}

function doubleClicked() {
  isDrawing = !isDrawing;
}

function buttonClicked(mode){
  if(mode == YELLOW_MODE){
    colour = 1;
    isDrawing = true;
  }else if(mode == BLUE_MODE){
    colour = 0;
    isDrawing = true;
  }else if(mode == ERASE_MODE){
    isDrawing = false;
  }else if(mode == CLEAR_MODE){
    drawElement();
  }
}
