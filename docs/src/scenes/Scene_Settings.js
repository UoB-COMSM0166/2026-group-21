const Scene_Settings = {
    selectedIndex: 0,
    draggingIndex: -1,
    options: ["BGM Volume", "SFX Volume"],
    btnW: 400,
    barW: 150,

    draw: function() {
        rectMode(CORNER);
        imageMode(CORNER);
        noStroke();
        
        const w = width;
        const h = height;

        // background
        if (bgImg) image(bgImg, 0, 0, w, h);
        else background(250);
        
        fill(0, 0, 0, 100);
        rect(0, 0, w, h);

        const centerX = w / 2;
        const centerY = h / 2;
        let blink = frameCount % 60 < 30;

        // esc
        push();
        const escSize = w * 0.06;
        const margin = 20;
        if (typeof escImg !== 'undefined' && escImg) {
            imageMode(CORNER);
            image(escImg, margin, margin, escSize, escSize);
        }
        pop();

        // settigs
        push();
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        textSize(w * 0.06); 
        stroke(51, 44, 74);
        strokeWeight(w * 0.008);
        fill(255, 188, 31);
        text("SETTINGS", centerX, centerY - h * 0.3);
        pop();

        let currentHoverId = -1;
        let menuFontSize = w * 0.027;
        let marginLeft = w * 0.54;

        for (let i = 0; i < this.options.length; i++) {
            let x = marginLeft;
            let y = centerY + (i * h * 0.1) - h * 0.12;

            let isHovered = UIManager.isMouseOver(x, y - 30, this.btnW, 60);
            if (isHovered) {
                this.selectedIndex = i;
                currentHoverId = i;
            }

            if (mouseIsPressed) {
                if (this.draggingIndex === -1 && isHovered && this.options[i].includes("Volume")) {
                    this.draggingIndex = i;
                }
            } else {
                this.draggingIndex = -1;
            }

            if (this.draggingIndex === i) {
                this.updateVolumeByMouse(x, i);
            }

            push();
            textStyle(BOLD);
            textAlign(LEFT, CENTER);

            if (i === this.selectedIndex) {
                fill(255, 255, 0); 
                if (blink) {
                    push();
                    textSize(menuFontSize * 0.5);
                    stroke(51, 44, 74);
                    strokeWeight(w * 0.0075);
                    fill(250);
                    textAlign(RIGHT, CENTER);

                    let arrowX = this.options[i].includes("Volume") ? x - 400 : x - 150;
                    text("▶", x - 40, y);
                    pop();
                }
            } else {
                fill(250); 
            }

            stroke(51, 44, 74);
            strokeWeight(w * 0.008);
            textSize(menuFontSize);

            if (this.options[i].includes("Volume")) {
                textAlign(RIGHT, CENTER);
                textSize(menuFontSize);
                let textStartX = x - 170;
                text(this.options[i], x - 30, y);
                
                let vol = (this.options[i] === "BGM Volume") ? 
                           soundManager.targetVolume : 
                           soundManager.sfxVolume;

                noStroke();

                let barStartX = x + 30;
                
                fill(100);
                rect(barStartX, y - 5, this.barW, 10, 5);
                
                fill(i === this.selectedIndex ? [255, 215, 0] : 255);
                rect(barStartX, y - 5, this.barW * vol, 10, 5);
                
                stroke(51, 44, 74);
                strokeWeight(2);
                ellipse(barStartX + this.barW * vol, y, 18, 18);

            } else {
                textAlign(CENTER, CENTER);
                textSize(menuFontSize * 1.2);
                text(this.options[i], x, y);
            }
            pop();
        }
        UIManager.updateHoverSound(currentHoverId);
    },

    updateVolumeByMouse: function(refX, index) {
        let barStartX = refX + 30;
        let newVol = constrain((mouseX - barStartX) / this.barW, 0, 1);
        
        if (this.options[index] === "BGM Volume") {
            soundManager.setMasterVolume(newVol);
        } else {
            soundManager.sfxVolume = newVol;
        }
    },

    handleInput: function() {
        if (keyCode === ESCAPE || keyCode === 27) {
            this.goBack();
            return;
        }
        if (keyCode === UP_ARROW) {
            if (soundManager) soundManager.play('select');
            this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
        }
        if (keyCode === DOWN_ARROW) {
            if (soundManager) soundManager.play('select');
            this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
        }
        if (this.options[this.selectedIndex].includes("Volume")) {
            if (keyCode === LEFT_ARROW) this.adjust(-0.05);
            if (keyCode === RIGHT_ARROW) this.adjust(0.05);
        }
    },

    adjust: function(amt) {
        if (this.options[this.selectedIndex] === "BGM Volume") {
            let nextVol = constrain(soundManager.targetVolume + amt, 0, 1);
            soundManager.setMasterVolume(nextVol);
        } else {
            soundManager.sfxVolume = constrain(soundManager.sfxVolume + amt, 0, 1);
        }
        if (soundManager) soundManager.play('select');
    },

    handleMouse: function() {
        const w = width;
        const h = height;
        const centerX = w / 2;
        const centerY = h / 2;
        const margin = 20;
        const escSize = w * 0.06;

        // esc
        if (UIManager.isMouseOver(margin, margin, escSize, escSize, false)) {
            this.goBack();
            return;
        }
        
        let marginLeft = w * 0.54;
        for (let i = 0; i < this.options.length; i++) {
            let x = marginLeft;
            let y = centerY + (i * h * 0.1) - h * 0.12;
            
            if (UIManager.isMouseOver(x - 200, y - 30, this.btnW, 60)) {
                this.selectedIndex = i;
                if (this.options[i].includes("Volume")) {
                    this.updateVolumeByMouse(x, i);
                    if (mouseIsPressed && this.draggingIndex === -1) {
                        if (soundManager) soundManager.play('confirm');
                    }
                }
            }
        }
    },

    goBack: function() {
        if (soundManager) soundManager.play('confirm');
        if (typeof previousState !== 'undefined' && previousState === GAME_CONFIG.STATES.PAUSED) {
            currentState = GAME_CONFIG.STATES.PAUSED;
            previousState = null;
        } else {
            currentState = GAME_CONFIG.STATES.MENU;
        }
    }
};