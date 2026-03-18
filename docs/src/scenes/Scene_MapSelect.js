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
        fill(255, 200); 
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
        text("Select Tournament Map", centerX, centerY - h * 0.3); 
        pop();

        // Map preview area
        let pW = w * 0.4;
        let pH = h * 0.5;
        let triSize = w * 0.012;

        this.drawPreviewArea(centerX, centerY + h * 0.05, pW, pH, triSize);
    },

    drawPreviewArea: function (x, y, pW, pH, triSize) {
        const w = width;
        const h = height;

        this.drawArrowButton(x - pW / 2 - triSize * 3, y, "LEFT", triSize);
        this.drawArrowButton(x + pW / 2 + triSize * 3, y, "RIGHT", triSize);

        push();
        rectMode(CENTER);
        
        // Preview area
        noFill();
        stroke(0);
        strokeWeight(width * 0.013);
        rect(x, y, pW, pH, 15);

        stroke(255, 188, 31);
        strokeWeight(width * 0.005);
        fill(200, 30, 30);
        rect(x, y, pW, pH, 15);

        // Picture
        let imgAreaW = pW * 0.88;
        let imgAreaH = pH * 0.58;
        let imgY = y - pH * 0.12;
        
        stroke(220);
        strokeWeight(1);
        fill(245);
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
        stroke(0);
        strokeWeight(width * 0.003);
        rect(x, imgY, imgAreaW, imgAreaH, 5);
        pop();

        // Map Name
        fill(255, 188, 31);
        stroke(0);
        strokeWeight(w * 0.005);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        textSize(pW * 0.08);
        text(this.mapNames[selectedMap], x, y + pH * 0.28);

        // Map Effects Description
        fill(255, 188, 31); 
        stroke(0);
        strokeWeight(w * 0.002);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        textSize(pW * 0.035);
        text(this.mapEffects[selectedMap], x, y + pH * 0.42);
        pop();

    },

    drawArrowButton: function(x, y, direction, size) {
        let isHovered = dist(mouseX, mouseY, x, y) < size * 2;
        let scaleFactor = isHovered ? 1.2 : 1.0;
        let s = size * scaleFactor;
        
        push();
        stroke(0);
        strokeWeight(width * 0.004);
        fill(0);
        this.drawTriangleShape(x, y, direction, s);

        stroke(0);
        strokeWeight(width * 0.003);
        fill(255, 188, 31);
        this.drawTriangleShape(x, y, direction, s);
        pop();
    },

    drawTriangleShape: function(x, y, direction, s) {
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
        const { centerX, centerY } = layout;
        const w = width;
        const h = height;
        const escSize = w * 0.06;
        const margin = 20;

        let pW = w * 0.4;
        let pH = h * 0.5;
        let triSize = w * 0.015;
        let yPos = centerY + h * 0.05;

        // ESC
        if (mouseX > margin && mouseX < margin + escSize &&
            mouseY > margin && mouseY < margin + escSize) {
            this.goBack();
            return;
        }
        // Arrows
        if (dist(mouseX, mouseY, centerX - pW / 2 - triSize * 3, yPos) < triSize * 2) {
            this.changeMap(-1);
            return;
        }
        if (dist(mouseX, mouseY, centerX + pW / 2 + triSize * 3, yPos) < triSize * 2) {
            this.changeMap(1);
            return;
        }
        // Preview area
        if (mouseX > centerX - pW/2 && mouseX < centerX + pW/2 &&
            mouseY > yPos - pH/2 && mouseY < yPos + pH/2) {
            this.confirmSelection();
        }
    },

    changeMap: function(dir) {
        selectedMap = (selectedMap + dir + this.mapNames.length) % this.mapNames.length;
    },

    confirmSelection: function () {
        Scene_Game.setup();
        currentState = GAME_CONFIG.STATES.PLAYING;
    },
    
    goBack: function () {
        if (!isMultiplayer) {
            currentState = GAME_CONFIG.STATES.DIFFICULTY_SELECT;
        } else {
            p2CharIndex = -1;
            currentState = GAME_CONFIG.STATES.CHAR_SELECT;
        }
    }
};