const Scene_Pause = {
    selectedIndex: 0,
    options: ["Resume", "Main Menu"],
    btnW: 200,
    btnH: 50,

    draw: function() {
        fill(0, 0, 0, 150);
        rectMode(CORNER);
        rect(0, 0, width, height);

        const { centerX, centerY } = layout;
        textAlign(CENTER, CENTER);
        
        fill(255);
        textSize(48);
        text("PAUSED", centerX, centerY - 80);

        textSize(24);
        for (let i = 0; i < this.options.length; i++) {
            let x = centerX;
            let y = centerY + (i * 70);

            let isHovered = (mouseX > x - this.btnW/2 && mouseX < x + this.btnW/2 &&
                             mouseY > y - this.btnH/2 && mouseY < y + this.btnH/2);
            if (isHovered) this.selectedIndex = i;

            push();
            if (i === this.selectedIndex) {
                fill(255, 255, 0);
                stroke(255, 255, 0);
                strokeWeight(2);
                noFill();
                rectMode(CENTER);
                rect(x, y, this.btnW, this.btnH, 10);
                fill(255, 255, 0);
                noStroke();
            } else {
                fill(200);
            }
            text(this.options[i], x, y);
            pop();
        }
    },

    handleInput: function() {
        if (keyCode === UP_ARROW) {
            this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
        } else if (keyCode === DOWN_ARROW) {
            this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
        } else if (keyCode === ENTER) {
            this.confirmSelection();
        } else if (keyCode === ESCAPE) {
            currentState = GAME_CONFIG.STATES.PLAYING;
        }
    },

    handleMouse: function() {
        const { centerX, centerY } = layout;
        for (let i = 0; i < this.options.length; i++) {
            let x = centerX;
            let y = centerY + (i * 70);
            if (mouseX > x - this.btnW/2 && mouseX < x + this.btnW/2 &&
                mouseY > y - this.btnH/2 && mouseY < y + this.btnH/2) {
                this.selectedIndex = i;
                this.confirmSelection();
            }
        }
    },

    confirmSelection: function() {
        if (this.selectedIndex === 0) {
            currentState = GAME_CONFIG.STATES.PLAYING;
        } else {
            p1CharIndex = -1;
            p2CharIndex = -1;
            currentState = GAME_CONFIG.STATES.MENU;
        }
    }
};