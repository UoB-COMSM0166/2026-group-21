class TutorialManager {
    constructor() {
        this.currentStep = 1;
        this.targetX = layout.courtRight - 100;
        this.targetY = layout.courtBottom - 100;
        this.serveCount = 0;
        this.targetServes = 3;
        this.returnCount = 0;
        this.targetReturns = 3;
        this.skillHitCount = 0;
        this.targetSkillHits = 3;
        this.scoreTarget = 3;
        this.currentMatchScore = 0;
    }

    getStepIntro() {
        switch (this.currentStep) {
            case 1: return {
                title: "STAGE 1: MOVING",
                desc: "Let's start with the basics.\n\nUse WASD keys to control your character.\nMove into the yellow zone to begin."
            };
            case 2: return { title: "STAGE 2: SERVING", desc: "Learn how to start the game.\n\nPress SPACE to toss, then wait for the ball to\nreach a hittable height before striking!" };
            case 3: return { title: "STAGE 3: RETURNING", desc: "Defend your court.\nPosition yourself and time your swing to return the ball." };
            case 4: return { title: "STAGE 4: SPECIAL SKILL", desc: "Unleash your power.\nPress Q when the energy bar is full for a powerful shot!" };
            case 5: return { title: "STAGE 5: MATCH RULES", desc: "Putting it all together.\n\n1. First bounce must land INSIDE the court.\n2. You score if the ball bounces TWICE on the AI's side.\n3. Score 3 points against the AI to graduate!" };
            default: return { title: "CONGRATULATIONS", desc: "You have completed the tutorial!" };
        }
    }

    getCurrentPrompt() {
        switch (this.currentStep) {
            case 1: return "Use WASD to move to the yellow zone";
            case 2: return `Press SPACE to toss, then press again to hit at the right height (${this.serveCount}/${this.targetServes})`;
            case 3: return `Press SPACE to return the AI's serve (${this.returnCount}/${this.targetReturns})`;
            case 4: return `When the bar is full, press Q to use SKILL before the ball lands (${this.skillHitCount}/${this.targetSkillHits})`;
            case 5: return `Score 3 points (${this.currentMatchScore}/${this.scoreTarget})`;
            default: return "";
        }
    }

    hasTarget() {
        return this.currentStep === 1;
    }

    registerServe() {
        if (this.currentStep === 2) {
            this.serveCount++;
            if (this.serveCount >= this.targetServes) {
                this.nextStep();
            }
        }
    }

    registerReturn() {
        if (this.currentStep === 3) {
            this.returnCount++;
            if (this.returnCount >= this.targetReturns) {
                this.nextStep();
            }
        }
    }

    registerSkillHit() {
        if (this.currentStep === 4) {
            this.skillHitCount++;
            if (this.skillHitCount >= this.targetSkillHits) {
                this.nextStep();
            }
        }
    }

    registerPoint() {
        if (this.currentStep === 5) {
            this.currentMatchScore++;
            if (this.currentMatchScore >= this.scoreTarget) {
                this.nextStep();
            }
        }
    }

    nextStep() {
        this.currentStep++;
        if (this.currentStep === 2) this.serveCount = 0;
        if (this.currentStep === 3) this.returnCount = 0;
        if (this.currentStep === 4) this.skillHitCount = 0;
        if (this.currentStep === 5) this.currentMatchScore = 0;
        if (typeof Scene_Tutorial !== 'undefined') {
            Scene_Tutorial.isPausedForIntro = true;
        }
    }
}