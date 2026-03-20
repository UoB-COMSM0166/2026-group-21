class LayoutManager {
    constructor() {
        this.COURT_W = GAME_CONFIG.COURT.WIDTH;
        this.COURT_H = GAME_CONFIG.COURT.HEIGHT;
        this.VIRTUAL_W = 0;
        this.VIRTUAL_H = 0;
        this.scaleFactor = 1;
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
        const TARGET_W = 1000;
        const TARGET_H = 800;
        this.scaleFactor = min(width / TARGET_W, height / TARGET_H);
        
        this.VIRTUAL_W = width / this.scaleFactor;
        this.VIRTUAL_H = height / this.scaleFactor;

        // center the court horizontally
        this.courtLeft = (this.VIRTUAL_W - this.COURT_W) / 2;
        this.courtRight = (this.VIRTUAL_W + this.COURT_W) / 2;
        this.centerX = (this.courtLeft + this.courtRight) / 2;
         //layout optimization for different size of screen
        let extraHeight = this.VIRTUAL_H - this.COURT_H;
        if (this.VIRTUAL_H > GAME_CONFIG.COURT.TALL_SCREEN_THRESHOLD) {
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