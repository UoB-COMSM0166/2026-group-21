const Scene_MapSelect = {
    mapNames: ["Polar", "Egypt", "?"],

    iconW: 180,
    iconH: 100,
    spacing: 30,

    draw: function () {
        const { centerX, centerY } = layout;

        push();
        textAlign(LEFT, TOP);
        fill(150);
        textSize(16);
        text("Press 'ESC' to Re-select Characters", 20, 20);
        pop();

        push();
        textAlign(CENTER, CENTER);
        fill(0);
        textSize(40);
        text("Select Tournament Map", centerX, centerY - 150);
        pop();

        let totalWidth = (this.mapNames.length * this.iconW) + ((this.mapNames.length - 1) * this.spacing);
        let startX = centerX - totalWidth / 2 + this.iconW / 2;

        rectMode(CENTER);

        for (let i = 0; i < this.mapNames.length; i++) {
            push();
            let x = startX + i * (this.iconW + this.spacing);
            let y = centerY;

            let isHovered = (mouseX > x - this.iconW / 2 && mouseX < x + this.iconW / 2 &&
                mouseY > y - this.iconH / 2 && mouseY < y + this.iconH / 2);
            if (isHovered) selectedMap = i;

            noFill();
            strokeWeight(3);
            rectMode(CENTER);
            if (i === selectedMap) {
                stroke(0, 255, 255);
                strokeWeight(4);
                fill(0, 255, 255, 30);
                rect(x, y, this.iconW, this.iconH, 10);
            } else {
                stroke(100);
                strokeWeight(2);
                fill(0);
                rect(x, y, this.iconW, this.iconH, 10);
            }

            fill(255);
            noStroke();
            textAlign(CENTER, CENTER);
            text(this.mapNames[i], x, y);
            pop();
        }

        push();
        fill(150);
        textSize(16);
        text("Arrows to Navigate, Enter to Start Match", centerX, centerY + 120);
        pop();
    },

    handleInput: function () {
        if (keyCode === ESCAPE) {
            this.goBack();
            return;
        }
        if (keyCode === LEFT_ARROW) {
            selectedMap = (selectedMap - 1 + this.mapNames.length) % this.mapNames.length;
        } else if (keyCode === RIGHT_ARROW) {
            selectedMap = (selectedMap + 1) % this.mapNames.length;
        } else if (keyCode === ENTER) {
            this.confirmSelection();
        }
    },

    handleMouse: function () {
        if (mouseX < 200 && mouseY < 50) {
            this.goBack();
            return;
        }

        const { centerX, centerY } = layout;
        let totalWidth = (this.mapNames.length * this.iconW) + ((this.mapNames.length - 1) * this.spacing);
        let startX = centerX - totalWidth / 2 + this.iconW / 2;

        for (let i = 0; i < this.mapNames.length; i++) {
            let x = startX + i * (this.iconW + this.spacing);
            let y = centerY;

            let isOverMap = (mouseX > x - this.iconW / 2 && mouseX < x + this.iconW / 2 &&
                mouseY > y - this.iconH / 2 && mouseY < y + this.iconH / 2);

            if (isOverMap) {
                selectedMap = i;
                this.confirmSelection();
                return;
            }
        }
    },

    confirmSelection: function () {
        Scene_Game.restartGame();
        Scene_Game.setup();
        currentState = GAME_CONFIG.STATES.PLAYING;
    },
    goBack: function () {
        p2CharIndex = -1;
        currentState = GAME_CONFIG.STATES.CHAR_SELECT;
    }
};