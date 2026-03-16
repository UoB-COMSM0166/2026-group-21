const UIManager = {
    lastHoveredId: -1,

    isMouseOver: function(x, y, w, h, isCenter = false) {
        if (isCenter) {
            return mouseX > x && mouseX < x + w && 
                   mouseY > y - h / 2 && mouseY < y + h / 2;
        }
        return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
    },

    updateHoverSound: function(currentId) {
        if (currentId !== this.lastHoveredId && currentId !== -1) {
            if (soundManager) soundManager.play('select');
            this.lastHoveredId = currentId;
        }

        if (currentId === -1) {
            this.lastHoveredId = -1;
        }
    }
};