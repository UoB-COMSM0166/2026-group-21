const Scene_Menu = {
    selectedIndex: 0,
    options: [
        { label: "Single Player", state: 'CHAR_SELECT', multi: false },
        { label: "Multi Player", state: 'CHAR_SELECT', multi: true },
        { label: "Tutorial", state: 'TUTORIAL', multi: false }
    ],
    btnW: 300,
    btnH: 40,
    draw: function () {
        const { centerX, centerY } = layout;
        textAlign(CENTER, CENTER);

        fill(0);
        textSize(48);
        text("Tennis Game", centerX, centerY - 120);

        textSize(24);
        for (let i = 0; i < this.options.length; i++) {
            let x = centerX;
            let y = centerY + (i * 60);

            let isHovered = (mouseX > x - this.btnW / 2 && mouseX < x + this.btnW / 2 &&
                mouseY > y - this.btnH / 2 && mouseY < y + this.btnH / 2);

            if (isHovered) this.selectedIndex = i;

            if (i === this.selectedIndex) {
                fill(0);
                rectMode(CENTER);
                noFill();
                stroke(0);
                rect(x, y, this.btnW, this.btnH, 5);
                noStroke();
                fill(0);
            } else {
                fill(200);
            }

            text(this.options[i].label, x, y);
        }
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
        const { centerX, centerY } = layout;
        for (let i = 0; i < this.options.length; i++) {
            let x = centerX;
            let y = centerY + (i * 60);
            let isHovered = (mouseX > x - this.btnW / 2 && mouseX < x + this.btnW / 2 &&
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