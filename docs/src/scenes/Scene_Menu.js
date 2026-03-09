const Scene_Menu = {
    selectedIndex: 0,
    options: [
        { label: "Single Player", state: 'CHAR_SELECT', multi: false },
        { label: "Multi Player", state: 'CHAR_SELECT', multi: true },
        { label: "Tutorial", state: 'TUTORIAL', multi: false }
    ],
    btnW: 300,
    btnH: 36,
    baseDepth: 10,
    spacing: 75,
    
    draw: function () {
    if (!layout) return;

    if (bgImg){
        image(bgImg, 0, 0, width, height);
    }
    else{
        background(250);
    }

    noSmooth();
    let blink = frameCount % 60 < 30;

    // Title
    push();
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(70);
    let titleX = 200;
    let titleY = 60;

    stroke(56, 49, 78);
    strokeWeight(12);
    fill(0);
    text("TENNIS GAME", titleX + 6, titleY + 6);
    
    stroke(64, 57, 85);
    strokeWeight(12);
    fill(80);
    text("TENNIS GAME", titleX + 3, titleY + 3);
    
    stroke(51, 44, 74);
    strokeWeight(12);
    fill(255, 188, 31);
    text("TENNIS GAME", titleX, titleY);
    pop();

    // Menu
    push();
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    let menuLeftX = 250;
    let menuBaseY = height - 525;

    for (let i = 0; i < this.options.length; i++) {

        let x = menuLeftX;
        let y = menuBaseY + (i * 65);

        let isHovered =
            mouseX > x &&
            mouseX < x + this.btnW &&
            mouseY > y - this.btnH / 2 &&
            mouseY < y + this.btnH / 2;

        if (isHovered) this.selectedIndex = i;

        if (i === this.selectedIndex && blink) {
            textSize(17);
            stroke(51, 44, 74);
            strokeWeight(10);
            fill(250);
            text("▶", x - 40, y);
        }

        textSize(38);
        stroke(51, 44, 74);
        strokeWeight(10);
        fill(250);
        text(this.options[i].label.toUpperCase(), x, y);
    }
    pop();
    },



    handleInput: function () {
        if (keyCode === UP_ARROW) {
            this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
        } else if (keyCode === DOWN_ARROW) {
            this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
        } else if (keyCode === ENTER) {
            this.confirmSelection();
        }
    },

    handleMouse: function () {
        let menuLeftX = 250;
        let menuBaseY = height - 525;

        for (let i = 0; i < this.options.length; i++) {
            let x = menuLeftX;
            let y = menuBaseY + (i * 65);

            let isHovered = (mouseX > x && mouseX < x + this.btnW &&
                mouseY > y - this.btnH / 2 && mouseY < y + this.btnH / 2);

            if (isHovered) {
                this.selectedIndex = i;
                this.confirmSelection();
                return;
            }
        }
    },

    confirmSelection: function () {
        let choice = this.options[this.selectedIndex];
        isMultiplayer = choice.multi;
        currentState = GAME_CONFIG.STATES[choice.state];
    }
};