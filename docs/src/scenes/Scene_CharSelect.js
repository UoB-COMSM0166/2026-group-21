const Scene_CharSelect = {
    charNames: ["Cat", "Dog", "Deer", "Bird", "?"],
    focusedIndex: 0,

    iconSize: 100,
    spacing: 20,

    draw: function () {
        const { centerX, centerY } = layout;
        textAlign(CENTER, CENTER);

        fill(0, 255, 255);
        textSize(32);
        if (p1CharIndex === -1) {
            text("Player 1: Select Your Character", centerX, centerY - 150);
        } else {
            text("Player 2: Select Your Character", centerX, centerY - 150);
        }

        let totalWidth = (this.charNames.length * this.iconSize) + ((this.charNames.length - 1) * this.spacing);
        let startX = centerX - totalWidth / 2 + this.iconSize / 2;

        for (let i = 0; i < this.charNames.length; i++) {
            push();
            let x = startX + i * (this.iconSize + this.spacing);
            let y = centerY;

            if (mouseX > x - this.iconSize / 2 && mouseX < x + this.iconSize / 2 &&
                mouseY > y - this.iconSize / 2 && mouseY < y + this.iconSize / 2) {
                this.focusedIndex = i;
            }

            rectMode(CENTER);
            noFill();
            strokeWeight(2);
            stroke(i === this.focusedIndex ? 0 : 100);
            rect(x, y, this.iconSize, this.iconSize, 10);

            fill(255);
            textSize(14);
            text(this.charNames[i], x, y);

            textSize(20);
            textStyle(BOLD);
            if (i === p1CharIndex) {
                fill(0);
                text("P1", x, y - this.iconSize / 2 - 20);
            }
            if (i === p2CharIndex) {
                fill(0, 255, 255);
                text("P2", x, y - this.iconSize / 2 - 20);
            }
            textStyle(NORMAL);
            pop();
        }

        fill(150);
        textSize(16);
        text("Use Arrows to Navigate, Enter to Confirm", centerX, centerY + 120);
        textAlign(LEFT, TOP);
        fill(150);
        textSize(16);
        text("Press 'ESC' or Click here to Go Back", 20, 20);
    },

    handleInput: function () {
        if (keyCode === ESCAPE) {
            this.goBack();
            return;
        }
        if (keyCode === LEFT_ARROW) {
            this.focusedIndex = (this.focusedIndex - 1 + this.charNames.length) % this.charNames.length;
        } else if (keyCode === RIGHT_ARROW) {
            this.focusedIndex = (this.focusedIndex + 1) % this.charNames.length;
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
        let totalWidth = (this.charNames.length * this.iconSize) + ((this.charNames.length - 1) * this.spacing);
        let startX = centerX - totalWidth / 2 + this.iconSize / 2;

        for (let i = 0; i < this.charNames.length; i++) {
            let x = startX + i * (this.iconSize + this.spacing);
            let y = centerY;

            if (mouseX > x - this.iconSize / 2 && mouseX < x + this.iconSize / 2 &&
                mouseY > y - this.iconSize / 2 && mouseY < y + this.iconSize / 2) {

                this.focusedIndex = i;
                this.confirmSelection();
                return;
            }
        }
    },

    confirmSelection: function () {
        if (p1CharIndex === -1) {
            p1CharIndex = this.focusedIndex;
        } else if (p2CharIndex === -1) {
            p2CharIndex = this.focusedIndex;
            this.applySelections();
            if (isMultiplayer) {
                currentState = GAME_CONFIG.STATES.MAP_SELECT;
            } else {
                currentState = GAME_CONFIG.STATES.DIFFICULTY_SELECT;
            }
        }
    },

    goBack: function () {
        if (p1CharIndex !== -1 && p2CharIndex === -1) {
            p1CharIndex = -1;
        } else {
            p1CharIndex = -1;
            p2CharIndex = -1;
            currentState = GAME_CONFIG.STATES.MENU;
        }
    },

    applySelections: function () {
        const p1Config = GAME_CONFIG.CHARACTERS[p1CharIndex];
        const p2Config = GAME_CONFIG.CHARACTERS[p2CharIndex];

        player.speed = p1Config.speed;
        player.skillType = p1Config.skillType;
        player.name = p1Config.name;

        opponent.speed = p2Config.speed;
        opponent.skillType = p2Config.skillType;
        opponent.name = p2Config.name;
        //apply selection to character's images
        if (characterImages[p1CharIndex] && characterImages[p1CharIndex].back) {
            player.img = characterImages[p1CharIndex].back;
        }
        if (characterImages[p2CharIndex] && characterImages[p2CharIndex].front) {
            opponent.img = characterImages[p2CharIndex].front;
        }
        player.isAI = false;
        opponent.isAI = !isMultiplayer;
    }
};