const Scene_DifficultySelect = {
    difficulties: ["Easy", "Normal", "Hard"],
    focusedIndex: 1, // default: Normal(Easy might be better)

    draw: function () {
        const { centerX, centerY } = layout;
        textAlign(CENTER, CENTER);

        fill(0, 255, 255);
        textSize(32);
        text("Select Difficulty", centerX, centerY - 150);

        for (let i = 0; i < this.difficulties.length; i++) {
            let x = centerX;
            let y = centerY - 50 + i * 80;

            if (mouseX > x - 100 && mouseX < x + 100 &&
                mouseY > y - 25 && mouseY < y + 25) {
                this.focusedIndex = i;
            }

            rectMode(CENTER);
            noFill();
            strokeWeight(2);
            stroke(i === this.focusedIndex ? 0 : 100);
            rect(x, y, 200, 50, 10);

            fill(i === this.focusedIndex ? color(0, 255, 255) : 255);
            noStroke();
            textSize(22);
            text(this.difficulties[i], x, y);
        }

        fill(150);
        textSize(16);
        text("Use Arrows to Navigate, Enter to Confirm", centerX, centerY + 180);
        textAlign(LEFT, TOP);
        fill(150);
        textSize(16);
        text("Press 'ESC' to Go Back", 20, 20);
    },

    handleInput: function () {
        if (keyCode === ESCAPE) {
            this.goBack();
            return;
        }
        if (keyCode === UP_ARROW) {
            this.focusedIndex = (this.focusedIndex - 1 + this.difficulties.length) % this.difficulties.length;
        } else if (keyCode === DOWN_ARROW) {
            this.focusedIndex = (this.focusedIndex + 1) % this.difficulties.length;
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
        for (let i = 0; i < this.difficulties.length; i++) {
            let x = centerX;
            let y = centerY - 50 + i * 80;
            if (mouseX > x - 100 && mouseX < x + 100 &&
                mouseY > y - 25 && mouseY < y + 25) {
                this.focusedIndex = i;
                this.confirmSelection();
                return;
            }
        }
    },

    confirmSelection: function () {
        const levelKey = this.difficulties[this.focusedIndex].toUpperCase(); // "EASY" / "NORMAL" / "HARD"
        const levelConfig = GAME_CONFIG.AI_LEVELS[levelKey];

        // apply AI's difficulty 
        if (opponentAI) {
            opponentAI.difficulty = levelKey;
            opponentAI.speedMult    = levelConfig.speedMult;
            opponentAI.reactionDelay = levelConfig.reactionDelay;
            opponentAI.errorRange   = levelConfig.errorRange;
            opponentAI.prediction   = levelConfig.prediction;
        }

        currentState = GAME_CONFIG.STATES.MAP_SELECT;
    },

    goBack: function () {
        p2CharIndex = -1;
        currentState = GAME_CONFIG.STATES.CHAR_SELECT;
    }
};