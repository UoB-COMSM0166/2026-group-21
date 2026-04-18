const Scene_Menu = {
    selectedIndex: 0,
    options: [
        { label: "Single Player", state: 'CHAR_SELECT', multi: false },
        { label: "Multi Player", state: 'CHAR_SELECT', multi: true },
        { label: "Tutorial", state: 'TUTORIAL', multi: false },
        { label: "Settings", state: 'SETTINGS', multi: false }
    ],

    draw: function () {
        if (!layout) return;

        const w = width;
        const h = height;

        if (bgImg) {
            image(bgImg, 0, 0, w, h);
        }
        else {
            background(GAME_CONFIG.COLORS.MENU_BG_LIGHT);
        }

        noSmooth();
        let blink = frameCount % 60 < 30;

        // Title
        push();
        let titleX = w * 0.15;
        let titleY = h * 0.12;
        let titleSize = w * 0.06;
        let strokeSize = titleSize * 0.15;
        textAlign(LEFT, TOP);
        textStyle(BOLD);
        textSize(titleSize);

        const textPart1 = "FUR";
        const textPart2 = "HAND SMASH";
        let p1W = textWidth(textPart1);
        let spaceW = textWidth(" ");
        let pawImgSize = titleSize * 1.0;
        
        // layer 1: bottom shadow
        push();
        let ox1 = titleX + w * 0.005;
        let oy1 = titleY + w * 0.005;
        stroke(...GAME_CONFIG.COLORS.MENU_TEXT_SHADOW);
        strokeWeight(strokeSize);
        fill(...GAME_CONFIG.COLORS.BLACK);
        text(textPart1, ox1, oy1);
        tint(...GAME_CONFIG.COLORS.MENU_TEXT_SHADOW);
        image(pawImg, ox1 + p1W, oy1, pawImgSize, pawImgSize);
        text(textPart2, ox1 + p1W + pawImgSize, oy1);
        pop();

        // layer 2: middle shadow
        push();
        let ox2 = titleX + w * 0.002;
        let oy2 = titleY + w * 0.002;
        stroke(...GAME_CONFIG.COLORS.UI_STROKE_LIGHT);
        strokeWeight(strokeSize);
        fill(80);
        text(textPart1, ox2, oy2);
        tint(80); 
        image(pawImg, ox2 + p1W, oy2, pawImgSize, pawImgSize);
        text(textPart2, ox2 + p1W + pawImgSize, oy2);
        pop();

        // layer 3: main text
        push();
        stroke(...GAME_CONFIG.COLORS.UI_STROKE_DARK);
        strokeWeight(strokeSize);
        fill(...GAME_CONFIG.COLORS.GOLD);
        text(textPart1, titleX, titleY);
        noTint();
        image(pawImg, titleX + p1W, titleY, pawImgSize, pawImgSize);
        text(textPart2, titleX + p1W + pawImgSize, titleY);
        pop();

        pop();

        // Menu
        push();
        let menuLeftX = w * 0.18;
        let menuBaseY = h * 0.35;
        let itemSpacing = h * 0.09;
        let menuFontSize = w * 0.027;
        textAlign(LEFT, CENTER);
        textStyle(BOLD);

        let currentHoverId = -1;

        for (let i = 0; i < this.options.length; i++) {

            let x = menuLeftX;
            let y = menuBaseY + (i * itemSpacing);

            let btnW = w * 0.35;
            let btnH = menuFontSize * 1.2;

            let isHovered = UIManager.isMouseOver(x, y, btnW, btnH, true);

            if (isHovered) {
                this.selectedIndex = i;
                currentHoverId = i;
            }

            if (i === this.selectedIndex && blink) {
                textSize(menuFontSize * 0.5);
                stroke(...GAME_CONFIG.COLORS.UI_STROKE_DARK);
                strokeWeight(w * 0.0075);
                fill(GAME_CONFIG.COLORS.MENU_BG_LIGHT);
                text("▶", x - w * 0.04, y);
            }

            textSize(menuFontSize);
            stroke(...GAME_CONFIG.COLORS.UI_STROKE_DARK);
            strokeWeight(w * 0.009);
            fill(GAME_CONFIG.COLORS.MENU_BG_LIGHT);
            text(this.options[i].label.toUpperCase(), x, y);
        }
        pop();
        UIManager.updateHoverSound(currentHoverId);
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
        const w = width;
        const h = height;
        let menuLeftX = w * 0.18;
        let menuBaseY = h * 0.35;
        let itemSpacing = h * 0.09;
        let menuFontSize = w * 0.027;

        push();
        textSize(menuFontSize);
        textStyle(BOLD);

        for (let i = 0; i < this.options.length; i++) {
            let x = menuLeftX;
            let y = menuBaseY + (i * itemSpacing);

            let txt = this.options[i].label.toUpperCase();
            let realTxtWidth = textWidth(txt);
            let btnH = menuFontSize;

            if (UIManager.isMouseOver(x, y, realTxtWidth, btnH, true)) {
                this.selectedIndex = i;
                this.confirmSelection();
                pop();
                return;
            }
        }
        pop();
    },

    confirmSelection: function () {
        if (soundManager) soundManager.play('confirm');
        let choice = this.options[this.selectedIndex];
        isMultiplayer = choice.multi;
        currentState = GAME_CONFIG.STATES[choice.state];
        if (currentState === GAME_CONFIG.STATES.TUTORIAL) {
            Scene_Tutorial.setup();
        }else if (currentState === GAME_CONFIG.STATES.SETTINGS) {
            previousState = GAME_CONFIG.STATES.MENU;
        }
    }
};