class LayoutManager {
    constructor() {
        this.COURT_W = GAME_CONFIG.COURT.WIDTH;
        this.COURT_H = GAME_CONFIG.COURT.HEIGHT;
        this.courtLeft = 0;
        this.courtRight = 0;
        this.courtTop = 0;
        this.courtBottom = 0;
        this.centerX = 0;
        this.centerY = 0;
        this.netY = 0;
        this.update();
    }

    update() {
        // center the court horizontally
        this.courtLeft = (width - this.COURT_W) / 2;
        this.courtRight = (width + this.COURT_W) / 2;
        this.centerX = (this.courtLeft + this.courtRight) / 2;
         //layout optimization for different size of screen
        let extraHeight = height - this.COURT_H;
        if (height > GAME_CONFIG.COURT.TALL_SCREEN_THRESHOLD) {
            this.courtTop = GAME_CONFIG.COURT.TALL_SCREEN_TOP;
        } else {
            this.courtTop = max(GAME_CONFIG.COURT.MIN_TOP_MARGIN, extraHeight / 2);
        }
        this.courtBottom = this.courtTop + this.COURT_H;
        //net is in the middle of the court
        this.netY = (this.courtTop + this.courtBottom) / 2;
        this.centerY = this.netY;
        //serve positions relative to the court boundaries
        this.sideLeft = this.courtLeft + GAME_CONFIG.COURT.SERVE_OUTSIDE_OFFSET;
        this.sideRight = this.courtRight - GAME_CONFIG.COURT.SERVE_OUTSIDE_OFFSET;
    }
}