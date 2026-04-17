const Scene_MapSelect = {
    mapNames: ["Polar", "Egypt", "Wimbledon"],
    mapEffects: [
        "Polar: Characters frozen every 30s",
        "Egypt: Sandstorm obscures vision every 30s",
        "Wimbledon: Classic tournament rules"
    ],
    iconW: 180,
    iconH: 100,
    spacing: 30,

    draw: function () {
        rectMode(CORNER);
        imageMode(CORNER);
        noStroke();

        if (!layout) return;
        const w = width;
        const h = height;
        const centerX = w / 2;
        const centerY = h / 2;

        // Background
        if (bgImg) {
            imageMode(CORNER);
            image(bgImg, 0, 0, w, h);
        }
        rectMode(CORNER);
        fill(...GAME_CONFIG.COLORS.UI_PANEL_BG);
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
        fill(...GAME_CONFIG.COLORS.GOLD);
        stroke(...GAME_CONFIG.COLORS.UI_STROKE_DARK);
        strokeWeight(w * 0.008);
        textStyle(BOLD);
        textSize(w * 0.045);
        text("Select Tournament Map", centerX, centerY - h * 0.3);
        pop();

        // Map preview area
        let pW = w * 0.4;
        let pH = h * 0.5;
        let triSize = w * 0.012;
        let yPos = centerY + h * 0.05;
        let currentHoverId = -1;

        let leftArrowX = centerX - pW / 2 - triSize * 3;
        let rightArrowX = centerX + pW / 2 + triSize * 3;
        let arrowHitSize = triSize * 5;

        let leftArrowLeftX = leftArrowX - (arrowHitSize / 2);
        let rightArrowLeftX = rightArrowX - (arrowHitSize / 2);
        let boxLeftX = centerX - (pW / 2);

        if (UIManager.isMouseOver(margin, margin, escSize, escSize, false)) {
            currentHoverId = 0;
        }

        let isLeftHovered = UIManager.isMouseOver(leftArrowLeftX, yPos, arrowHitSize, arrowHitSize, true);
        if (isLeftHovered) currentHoverId = 1;

        let isRightHovered = UIManager.isMouseOver(rightArrowLeftX, yPos, arrowHitSize, arrowHitSize, true);
        if (isRightHovered) currentHoverId = 2;

        let isBoxHovered = UIManager.isMouseOver(boxLeftX, yPos, pW, pH, true);
        if (isBoxHovered) currentHoverId = 3;

        UIManager.updateHoverSound(currentHoverId);

        this.drawPreviewArea(centerX, yPos, pW, pH, triSize, isLeftHovered, isRightHovered);
    },

    drawPreviewArea: function (x, y, pW, pH, triSize, isLeftHovered, isRightHovered) {
        const w = width;
        const h = height;

        this.drawArrowButton(x - pW / 2 - triSize * 3, y, "LEFT", triSize, isLeftHovered);
        this.drawArrowButton(x + pW / 2 + triSize * 3, y, "RIGHT", triSize, isRightHovered);

        push();
        rectMode(CENTER);

        // Preview area
        noFill();
        stroke(...GAME_CONFIG.COLORS.BLACK);
        strokeWeight(width * 0.013);
        rect(x, y, pW, pH, 15);

        stroke(...GAME_CONFIG.COLORS.GOLD);
        strokeWeight(width * 0.005);
        fill(...GAME_CONFIG.COLORS.TEXT_ERROR);
        rect(x, y, pW, pH, 15);

        // Picture
        let imgAreaW = pW * 0.88;
        let imgAreaH = pH * 0.58;
        let imgY = y - pH * 0.12;

        stroke(GAME_CONFIG.COLORS.MENU_BG_DARK);
        strokeWeight(1);
        fill(GAME_CONFIG.COLORS.MENU_BG_LIGHT);
        rect(x, imgY, imgAreaW, imgAreaH, 5);

        if (typeof mapImages !== 'undefined' && mapImages[selectedMap]) {
            imageMode(CENTER);
            image(mapImages[selectedMap].preview, x, imgY, imgAreaW, imgAreaH);
        } else {
            noStroke();
            fill(180);
            textAlign(CENTER, CENTER);
            textSize(pW * 0.04);
            text("( Map Image Preview )", x, imgY);
        }

        push();
        rectMode(CENTER);
        noFill();
        stroke(...GAME_CONFIG.COLORS.BLACK);
        strokeWeight(width * 0.003);
        rect(x, imgY, imgAreaW, imgAreaH, 5);
        pop();

        // Map Name
        fill(...GAME_CONFIG.COLORS.GOLD);
        stroke(...GAME_CONFIG.COLORS.BLACK);
        strokeWeight(w * 0.005);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        textSize(pW * 0.08);
        text(this.mapNames[selectedMap], x, y + pH * 0.28);

        // Map Effects Description
        fill(...GAME_CONFIG.COLORS.GOLD);
        stroke(...GAME_CONFIG.COLORS.BLACK);
        strokeWeight(w * 0.002);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        textSize(pW * 0.035);
        text(this.mapEffects[selectedMap], x, y + pH * 0.42);
        pop();

    },

    drawArrowButton: function (x, y, direction, size, isHovered) {
        let scaleFactor = isHovered ? 1.2 : 1.0;
        let s = size * scaleFactor;

        push();
        stroke(...GAME_CONFIG.COLORS.BLACK);
        strokeWeight(width * 0.004);
        fill(...GAME_CONFIG.COLORS.BLACK);
        this.drawTriangleShape(x, y, direction, s);

        stroke(...GAME_CONFIG.COLORS.BLACK);
        strokeWeight(width * 0.003);
        fill(...GAME_CONFIG.COLORS.GOLD);
        this.drawTriangleShape(x, y, direction, s);
        pop();
    },

    drawTriangleShape: function (x, y, direction, s) {
        if (direction === "LEFT") {
            triangle(x - s, y, x + s * 0.5, y - s, x + s * 0.5, y + s);
        } else {
            triangle(x + s, y, x - s * 0.5, y - s, x - s * 0.5, y + s);
        }
    },

    handleInput: function () {
        if (keyCode === ESCAPE) this.goBack();
        if (keyCode === LEFT_ARROW) this.changeMap(-1);
        if (keyCode === RIGHT_ARROW) this.changeMap(1);
        if (keyCode === ENTER) this.confirmSelection();
    },

    handleMouse: function () {
        const w = width;
        const h = height;
        const centerX = w / 2;
        const centerY = h / 2;
        const escSize = w * 0.06;
        const margin = 20;

        let pW = w * 0.4;
        let pH = h * 0.5;
        let triSize = w * 0.015;
        let yPos = centerY + h * 0.05;

        let leftArrowX = centerX - pW / 2 - triSize * 3;
        let rightArrowX = centerX + pW / 2 + triSize * 3;
        let arrowHitSize = triSize * 5;

        let leftArrowLeftX = leftArrowX - (arrowHitSize / 2);
        let rightArrowLeftX = rightArrowX - (arrowHitSize / 2);
        let boxLeftX = centerX - (pW / 2);

        if (UIManager.isMouseOver(margin, margin, escSize, escSize, false)) {
            this.goBack();
            return;
        }

        if (UIManager.isMouseOver(leftArrowLeftX, yPos, arrowHitSize, arrowHitSize, true)) {
            this.changeMap(-1);
            return;
        }

        if (UIManager.isMouseOver(rightArrowLeftX, yPos, arrowHitSize, arrowHitSize, true)) {
            this.changeMap(1);
            return;
        }
        
        if (UIManager.isMouseOver(boxLeftX, yPos, pW, pH, true)) {
            this.confirmSelection();
            return;
        }
    },

    changeMap: function (dir) {
        if (soundManager) soundManager.play('select');
        selectedMap = (selectedMap + dir + this.mapNames.length) % this.mapNames.length;
    },

    confirmSelection: function () {
        if (soundManager) soundManager.play('confirm');
        Scene_Game.setup();
        currentState = GAME_CONFIG.STATES.PLAYING;
    },

    goBack: function () {
        if (soundManager) soundManager.play('confirm');
        if (!isMultiplayer) {
            currentState = GAME_CONFIG.STATES.DIFFICULTY_SELECT;
        } else {
            p2CharIndex = -1;
            currentState = GAME_CONFIG.STATES.CHAR_SELECT;
        }
    }
};