const Scene_Tutorial = {
    initializedStep: 0,
    ballResetTimer: 0,
    hasHitBall: false,
    needsReset: false,
    lastPlayerScore: 0,
    successPauseTimer: 0,
    skillTriggered: false,
    isPausedForIntro: false,
    lastOpponentScore: 0,
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
        this.scoringMessage = "";
    },

    resetState: function (step) {
        this.initializedStep = step;
        player.skillCooldown = 0;
        this.ballResetTimer = 0;
        this.needsReset = false;
        this.hasHitBall = false;
        this.skillTriggered = false;
        this.lastPlayerScore = 0;
        this.resetBallFull();
        this.lastPlayerScore = 0;
        this.lastOpponentScore = 0;
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

        player.update();
        player.display();
        player.displaySkillBar(20, height - 40, 150, 20);

        const step = tutorialManager.currentStep;
        this.handleStepInitialization(step);

        switch (step) {
            case 2: this.handleServeLogic(); break;
            case 3: this.handleReturnLogic(); break;
            case 4: this.handleSkillLogic(); break;
            case 5: this.handleScoringLogic(); break;
        }

        this.displayTutorialUI(tutorialManager.getCurrentPrompt());
        if (tutorialManager.hasTarget()) this.drawTargetZone(tutorialManager.targetX, tutorialManager.targetY);
        tutorialManager.checkProgress(player);
    },

    handleStepInitialization: function (step) {
        if (this.initializedStep === step) return;
        this.initializedStep = step;
        if (step === 2) this.initStep2();
        if (step === 3) this.initStep3();
        if (step === 4) this.initStep4();
        if (step === 5) this.initStep5();
    },

    initStep2: function () {
        this.step2Initialized = true;
        if (scoreManager) {
            scoreManager.currentServer = 'PLAYER';
            scoreManager.currentSide = 'RIGHT';
        }
        player.x = layout.sideRight;
        player.y = layout.courtBottom - 20;

        this.resetBallForServe();
    },

    initStep3: function () {
        this.step3Initialized = true;
        player.x = layout.centerX;
        player.y = layout.courtBottom - 100;

        opponent.x = layout.sideLeft;
        opponent.y = layout.courtTop + 20;

        this.resetBallForAIServe();
    },

    initStep4: function () {
        this.step4Initialized = true;
        player.skillCooldown = player.maxCooldown / 2;

        player.x = layout.centerX;
        player.y = layout.courtBottom - 100;
        this.resetBallForAIServe();
    },

    initStep5: function () {
        this.step5Initialized = true;
        scoreManager.init();
        this.lastPlayerScore = 0;
        this.resetBallForAIServe();
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

    handleScoringLogic: function () {

        if (this.successPauseTimer > 0) {
            this.successPauseTimer--;
            
            push();
            rectMode(CORNER);
            fill(0, 0, 0, 100);
            rect(0, 0, width, height);

            textAlign(CENTER, CENTER);
            stroke(0);
            strokeWeight(4);
            textSize(50);

            if (this.scoringMessage.includes("YOU")) {
                fill(0, 255, 0);
            } else {
                fill(255, 0, 0);
            }
            
            text(this.scoringMessage, width / 2, height / 2);
            pop();

            if (this.successPauseTimer === 0) {
                if (this.scoringMessage.includes("YOU")) {
                    tutorialManager.registerPoint();
                }
                this.resetBallForAIServe();
                this.lastPlayerScore = scoreManager.playerPoints;
                this.lastOpponentScore = scoreManager.opponentPoints;
            }
            return;
        }
        opponentAI.update(ball);
        opponent.update(true);
        opponent.display();

        ball.update();
        ball.checkHit(player);
        ball.checkHit(opponent);
        ball.display();

        if (scoreManager.playerPoints > this.lastPlayerScore) {
            this.scoringMessage = "YOU SCORE!";
            this.successPauseTimer = 90;
            return;
        }
        
        if (scoreManager.opponentPoints > this.lastOpponentScore) {
            this.scoringMessage = "AI SCORE!";
            this.successPauseTimer = 90;
            return;
        }

        if (scoreManager.playerPoints > this.lastPlayerScore) {
            tutorialManager.registerPoint();
            this.lastPlayerScore = scoreManager.playerPoints;
        }

        if (!this.needsReset) {
            let ballIsDead = !ball.isWaiting && ball.z <= 0 && ball.vz <= 0;
            let isOpponentOut = ball.y < layout.courtTop - 50;
            let isPlayerOut = ball.y > layout.courtBottom + 50;

            if (ballIsDead || isOpponentOut || isPlayerOut) {
                let winner = (ball.y < layout.netY || isOpponentOut) ? 'PLAYER' : 'OPPONENT';

                if (!ball.isWaiting && scoreManager) {
                    scoreManager.recordPoint(winner);
                }

                this.needsReset = true;
            }
        }

        if (this.needsReset) {
            this.ballResetTimer++;
            if (this.ballResetTimer > 60) {
                this.resetBallForAIServe();
                this.lastPlayerScore = scoreManager.playerPoints;
                this.needsReset = false;
            }
        }
    },

    handleSkillLogic: function () {
        opponentAI.update(ball);
        opponent.update(true);
        opponent.display();

        ball.update();
        ball.checkHit(player);
        ball.checkHit(opponent);
        ball.display();

        if (player.skillCooldown > player.maxCooldown - 2) {
            if (!this.skillTriggered) {
                if (ball.z > 0 || abs(ball.vz) > 0.1) {
                    tutorialManager.registerSkillHit();
                    this.skillTriggered = true;
                }
            }
        } else {
            this.skillTriggered = false;
        }

        if (!this.needsReset) {
            let ballIsDead = !ball.isWaiting && ball.z <= 0 && ball.vz <= 0;
            let isOutOfBounds = ball.y > layout.courtBottom + 100 || ball.y < layout.courtTop - 150;

            if (ballIsDead || isOutOfBounds) {
                this.needsReset = true;
            }
        }

        if (this.needsReset) {
            this.ballResetTimer++;
            if (this.ballResetTimer > 60) {
                this.resetBallForAIServe();
            }
        } else {
            this.ballResetTimer = 0;
        }
    },

    resetBallForAIServe: function () {
        if (scoreManager) {
            scoreManager.currentServer = 'OPPONENT';
            scoreManager.currentSide = 'LEFT';
        }

        ball.reset(opponent.x, opponent.y, 'OPPONENT');
        ball.vx = 0; ball.vy = 0; ball.vz = 0;
        ball.isWaiting = true;
        ball.isTossing = false;

        opponentAI = new AI(opponent);
        opponent.x = layout.sideLeft;
        opponent.y = layout.courtTop + 20;
        opponent.swingTimer = 0;
        opponent.isSwinging = false;

        this.ballResetTimer = 0;
        this.hasHitBall = false;
        this.hasHitWithSkill = false;
        this.needsReset = false;
        this.successPauseTimer = 0;
        this.lastPlayerScore = scoreManager.playerPoints;
        this.lastOpponentScore = scoreManager.opponentPoints;
    },


    handleServeLogic: function () {

        if (this.successPauseTimer > 0) {
            this.successPauseTimer--;

            push();
            textAlign(CENTER, CENTER);
            fill(255, 255, 0);
            stroke(0);
            strokeWeight(4);
            textSize(40);
            text("GREAT SERVE!", width / 2, height / 2);
            pop();

            if (this.successPauseTimer === 0) {
                tutorialManager.registerServe();
                this.resetBallForServe();
            }
            return;
        }
        if (ball.isWaiting) {
            scoreManager.currentServer = 'PLAYER';
            ball.x = player.x;
            ball.y = player.y;
            ball.vz = 0; ball.vx = 0; ball.vy = 0;
        }

        ball.update();
        if (!ball.isWaiting) {
            ball.checkHit(player);
        }
        ball.display();

        if (this.hasHitBall && ball.z <= 0 && ball.y < layout.netY) {
            this.successPauseTimer = 50;
            return;
        }

        if (!this.needsReset) {
            if (!ball.isWaiting && !ball.isTossing && ball.vy < -2) {
                this.hasHitBall = true;
                this.needsReset = true;
            }

            let ballIsDead = !ball.isWaiting && ball.z <= 0 && ball.vz <= 0;
            let tossMissed = ball.isTossing && ball.vy > 0 && ball.y > layout.courtBottom + 50;

            if (ballIsDead || tossMissed) {
                this.needsReset = true;
            }
        }

        if (this.needsReset) {
            this.ballResetTimer++;

            let waitLimit = this.hasHitBall ? 100 : 30;

            if (this.ballResetTimer > waitLimit) {
                if (this.hasHitBall) {
                    tutorialManager.registerServe();
                }
                this.resetBallForServe();
            }
        } else {
            this.ballResetTimer = 0;
        }
    },

    handleReturnLogic: function () {
        if (ball.isWaiting) {
            scoreManager.currentServer = 'OPPONENT';
            ball.x = opponent.x;
            ball.y = opponent.y;
            ball.vz = 0; ball.vx = 0; ball.vy = 0;
        }
        if (ball.isWaiting || ball.isTossing) {
            opponentAI.update(ball);
        }
        opponent.update(true);
        opponent.display();

        ball.update();
        if (!ball.isWaiting) ball.checkHit(player);
        ball.checkHit(opponent);
        ball.display();

        if (this.successPauseTimer > 0) {
            this.successPauseTimer--;

            push();
            textAlign(CENTER, CENTER);
            fill(0, 255, 0);
            textSize(40);
            text("GREAT RETURN!", width / 2, height / 2);
            pop();

            if (this.successPauseTimer === 0) {
                tutorialManager.registerReturn();
                this.resetBallForAIServe();
            }
            return;
        }

        if (!ball.isWaiting && !ball.isTossing && ball.vy < -2 && !this.hasHitBall) {
            this.hasHitBall = true;
            this.needsReset = true;
        }

        if (ball.y > layout.courtBottom + 50 || ball.y < layout.courtTop - 100) {
            this.needsReset = true;
        }

        if (this.hasHitBall && ball.z <= 0 && ball.y < layout.netY) {
            this.successPauseTimer = 60;
            return;
        }

        if (!this.needsReset) {
            if (!ball.isWaiting && !ball.isTossing && ball.vy < -2 && !this.hasHitBall) {
                this.hasHitBall = true;
                this.needsReset = true;
            }

            let ballIsDead = !ball.isWaiting && ball.z <= 0 && ball.vz <= 0;
            if (ball.y > layout.courtBottom + 50 || ball.y < layout.courtTop - 100 || ballIsDead) {
                this.needsReset = true;
            }
        }

        if (this.needsReset) {
            this.ballResetTimer++;
            if (this.ballResetTimer > 60) {
                if (this.hasHitBall) {
                    tutorialManager.registerReturn();
                }
                this.resetBallForAIServe();
            }
        } else {
            this.ballResetTimer = 0;
        }
    },

    handleInput: function () {
        if (this.isPausedForIntro) {
            this.isPausedForIntro = false;
            return;
        }
        if (keyCode === ESCAPE) {
            this.setup();
            currentState = GAME_CONFIG.STATES.MENU;
            return;
        }
        player.handleKeyPress(keyCode, ball);
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
            text("Press ANY KEY to Start", width / 2, height / 2 + 120);
        }
        pop();
    }
};