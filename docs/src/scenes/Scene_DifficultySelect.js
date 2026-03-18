const Scene_DifficultySelect = {
    difficulties: ["Easy", "Normal", "Hard"],
    imgConfigs: [
        { s: 1.1, yOff: -0.18 }, // Easy 
        { s: 1.1, yOff: -0.16 }, // Normal
        { s: 1.0, yOff: -0.20 }  // Hard
    ],
    boxColors: [
        [200, 30, 30],
        [255, 188, 31],
        [0, 102, 204]
    ],
    focusedIndex: 1, // default: Normal(Easy might be better)

    draw: function () {
        rectMode(CORNER);
        imageMode(CORNER);
        noStroke();

        if (!layout) return;
        const { centerX, centerY } = layout;
        const w = width;
        const h = height;

        // Background
        if (bgImg) {
            imageMode(CORNER);
            image(bgImg, 0, 0, w, h);
        }
        rectMode(CORNER);
        fill(255, 220);
        noStroke();
        rect(0, 0, w, h);

        // ESC
        push();
        const escSize = w * 0.06;
        const margin = 20;
        if (typeof escImg !== 'undefined' && escImg) {
            imageMode(CORNER);
            image(escImg, margin, margin, escSize, escSize);
        }
        pop();

        // Title
        push();
        textAlign(CENTER, CENTER);
        fill(255, 188, 31);
        stroke(51, 44, 74);
        strokeWeight(w * 0.008);
        textStyle(BOLD);
        textSize(w * 0.045);
        text("Select Difficulty", centerX, centerY - h * 0.32);
        pop();

        // Select Difficulty area
        let boxW = w * 0.25;
        let boxH = h * 0.52;
        let spacing = w * 0.28;

        let currentHoverId = -1;

        if (UIManager.isMouseOver(margin, margin, escSize, escSize, false)) {
            currentHoverId = 0;
        }

        for (let i = 0; i < this.difficulties.length; i++) {
            let x = centerX + (i - 1) * spacing;;
            let y = centerY + h * 0.08;

            let boxLeftX = x - (boxW / 2);

            if (UIManager.isMouseOver(boxLeftX, y, boxW, boxH, true)) {
                this.focusedIndex = i;
                currentHoverId = i + 1;
            }
            this.drawDifficultyBox(x, y, boxW, boxH, i);
        }
        UIManager.updateHoverSound(currentHoverId);
    },

    drawDifficultyBox: function (x, y, pW, pH, index) {
        const w = width;
        const isSelected = (this.focusedIndex === index);
        const config = this.imgConfigs[index];

        push();
        rectMode(CENTER);

        // Shadow
        if (!isSelected) {
            noStroke();
            fill(0, 160);
            rect(x + 12, y + 12, pW, pH, 15);
        }

        // Colours
        stroke(0);
        strokeWeight(isSelected ? w * 0.015 : w * 0.006);
        let col = this.boxColors[index];
        fill(col[0], col[1], col[2]);
        rect(x, y, pW, pH, 15);

        // Pictures
        if (typeof difficultyImages !== 'undefined' && difficultyImages[index]) {
            let img = difficultyImages[index];
            let aspectRatio = img.height / img.width;

            let displayW = pW * config.s;
            let displayH = displayW * aspectRatio;

            let imgY = y + (pH * config.yOff);

            imageMode(CENTER);
            image(img, x, imgY, displayW, displayH);
        }

        // Easy/ Normal/ Hard
        fill(255);
        stroke(0);
        strokeWeight(w * 0.009);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        textSize(pW * 0.18);
        text(this.difficulties[index], x, y + pH * 0.22);

        // Selected status
        if (isSelected) {
            let pulseAlpha = 180 + sin(frameCount * 0.1) * 75;
            noFill();
            stroke(255, 255, 255, pulseAlpha);
            strokeWeight(w * 0.012);
            rect(x, y, pW + 15, pH + 15, 20);
        }
        pop();
    },

    handleInput: function () {
        if (keyCode === ESCAPE) {
            this.goBack();
            return;
        }
        if (keyCode === LEFT_ARROW) {
            if (soundManager) soundManager.play('select');
            this.focusedIndex = (this.focusedIndex - 1 + this.difficulties.length) % this.difficulties.length;
        } else if (keyCode === RIGHT_ARROW) {
            if (soundManager) soundManager.play('select');
            this.focusedIndex = (this.focusedIndex + 1) % this.difficulties.length;
        } else if (keyCode === ENTER) {
            this.confirmSelection();
        }
    },

    handleMouse: function () {
        const { centerX, centerY } = layout;
        const w = width;
        const h = height;
        const escSize = w * 0.06;
        const margin = 20;

        // ESC
        if (UIManager.isMouseOver(margin, margin, escSize, escSize, false)) {
            this.goBack();
            return;
        }

        let boxW = w * 0.25;
        let boxH = h * 0.52;
        let spacing = w * 0.28;

        for (let i = 0; i < this.difficulties.length; i++) {
            let x = centerX + (i - 1) * spacing;
            let y = centerY + h * 0.08;
            let boxLeftX = x - (boxW / 2);
            if (UIManager.isMouseOver(boxLeftX, y, boxW, boxH, true)) {
                this.focusedIndex = i;
                this.confirmSelection();
                return;
            }
        }
    },

    confirmSelection: function () {
        if (soundManager) soundManager.play('confirm');
        selectedDifficulty = this.difficulties[this.focusedIndex].toUpperCase();
        currentState = GAME_CONFIG.STATES.MAP_SELECT;
    },

    goBack: function () {
        if (!isMultiplayer) {
            p1CharIndex = -1;
        }
        p2CharIndex = -1;
        currentState = GAME_CONFIG.STATES.CHAR_SELECT;
    }
};