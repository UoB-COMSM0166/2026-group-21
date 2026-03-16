const Scene_CharSelect = {
    charNames: ["Cat", "Dog", "Deer", "Bird", "?"],
    focusedIndex: 0,
    menuYellow: [255, 188, 31],

    draw: function () {
        const w = width;
        const h = height;

        // Background
        push();
        resetMatrix();
        imageMode(CORNER); 
        if (typeof bgImg !== 'undefined' && bgImg){
            image(bgImg, 0, 0, w, h);
        }
        else{
            background(200);
        }
        
        fill(255, 150); 
        noStroke();
        rectMode(CORNER);
        rect(0, 0, w, h);
        pop();

        // Title
        push();
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        textSize(w * 0.045);
        stroke(51, 44, 74); 
        strokeWeight(w * 0.008); 
        fill(this.menuYellow);
        let promptText = (p1CharIndex === -1) ? "P1 : Charcter Selection" : "P2: Charcter Selection";
        text(promptText, w * 0.5, h * 0.12);
        pop();

        // Pane
        let panelW = w * 0.22;
        let panelH = h * 0.55;
        let p1X = w * 0.32; 
        let p2X = w * 0.68;
        let panelY = h * 0.52;

        let p1DisplayIdx = (p1CharIndex === -1) ? this.focusedIndex : p1CharIndex;
        let p2DisplayIdx = (p1CharIndex !== -1 && p2CharIndex === -1) ? this.focusedIndex : p2CharIndex;

        this.drawCharacterPanel(p1X, panelY, panelW, panelH, "P1", p1DisplayIdx, 0);
        this.drawCharacterPanel(p2X, panelY, panelW, panelH, "P2", p2DisplayIdx, 1);
    },

    drawCharacterPanel: function(x, y, pw, ph, playerTag, charIdx, playerType) {
        const w = width;
        let isSelecting = (playerType === 0 && p1CharIndex === -1) ||
                          (playerType === 1 && p1CharIndex !== -1 && p2CharIndex === -1);
        
        let baseColor = (playerType === 0) ? color(200, 30, 30) : color(0, 102, 204);
        
        push();
        rectMode(CENTER);
        
        // Yellow
        fill(this.menuYellow);
        stroke(0);
        strokeWeight(3);
        rect(x, y, pw + 15, ph + 15, 8); 
        
        // Red or Blue
        fill(baseColor);
        noStroke();
        rect(x, y, pw, ph, 4);

        // Character picture zone
        let iconBoxSize = pw * 0.8;
        let iconY = y - ph * 0.13;
        fill(255);
        stroke(this.menuYellow[0], this.menuYellow[1], this.menuYellow[2], 120);
        strokeWeight(15);
        rect(x, iconY, iconBoxSize, iconBoxSize, 2);

        let isQuestionMark = (charIdx === this.charNames.length - 1);

        if (isQuestionMark) {
            textAlign(CENTER, CENTER);
            textSize(iconBoxSize * 0.6);
            textStyle(BOLD);
            stroke(0);
            strokeWeight(7);
            fill(this.menuYellow);
            text("?", x, iconY);
        }
        // Character Picture (front)
        else if (charIdx !== -1 && charIdx < this.charNames.length) {
            let charData = (characterImages && characterImages[charIdx]) ? characterImages[charIdx] : null;
            
            let charImg = null;
            if (charData) {
                charImg = charData.portrait || charData.front;
            }

            if (charImg && charImg.width > 0) {
                push();
                imageMode(CENTER);
                let dw = iconBoxSize * 0.7;
                let dh = iconBoxSize * 0.7;
                let aspect = charImg.width / charImg.height;
                if (aspect > 1) dh = dw / aspect;
                else dw = dh * aspect;
                image(charImg, x, iconY, dw, dh);
                pop();
            }

            // Character Name
            textAlign(CENTER, CENTER);
            textSize(pw * 0.14);
            textStyle(BOLD);
            stroke(0);
            strokeWeight(w * 0.005);
            fill(this.menuYellow);
            text(this.charNames[charIdx].toUpperCase(), x, y + ph * 0.1);
            
            // Skill Description
            let config = (typeof GAME_CONFIG !== 'undefined') ? GAME_CONFIG.CHARACTERS[charIdx] : null;
            let rawSkill = (config && config.skillType) ? config.skillType : "normal";
            
            let spacedSkill = rawSkill.replace('_', ' ');
            let skillDisplay = spacedSkill.charAt(0).toUpperCase() + spacedSkill.slice(1).toLowerCase();

            stroke(0); 
            strokeWeight(3.5);
            fill(this.menuYellow); 
            textSize(pw * 0.08);
            textAlign(CENTER, CENTER);
            text("Skill: " + skillDisplay, x, y + ph * 0.28);
        }

        // Arrow
        if (isSelecting) {
            let blink = (frameCount % 60 < 30);
            fill(this.menuYellow);
            stroke(0);
            strokeWeight(6);
            textSize(w * 0.016);
            if (blink) {
                text("▲", x, y - ph * 0.44);
                text("▼", x, y + ph * 0.44);
            }
        }

        // P1/P2
        push();
        textAlign(CENTER, CENTER);
        textSize(w * 0.025);
        fill(this.menuYellow);
        stroke(0);
        strokeWeight(6);
        textStyle(BOLD);
        text(playerTag, x - pw * 0.37, y - ph * 0.42);
        pop();
    },

    handleMouse: function () {
        const w = width;
        const h = height;
        let ph = h * 0.55;
        let py = h * 0.52;
        let curX = (p1CharIndex === -1) ? w * 0.32 : w * 0.68;

        if (mouseX > curX - 80 && mouseX < curX + 80) {
            // The Up Arrow 
            if (mouseY > py - ph * 0.6 && mouseY < py - ph * 0.3) {
                this.focusedIndex = (this.focusedIndex - 1 + this.charNames.length) % this.charNames.length;
            }
            // The Down Arrow
            else if (mouseY > py + ph * 0.3 && mouseY < py + ph * 0.6) {
                this.focusedIndex = (this.focusedIndex + 1) % this.charNames.length;
            }
            // Charachter Selection
            else if (mouseY > py - ph * 0.25 && mouseY < py + ph * 0.25) {
                this.confirmSelection();
            }
        }
    },

    handleInput: function () {
        if (keyCode === ESCAPE) this.goBack();
        if (keyCode === UP_ARROW) {
            this.focusedIndex = (this.focusedIndex - 1 + this.charNames.length) % this.charNames.length;
        } else if (keyCode === DOWN_ARROW) {
            this.focusedIndex = (this.focusedIndex + 1) % this.charNames.length;
        } else if (keyCode === ENTER) {
            this.confirmSelection();
        }
    },

    confirmSelection: function () {
        if (p1CharIndex === -1) {
            p1CharIndex = this.focusedIndex;
            this.focusedIndex = 0; 
        } else if (p2CharIndex === -1) {
            p2CharIndex = this.focusedIndex;
            this.applySelections();
            currentState = isMultiplayer ? GAME_CONFIG.STATES.MAP_SELECT : GAME_CONFIG.STATES.DIFFICULTY_SELECT;
        }
    },

    goBack: function () {
        if (p1CharIndex !== -1 && p2CharIndex === -1) p1CharIndex = -1;
        else { p1CharIndex = -1; p2CharIndex = -1; currentState = GAME_CONFIG.STATES.MENU; }
    },

    applySelections: function () {
        const p1Config = GAME_CONFIG.CHARACTERS[p1CharIndex];
        const p2Config = GAME_CONFIG.CHARACTERS[p2CharIndex];
        player.speed = p1Config.speed;
        player.name = p1Config.name;
        opponent.speed = p2Config.speed;
        opponent.name = p2Config.name;

        if (characterImages[p1CharIndex]) player.img = characterImages[p1CharIndex];
        if (characterImages[p2CharIndex]) opponent.img = characterImages[p2CharIndex];
    }
};