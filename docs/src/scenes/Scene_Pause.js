const Scene_Pause = {
    selectedIndex: 0,
    options: ["Resume", "Restart", "Settings", "Main Menu"],

    draw: function() {
        rectMode(CORNER);
        imageMode(CORNER);
        noStroke();

        if (!layout) return;
        const w = width;
        const h = height;
        const centerX = w / 2;
        const centerY = h / 2;

        // Background
        if (typeof bgImg !== 'undefined' && bgImg) {
            imageMode(CORNER);
            image(bgImg, 0, 0, w, h);
        }
        rectMode(CORNER);
        fill(...GAME_CONFIG.COLORS.UI_PANEL_BG); 
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

        stroke(...GAME_CONFIG.COLORS.MENU_TEXT_SHADOW);
        strokeWeight(strokeSize);
        fill(...GAME_CONFIG.COLORS.BLACK);
        text("PAUSED", titleX + w * 0.005, titleY + w * 0.005);
        
        stroke(...GAME_CONFIG.COLORS.UI_STROKE_LIGHT);
        strokeWeight(strokeSize);
        fill(80);
        text("PAUSED", titleX + w * 0.002, titleY + w * 0.002);

        stroke(...GAME_CONFIG.COLORS.UI_STROKE_DARK);
        strokeWeight(strokeSize);
        fill(...GAME_CONFIG.COLORS.GOLD);
        text("PAUSED", titleX, titleY);
        pop();

        let contentY = centerY - h * 0.14; 
        let btnX = w * 0.15;
        let itemSpacing = h * 0.1;
        let menuFontSize = w * 0.027;

        let imgX = centerX + w * 0.2;
        let imgY = contentY + h * 0.16;
        let imgScale = 0.55;

        let currentHoverId = -1;

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
            
            let isHovered = UIManager.isMouseOver(x, y, txtW + 20, menuFontSize * 1.2, true);
            if (isHovered) {
                this.selectedIndex = i;
                currentHoverId = i;
            }

            // Arrow blinking
            if (i === this.selectedIndex && blink) {
                textSize(menuFontSize * 0.45);
                stroke(...GAME_CONFIG.COLORS.UI_STROKE_DARK);
                strokeWeight(w * 0.007);
                fill(GAME_CONFIG.COLORS.MENU_BG_LIGHT);
                text("▶", x - w * 0.03, y);
            }

            // Text
            textSize(menuFontSize * 1.1);
            stroke(...GAME_CONFIG.COLORS.UI_STROKE_DARK);
            strokeWeight(w * 0.008);
            fill(GAME_CONFIG.COLORS.MENU_BG_LIGHT);
            text(txt, x, y);
        }
        pop();

        UIManager.updateHoverSound(currentHoverId);

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
            if (soundManager) soundManager.play('select');
            this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
        } else if (keyCode === DOWN_ARROW) {
            if (soundManager) soundManager.play('select');
            this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
        } else if (keyCode === ENTER) {
            this.confirmSelection();
        } else if (keyCode === ESCAPE) {
            if (soundManager) soundManager.play('confirm');
            currentState = pausedFromState || GAME_CONFIG.STATES.PLAYING;
        }
    },

    handleMouse: function() {
        const w = width;
        const h = height;
        const centerX = w / 2;
        const centerY = h / 2;

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

            if (UIManager.isMouseOver(x, y, txtW + 20, menuFontSize * 1.2, true)) {
                this.selectedIndex = i;
                this.confirmSelection();
                return;
            }
        }
    },

    confirmSelection: function() {
        if (soundManager) soundManager.play('confirm');
        if (this.selectedIndex === 0) {
            currentState = pausedFromState || GAME_CONFIG.STATES.PLAYING;
        } else if(this.selectedIndex === 1){
            if (pausedFromState === GAME_CONFIG.STATES.TUTORIAL) {
                if (typeof Scene_Tutorial !== 'undefined' && Scene_Tutorial.setup) {
                    Scene_Tutorial.setup();
                }
                currentState = GAME_CONFIG.STATES.TUTORIAL;
            } else {
                if (typeof Scene_Game !== 'undefined' && Scene_Game.setup) {
                    Scene_Game.setup(); 
                }
                currentState = GAME_CONFIG.STATES.PLAYING;
            }
        } else if(this.selectedIndex === 2){
            previousState = GAME_CONFIG.STATES.PAUSED; 
            currentState = GAME_CONFIG.STATES.SETTINGS;
        }  else {
            p1CharIndex = -1;
            p2CharIndex = -1;
            currentState = GAME_CONFIG.STATES.MENU;
        }
    }
};