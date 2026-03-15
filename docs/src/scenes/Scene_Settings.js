const Scene_Settings = {
    selectedIndex: 0,
    draggingIndex: -1,
    options: ["BGM Volume", "SFX Volume", "Back"],
    btnW: 400,
    barW: 150,

    draw: function() {
        if (bgImg) image(bgImg, 0, 0, width, height);
        else background(250);
        fill(0, 0, 0, 100);
        rect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        
        textAlign(CENTER, CENTER);
        fill(255);
        textSize(50);
        text("SETTINGS", centerX, centerY - 150);

        let currentHoverId = -1;

        for (let i = 0; i < this.options.length; i++) {
            let x = centerX;
            let y = centerY + (i * 80) - 50;

            let isHovered = UIManager.isMouseOver(x - this.btnW/2, y, this.btnW, 60, true);
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
            if (i === this.selectedIndex) fill(255, 255, 0);
            else fill(200);

            if (this.options[i].includes("Volume")) {
                textAlign(LEFT, CENTER);
                textSize(24);
                text(this.options[i], x - 140, y);
                
                let vol = (this.options[i] === "BGM Volume") ? 
                           soundManager.targetVolume : 
                           soundManager.sfxVolume;

                fill(100);
                rect(x + 20, y - 5, this.barW, 10, 5);
                fill(i === this.selectedIndex ? [255, 215, 0] : 255);
                rect(x + 20, y - 5, this.barW * vol, 10, 5);
                ellipse(x + 20 + this.barW * vol, y, 15, 15);
            } else {
                textAlign(CENTER, CENTER);
                textSize(30);
                text(this.options[i], x, y);
            }
            pop();
        }
        UIManager.updateHoverSound(currentHoverId);
    },

    updateVolumeByMouse: function(centerX, index) {
        let barStartX = centerX + 20;
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
        if (keyCode === UP_ARROW) this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
        if (keyCode === DOWN_ARROW) this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
        if (this.options[this.selectedIndex].includes("Volume")) {
            if (keyCode === LEFT_ARROW) this.adjust(-0.05);
            if (keyCode === RIGHT_ARROW) this.adjust(0.05);
        }
        if (keyCode === ENTER && this.options[this.selectedIndex] === "Back") {
            this.goBack();
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
        const centerX = width / 2;
        const centerY = height / 2;
        
        let i = this.selectedIndex;
        let x = centerX;
        let y = centerY + (i * 80) - 50;

        if (UIManager.isMouseOver(x - this.btnW/2, y - 25, this.btnW, 60)) {
            if (this.options[i] === "Back") {
                this.goBack();
            } else if (this.options[i].includes("Volume")) {
                this.updateVolumeByMouse(x, i);
                if (soundManager) soundManager.play('confirm');
            }
        }
    },

    goBack: function() {
        if (soundManager) soundManager.play('confirm');
        currentState = GAME_CONFIG.STATES.MENU;
    }
};