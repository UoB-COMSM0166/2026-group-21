class TutorialManager {
    constructor() {
        this.currentStep = 1;
        this.targetX = layout.courtRight - GAME_CONFIG.TUTORIAL.TARGET_ZONE_OFFSET_X;
        this.targetY = layout.courtBottom - GAME_CONFIG.TUTORIAL.TARGET_ZONE_OFFSET_Y;
        this.successCount = 0;
        this.targetCount = GAME_CONFIG.TUTORIAL.TARGET_SUCCESS_COUNT;
    }

    // Returns the big intro text shown at the start of each stage
    getStepIntro() {
        switch (this.currentStep) {
            case 1: return {
                title: "STAGE 1: MOVING",
                desc: "Let's start with the basics.\n\nUse WASD keys to control your character.\nMove into the yellow zone to begin."
            };
            case 2: return { title: "STAGE 2: SERVING", desc: "Learn how to start the game.\n\nPress SPACE to toss, then wait for the ball to\nreach a hittable height before striking!" };
            case 3: return { title: "STAGE 3: RETURNING", desc: "Defend your court.\nPosition yourself and time your swing to return the ball." };
            case 4: return { title: "STAGE 4: SPECIAL SKILL", desc: "Unleash your power.\nWait for the opponent to serve, then press Q to use your SKILL!" };
            case 5: return { title: "STAGE 5: MATCH RULES", desc: "Putting it all together.\n\n1. First bounce must land INSIDE the court.\n2. You score if the ball bounces TWICE on the AI's side.\n3. Score 3 points against the AI to graduate!" };
            default: return { title: "CONGRATULATIONS", desc: "You have completed the tutorial!" };
        }
    }

    // Returns the small looping yellow text at the top of the screen
    getCurrentPrompt() {
        switch (this.currentStep) {
            case 1: return "Use WASD to move to the yellow zone";
            case 2: return `Press SPACE to toss, then press again to hit at the right height (${this.successCount}/${this.targetCount})`;
            case 3: return `Press SPACE to return the AI's serve (${this.successCount}/${this.targetCount})`;
            case 4: return `Wait for the serve, press Q to CHARGE, then HIT! (${this.successCount}/${this.targetCount})`;
            case 5: return `Score 3 points (${this.successCount}/${this.targetCount})`;
            default: return "";
        }
    }

    // Only draw the yellow target zone on the floor during stage 1
    hasTarget() {
        return this.currentStep === 1;
    }

    // Called whenever the player successfully completes the current stage's goal
    registerSuccess() {
        if (this.currentStep >= 2 && this.currentStep <= 5) {
            this.successCount++;
            if (this.successCount >= this.targetCount) {
                this.nextStep();
            }
        }
    }

    nextStep() {
        this.currentStep++;
        this.successCount = 0;
        if (typeof Scene_Tutorial !== 'undefined') {
            Scene_Tutorial.isPausedForIntro = true;
        }
    }
}