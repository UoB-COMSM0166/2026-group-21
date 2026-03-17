const Scene_Pause = {
    selectedIndex: 0,
    options: ["Resume", "Main Menu"],
    btnW: 0,
    btnH: 0,

    draw: function() {
        if (!layout) return;
        const w = width;
        const h = height;
        const { centerX, centerY } = layout;

        // Background
        if (typeof bgImg !== 'undefined' && bgImg) {
            imageMode(CORNER);
            image(bgImg, 0, 0, w, h);
        }
        rectMode(CORNER);
        fill(255, 200); 
        noStroke();
        rect(0, 0, w, h);

        let blink = frameCount % 60 < 30;

        // Title
        push();
        let titleX = w * 0.13; 
        let titleY = h * 0.12;
        let titleSize = w * 0.075;
        let strokeSize = titleSize * 0.15;
        
        textAlign(LEFT, TOP);
        textStyle(BOLD);
        textSize(titleSize);

        stroke(56, 49, 78);
        strokeWeight(strokeSize);
        fill(0);
        text("PAUSED", titleX + w * 0.005, titleY + w * 0.005);
        
        stroke(64, 57, 85);
        strokeWeight(strokeSize);
        fill(80);
        text("PAUSED", titleX + w * 0.002, titleY + w * 0.002);

        stroke(51, 44, 74);
        strokeWeight(strokeSize);
        fill(255, 188, 31);
        text("PAUSED", titleX, titleY);
        pop();

        let contentY = centerY - h * 0.14; 
        let btnX = w * 0.15;
        let itemSpacing = h * 0.1;
        let menuFontSize = w * 0.027;

        let imgX = centerX + w * 0.2;
        let imgY = contentY + h * 0.16;
        let imgScale = 0.55;

        // Pause Menu area
        push();
        textAlign(LEFT, CENTER);
        textStyle(BOLD);
        
        for (let i = 0; i < this.options.length; i++) {
            let x = btnX; 
            let y = contentY + (i * itemSpacing);

            let txt = this.options[i].toUpperCase();
            textSize(menuFontSize);
            let txtW = textWidth(txt);
            
            let isHovered = (mouseX > x && mouseX < x + txtW + 20 &&
                             mouseY > y - menuFontSize/2 && mouseY < y + menuFontSize/2);
            if (isHovered) this.selectedIndex = i;

            // Arrow blinking
            if (i === this.selectedIndex && blink) {
                textSize(menuFontSize * 0.45);
                stroke(51, 44, 74);
                strokeWeight(w * 0.007);
                fill(250);
                text("▶", x - w * 0.03, y);
            }

            // Text
            textSize(menuFontSize * 1.1);
            stroke(51, 44, 74);
            strokeWeight(w * 0.008);
            fill(250);
            text(txt, x, y);
        }
        pop();

        // Tutorial Picture
        if (typeof tutorialImg !== 'undefined' && tutorialImg) {
            push();
            imageMode(CENTER);
            let tW = w * imgScale; 
            let aspectRatio = tutorialImg.height / tutorialImg.width;
            let tH = tW * aspectRatio;

            if (tH > h * 0.8) { 
                tH = h * 0.8;
                tW = tH / aspectRatio;
            }

            image(tutorialImg, imgX, imgY, tW, tH);
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
        const w = width;
        const h = height;
        const { centerX, centerY } = layout;

        let contentY = centerY - h * 0.14;
        let btnX = w * 0.15;
        let itemSpacing = h * 0.1;
        let menuFontSize = w * 0.027;

        for (let i = 0; i < this.options.length; i++) {
            let x = btnX;
            let y = contentY + (i * itemSpacing);

            push();
            textSize(menuFontSize * 1.2);
            let txtW = textWidth(this.options[i].toUpperCase());
            pop();

            if (mouseX > x && mouseX < x + txtW + 20 &&
                mouseY > y - (menuFontSize * 1.2)/2 && 
                mouseY < y + (menuFontSize * 1.2)/2) {
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