const Scene_Menu = {
    selectedIndex: 0,
    options: [
        { label: "Single Player", state: 'CHAR_SELECT', multi: false },
        { label: "Multi Player", state: 'CHAR_SELECT', multi: true },
        { label: "Tutorial", state: 'TUTORIAL', multi: false }
    ],
    
    draw: function () {
    if (!layout) return;

    const w = width;
    const h = height;

    if (bgImg){
        image(bgImg, 0, 0, w, h);
    }
    else{
        background(250);
    }

    noSmooth();
    let blink = frameCount % 60 < 30;

    // Title
    push();
    let titleX = w * 0.15;
    let titleY = h * 0.12;
    let titleSize = w * 0.06;
    let strokeSize = titleSize * 0.15;
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(titleSize);

    stroke(56, 49, 78);
    strokeWeight(strokeSize);
    fill(0);
    text("TENNIS GAME", titleX + w * 0.005, titleY + w * 0.005);
    
    stroke(64, 57, 85);
    strokeWeight(strokeSize);
    fill(80);
    text("TENNIS GAME", titleX + w * 0.002, titleY + w * 0.002);
    
    stroke(51, 44, 74);
    strokeWeight(strokeSize);
    fill(255, 188, 31);
    text("TENNIS GAME", titleX, titleY);
    pop();

    // Menu
    push();
    let menuLeftX = w * 0.18;
    let menuBaseY = h * 0.35;
    let itemSpacing = h * 0.09;
    let menuFontSize = w * 0.027;
    textAlign(LEFT, CENTER);
    textStyle(BOLD);

    for (let i = 0; i < this.options.length; i++) {

        let x = menuLeftX;
        let y = menuBaseY + (i * itemSpacing);

        let btnW = w * 0.35;
        let btnH = menuFontSize * 1.2;

        let isHovered =
            mouseX > x &&
            mouseX < x + btnW &&
            mouseY > y - btnH / 2 &&
            mouseY < y + btnH / 2;

        if (isHovered) this.selectedIndex = i;

        if (i === this.selectedIndex && blink) {
            textSize(menuFontSize * 0.5);
            stroke(51, 44, 74);
            strokeWeight(w * 0.0075);
            fill(250);
            text("▶", x - w * 0.04, y);
        }

        textSize(menuFontSize);
        stroke(51, 44, 74);
        strokeWeight(w * 0.009);
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
        const w = width;
        const h = height;
        let menuLeftX = w * 0.18;
        let menuBaseY = h * 0.35;
        let itemSpacing = h * 0.09;
        let menuFontSize = w * 0.027;

        push();
        textSize(menuFontSize);
        textStyle(BOLD);

        for (let i = 0; i < this.options.length; i++) {
            let x = menuLeftX;
            let y = menuBaseY + (i * itemSpacing);

            let txt = this.options[i].label.toUpperCase();
            let realTxtWidth = textWidth(txt); 
            let btnH = menuFontSize;

            let isHovered = (mouseX > x && mouseX < x + realTxtWidth + 10 &&
                mouseY > y - btnH / 2 && mouseY < y + btnH / 2);

            if (isHovered) {
                this.selectedIndex = i;
                this.confirmSelection();
                pop();
                return;
            }
        }
        pop();
    },

    confirmSelection: function () {
        let choice = this.options[this.selectedIndex];
        isMultiplayer = choice.multi;
        currentState = GAME_CONFIG.STATES[choice.state];
        if (currentState === GAME_CONFIG.STATES.TUTORIAL) {
            Scene_Tutorial.setup();
        }
    }
};