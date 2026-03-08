const Scene_Tutorial = {
    initializedStep: 0,
    ballResetTimer: 0,
    hasHitBall: false,
    needsReset: false,
    lastPlayerScore: 0,
    lastOpponentScore: 0,
    successPauseTimer: 0,
    skillTriggered: false,
    isPausedForIntro: false,
    scoringMessage: "",

    setup: function () {
        tutorialManager = new TutorialManager();
        if (scoreManager) {
            scoreManager.init();
            scoreManager.currentServer = 'NONE';
        }

        if (characterImages[0] && characterImages[0].back) {
            player.img = characterImages[0].back;
            opponent.img = characterImages[0].front;
        }

        this.resetState(0);
        this.isPausedForIntro = true;
        player.x = layout.centerX;
        player.y = layout.courtBottom - 50;

        this.stepHandlers = {
            1: {
                init: null,
                handle: () => this.handleMoveLogic(),
                onSuccess: () => {
                    tutorialManager.nextStep();
                }
            },
            2: {
                init: () => this.initStep2(),
                handle: () => this.handleServeLogic(),
                onSuccess: () => {
                    tutorialManager.registerServe();
                    this.resetBallForServe();
                }
            },
            3: {
                init: () => this.initStep3(),
                handle: () => this.handleReturnLogic(),
                onSuccess: () => {
                    tutorialManager.registerReturn();
                    this.resetBallForAIServe();
                }
            },
            4: {
                init: () => this.initStep4(),
                handle: () => this.handleSkillLogic(),
                onSuccess: () => {
                    tutorialManager.registerSkillHit();
                    this.resetBallForAIServe();
                }
            },
            5: {
                init: () => this.initStep5(),
                handle: () => this.handleScoringLogic(),
                onSuccess: () => {
                    if (this.scoringMessage === "YOU SCORE!") {
                        tutorialManager.registerPoint();
                    }
                    this.resetBallForAIServe();
                    this.lastPlayerScore = scoreManager.playerPoints;
                    this.lastOpponentScore = scoreManager.opponentPoints;
                }
            },
        };
    },

    draw: function () {
        background(backgroundImg);
        imageMode(CORNER);
        image(courtImg, layout.courtLeft, layout.courtTop, layout.COURT_W, layout.COURT_H);

        if (this.isPausedForIntro) {
            player.display();
            ball.display();
            this.drawTransitionOverlay();
            return;
        }

        if (this.successPauseTimer > 0) {
            this.updateFrozen(player);
        } else {
            player.update();
        }
        player.display();

        const step = tutorialManager.currentStep;
        if (step >= 4) {
            player.displaySkillBar(width - 170, height - 40, 150, 20);
        }
        this.handleStepInitialization(step);

        const handler = this.stepHandlers[step];
        if (handler) handler.handle();

        this.displayTutorialUI(tutorialManager.getCurrentPrompt());
        if (tutorialManager.hasTarget()) this.drawTargetZone(tutorialManager.targetX, tutorialManager.targetY);
        this.handleSuccessPause();
    },

    initStep2: function () {
        if (scoreManager) {
            scoreManager.currentServer = 'PLAYER';
            scoreManager.currentSide = 'RIGHT';
        }
        player.x = layout.sideRight;
        player.y = layout.courtBottom - 20;
        this.resetBallForServe();
    },

    initStep3: function () {
        player.x = layout.centerX;
        player.y = layout.courtBottom - 100;
        opponent.x = layout.sideLeft;
        opponent.y = layout.courtTop + 20;

        this.resetBallForAIServe();
    },

    initStep4: function () {
        player.skillCooldown = player.maxCooldown / 2;
        player.x = layout.centerX;
        player.y = layout.courtBottom - 100;
        this.resetBallForAIServe();
    },

    initStep5: function () {
        scoreManager.init();
        this.lastPlayerScore = 0;
        this.resetBallForAIServe();
    },

    resetState: function (step) {
        this.initializedStep = step;
        player.skillCooldown = 0;
        this.ballResetTimer = 0;
        this.needsReset = false;
        this.hasHitBall = false;
        this.skillTriggered = false;
        this.lastPlayerScore = 0;
        this.lastOpponentScore = 0;
        this.resetBallFull();
    },

    handleStepInitialization: function (step) {
        if (this.initializedStep === step) return;
        this.initializedStep = step;

        const handler = this.stepHandlers[step];
        if (handler?.init) handler.init();
    },

    handleSuccessPause: function () {
        if (this.successPauseTimer <= 0) return false;
        this.successPauseTimer--;
        push();
        textAlign(CENTER, CENTER);
        stroke(0); strokeWeight(6); textSize(50);
        if (this.scoringMessage.includes("AI")) fill(255, 0, 0);
        else if (this.scoringMessage.includes("GREAT")) fill(255, 255, 0);
        else fill(0, 255, 0);

        text(this.scoringMessage, width / 2, height / 2);
        pop();

        if (this.successPauseTimer === 0) {
            const handler = this.stepHandlers[tutorialManager.currentStep];
            if (handler?.onSuccess) handler.onSuccess();
        }
        return true;
    },

    updateFrozen: function (entity, updateArgs) {
        const tempX = entity.x;
        const tempY = entity.y;
        entity.update(updateArgs);
        entity.x = tempX;
        entity.y = tempY;
    },

    updateGameElements: function (hasOpponent = true) {
        if (hasOpponent) {
            if (this.successPauseTimer > 0) {
                this.updateFrozen(opponent, false);
            } else {
                if (!this.needsReset) opponentAI.update(ball);
                opponent.update(!this.needsReset);
            }
            opponent.display();
        }
        ball.update();
        if (this.successPauseTimer > 0 && ball.isWaiting) ball.x = -9999;
        if (!ball.isWaiting) ball.checkHit(player);
        if (hasOpponent) ball.checkHit(opponent);
        ball.display();
    },

    getBallStatus: function () {
        return {
            isDead: !ball.isWaiting && ball.z <= 0 && abs(ball.vz) < 1.5,
            isOut: ball.y > layout.courtBottom + 50 || ball.y < layout.courtTop - 100,
            isOpponentOut: ball.y < layout.courtTop - 50,
            isPlayerOut: ball.y > layout.courtBottom + 50,
            tossMissed: ball.isTossing && ball.vy > 0 && ball.y > layout.courtBottom + 50
        };
    },

    handleInput: function () {
        if (this.isPausedForIntro) {
            if (tutorialManager.currentStep > 5) {
                currentState = GAME_CONFIG.STATES.MENU;
                this.setup();
                return;
            }
            this.isPausedForIntro = false;
            return;
        }
        if (this.successPauseTimer > 0) return;
        if (keyCode === ESCAPE) {
            currentState = GAME_CONFIG.STATES.MENU;
            this.setup();
            return;
        }
        player.handleKeyPress(keyCode, ball);
    },

    resetBallFull: function () {
        ball.reset(layout.centerX, layout.courtBottom - 50, 'PLAYER');
        ball.vx = 0;
        ball.vy = 0;
        ball.vz = 0;
        ball.isWaiting = false;
        ball.isTossing = false;
    },

    resetBallForServe: function () {
        ball.reset(player.x, player.y, 'PLAYER');
        ball.vx = 0;
        ball.vy = 0;
        ball.vz = 0;
        ball.isWaiting = true;
        ball.isTossing = false;
        this.ballResetTimer = 0;
        this.hasHitBall = false;
        this.needsReset = false;
    },

    resetBallForAIServe: function () {
        if (scoreManager) {
            scoreManager.currentServer = 'OPPONENT';
            scoreManager.currentSide = 'LEFT';
        }

        opponentAI = new AI(opponent);
        opponent.x = layout.sideLeft;
        opponent.y = layout.courtTop + 20;
        opponent.swingTimer = 0;
        opponent.isSwinging = false;

        ball.reset(opponent.x, opponent.y, 'OPPONENT');
        ball.vx = 0; ball.vy = 0; ball.vz = 0;
        ball.isWaiting = true;
        ball.isTossing = false;

        this.ballResetTimer = 0;
        this.hasHitBall = false;
        this.hasHitWithSkill = false;
        this.needsReset = false;
        this.successPauseTimer = 0;
        this.lastPlayerScore = scoreManager.playerPoints;
        this.lastOpponentScore = scoreManager.opponentPoints;
    },

    handleResetTimer: function (resetAction, waitLimit = 60) {
        if (this.needsReset) {
            this.ballResetTimer++;
            if (this.ballResetTimer > waitLimit) {
                resetAction();
            }
        } else {
            this.ballResetTimer = 0;
        }
    },

    handleMoveLogic: function () {
        let d = dist(player.x, player.y, tutorialManager.targetX, tutorialManager.targetY);

        if (d < 40 && this.successPauseTimer === 0) {
            this.scoringMessage = "WELL DONE!";
            this.successPauseTimer = 60;
        }
        if (this.successPauseTimer > 0) return;
    },

    handleServeLogic: function () {
        if (ball.isWaiting && !this.needsReset && this.successPauseTimer === 0) {
            scoreManager.currentServer = 'PLAYER';
            ball.x = player.x;
            ball.y = player.y;
            ball.vz = 0; ball.vx = 0; ball.vy = 0;
        }

        this.updateGameElements(false);

        if (this.hasHitBall && ball.z <= 0 && ball.y < layout.netY && this.successPauseTimer === 0) {
            this.scoringMessage = "GREAT SERVE!";
            this.successPauseTimer = 50;
        }

        if (this.successPauseTimer > 0) return;

        if (!this.needsReset) {
            if (!ball.isWaiting && !ball.isTossing && ball.vy < -2) {
                this.hasHitBall = true;
            }
            let status = this.getBallStatus();
            if (status.isDead || status.tossMissed) {
                this.needsReset = true;
            }
        }

        this.handleResetTimer(() => this.resetBallForServe(), 60);
    },

    handleReturnLogic: function () {
        if (ball.isWaiting && !this.needsReset && this.successPauseTimer === 0) {
            scoreManager.currentServer = 'OPPONENT';
            ball.x = opponent.x;
            ball.y = opponent.y;
            ball.vz = 0; ball.vx = 0; ball.vy = 0;
        }

        this.updateGameElements(true);

        if (this.hasHitBall && ball.y < layout.netY && this.successPauseTimer === 0) {
            this.scoringMessage = "GREAT RETURN!";
            this.successPauseTimer = 60;
        }

        if (this.successPauseTimer > 0) return;

        if (!this.needsReset) {
            if (!ball.isWaiting && !ball.isTossing && ball.vy < -2 && !this.hasHitBall) {
                this.hasHitBall = true;
            }
            let status = this.getBallStatus();
            if (status.isOut || status.isDead || (ball.isWaiting && this.hasHitBall)) {
                this.needsReset = true;
            }
        }

        this.handleResetTimer(() => this.resetBallForAIServe(), 60);
    },

    handleSkillLogic: function () {
        this.updateGameElements(true);

        if (player.skillCooldown > player.maxCooldown - 2 && this.successPauseTimer === 0) {
            if (!this.skillTriggered) {
                if (ball.z > 0 || abs(ball.vz) > 0.1) {
                    this.scoringMessage = "AMAZING SKILL!";
                    this.successPauseTimer = 60;
                    this.skillTriggered = true;
                }
            }
        } else {
            this.skillTriggered = false;
        }

        if (this.successPauseTimer > 0) return;

        if (!this.needsReset) {
            let status = this.getBallStatus();
            if (status.isDead || status.isOut) {
                this.needsReset = true;
            }
        }

        this.handleResetTimer(() => this.resetBallForAIServe(), 60);
    },

    handleScoringLogic: function () {
        this.updateGameElements(true);

        if (scoreManager.playerPoints > this.lastPlayerScore && this.successPauseTimer === 0) {
            this.scoringMessage = "YOU SCORE!";
            this.successPauseTimer = 90;
        }

        if (scoreManager.opponentPoints > this.lastOpponentScore && this.successPauseTimer === 0) {
            this.scoringMessage = "AI SCORE!";
            this.successPauseTimer = 90;
        }

        if (this.successPauseTimer > 0) return;

        if (!this.needsReset) {
            let status = this.getBallStatus();
            if (status.isDead || status.isOpponentOut || status.isPlayerOut) {
                let winner;
                if (status.isPlayerOut) {
                    winner = 'OPPONENT';
                } else if (status.isOpponentOut) {
                    winner = 'PLAYER';
                } else {
                    winner = (ball.y < layout.netY) ? 'PLAYER' : 'OPPONENT';
                }

                if (!ball.isWaiting && scoreManager) {
                    scoreManager.recordPoint(winner);
                }
                this.needsReset = true;
            }
        }

        this.handleResetTimer(() => this.resetBallForAIServe(), 60);
    },

    displayTutorialUI: function (txt) {
        push();
        textAlign(CENTER, CENTER);
        fill(255, 255, 0);
        textSize(24);
        text(txt, width / 2, height * 0.2);
        pop();
    },

    drawTargetZone: function (x, y) {
        push();
        noFill();
        stroke(255, 255, 0, 150);
        strokeWeight(5);
        ellipse(x, y, 60, 30);

        if (frameCount % 60 < 30) {
            fill(255, 255, 0, 50);
            ellipse(x, y, 60, 30);
        }
        pop();
    },

    drawTransitionOverlay: function () {
        let intro = tutorialManager.getStepIntro();

        push();
        rectMode(CORNER);

        fill(0, 0, 0, 180);
        rect(0, 0, width, height);

        textAlign(CENTER, CENTER);
        fill(255, 255, 0);
        textSize(48);
        text(intro.title, width / 2, height / 2 - 60);

        fill(255);
        textSize(22);
        text(intro.desc, width / 2, height / 2 + 20);

        fill(200);
        textSize(16);
        if (frameCount % 60 < 30) {
            let actionText = tutorialManager.currentStep > 5 ? "Press ANY KEY to Return to Menu" : "Press ANY KEY to Start";
            text(actionText, width / 2, height / 2 + 120);
        }
        pop();
    }
};