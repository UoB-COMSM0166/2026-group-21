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
    pendingSuccessDelay: 0,
    pendingSuccessMessage: "",
    pendingSuccessPauseDuration: 0,
    isSkillReady: false,
    victorySoundPlayedInTutorial: false,
    isDevMode: false,

    setup: function () {
        player.isAI = false;
        opponent.isAI = true;
        if (typeof opponentAI !== 'undefined' && opponentAI) {
            opponentAI.setPersonality('basic');
        }
        tutorialManager = new TutorialManager();
        this.victorySoundPlayedInTutorial = false;
        if (scoreManager) {
            scoreManager.init();
            scoreManager.currentServer = 'NONE';
        }

        if (characterImages[0] && characterImages[3]) {
            player.img = characterImages[3].back;
            opponent.img = characterImages[0].front;
        }

        player.skillType = 'FEATHER_STORM';
        player.charName = 'bird';

        this.resetState(0);
        this.isPausedForIntro = true;
        player.x = layout.sideRight;
        player.y = layout.courtBottom - GAME_CONFIG.TUTORIAL.PLAYER_SERVE_Y_OFFSET;

        this.stepHandlers = {
            1: {
                init: null,
                handle: () => this.handleMoveLogic(),
                onSuccess: () => {
                    tutorialManager.nextStep();
                }
            },
            2: {
                init: () => this.setupServeState({ role: 'PLAYER', step: 2 }),
                handle: () => this.handleServeLogic(),
                onSuccess: () => {
                    tutorialManager.registerSuccess();
                    this.resetBallForServe();
                }
            },
            3: {
                init: () => this.setupServeState({ role: 'OPPONENT', step: 3 }),
                handle: () => this.handleReturnLogic(),
                onSuccess: () => {
                    tutorialManager.registerSuccess();
                    this.resetBallForAIServe();
                }
            },
            4: {
                init: () => this.setupServeState({ role: 'OPPONENT', step: 4 }),
                handle: () => this.handleSkillLogic(),
                onSuccess: () => {
                    tutorialManager.registerSuccess();
                    this.resetBallForAIServe();
                }
            },
            5: {
                init: () => {
                    if (typeof opponentAI !== 'undefined' && opponentAI) {
                        const t = GAME_CONFIG.TUTORIAL;
                        opponentAI.speedMult = t.FINAL_STAGE_SPEED_MULT;
                        opponentAI.reactionDelay = t.FINAL_STAGE_REACTION_DELAY;
                        opponentAI.errorRange = t.FINAL_STAGE_ERROR_RANGE;
                        opponentAI.prediction = t.FINAL_STAGE_PREDICTION;
                    }
                    this.setupServeState({ role: 'OPPONENT', step: 5 });
                },
                handle: () => this.handleScoringLogic(),
                onSuccess: () => {
                    if (this.scoringMessage === "YOU SCORE!") {
                        tutorialManager.registerSuccess();
                    }
                    this.resetBallForAIServe();
                    this.lastPlayerScore = scoreManager.playerPoints;
                    this.lastOpponentScore = scoreManager.opponentPoints;
                }
            },
        };
    },

    draw: function () {
        strokeWeight(GAME_CONFIG.VISUALS.BASE_STROKE_WEIGHT);
        stroke(...GAME_CONFIG.COLORS.BLACK);
        background(backgroundImg);
        
        push();
        scale(layout.scaleFactor);
        
        imageMode(CORNER);
        image(courtImg, layout.courtLeft, layout.courtTop, layout.COURT_W, layout.COURT_H);

        if (this.isPausedForIntro) {
            player.display();
            ball.display();
            this.drawTransitionOverlay();
            pop();
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
            Scene_Game.drawCircularSkillUI(
                layout.courtRight + 180,
                layout.courtBottom - 80,
                player.skillCooldown === 0 ? 100 : map(player.skillCooldown, player.maxCooldown, 0, 0, 100),
                player.charName
            );
        }
        this.handleStepInitialization(step);

        const handler = this.stepHandlers[step];
        const hasOpponent = (step >= 3);
        const hasBall = (step >= 2);

        this.updateGameElements(hasOpponent, hasBall);
        if (this.successPauseTimer === 0) {
            if (handler) handler.handle();
        }

        this.displayTutorialUI(tutorialManager.getCurrentPrompt());
        if (tutorialManager.hasTarget()) {
            this.drawTargetZone(tutorialManager.targetX, tutorialManager.targetY);
        }
        this.handleSuccessPause();

        if (this.isDevMode) {
            this.drawDevMenu();
        }

        pop();
    },

    // Sets up the players, score manager, and ball state for specific tutorial steps
    setupServeState: function (stepConfig) {
        player.x = layout.sideRight;
        player.y = layout.courtBottom - GAME_CONFIG.TUTORIAL.PLAYER_SERVE_Y_OFFSET;

        if (stepConfig.role === 'PLAYER') {
            if (scoreManager) {
                scoreManager.currentServer = 'PLAYER';
                scoreManager.currentSide = 'RIGHT';
            }
            this.resetBallForServe();
        } else {
            opponent.x = layout.sideLeft;
            opponent.y = layout.courtTop + GAME_CONFIG.TUTORIAL.OPPONENT_START_Y_OFFSET;

            if (stepConfig.step === 4) {
                player.activeBuff = null;
            } else if (stepConfig.step === 5) {
                if (scoreManager) scoreManager.init();
                this.lastPlayerScore = 0;
                this.lastOpponentScore = 0;
            }
            this.resetBallForAIServe();
        }
    },

    resetState: function (step) {
        this.initializedStep = step;
        this.pendingSuccessDelay = 0;
        player.skillCooldown = player.maxCooldown;
        this.isSkillReady = false;
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

    updateFrozen: function (entity) {
        const tempX = entity.x;
        const tempY = entity.y;
        entity.update();
        entity.x = tempX;
        entity.y = tempY;
    },

    // Updates positions of players and ball, pausing logic if success message is showing
    updateGameElements: function (hasOpponent = true, hasBall = true) {
        if (hasOpponent) {
            if (this.successPauseTimer > 0) {
                this.updateFrozen(opponent);
            } else {
                if (!this.needsReset) opponentAI.update(ball);
                opponent.update();
            }
            opponent.display();
        }
        if (hasBall) {
            if (this.successPauseTimer === 0) {
                ball.update();
                if (!ball.isWaiting) ball.checkHit(player);
                if (hasOpponent) ball.checkHit(opponent);
            }
            ball.display();
        }
    },

    // Checks if the ball hit the net, went out of bounds, or the toss failed
    getBallStatus: function () {
        const offset = GAME_CONFIG.TUTORIAL.OUT_OFFSET_Y;
        return {
            isDead: !ball.isWaiting && ball.z <= 0 && abs(ball.vz) < GAME_CONFIG.TUTORIAL.DEAD_BALL_VZ_THRESHOLD,
            isOut: ball.y > layout.courtBottom + offset || ball.y < layout.courtTop - (offset * 2),
            isOpponentOut: ball.y < layout.courtTop - offset,
            isPlayerOut: ball.y > layout.courtBottom + offset,
            tossMissed: ball.isTossing && ball.vy > 0 && ball.y > layout.courtBottom + offset
        };
    },

    handleInput: function () {
        if (this.isPausedForIntro) {
            if (tutorialManager.currentStep > 5) {
                if (soundManager && soundManager.sounds.victory) {
                    soundManager.sounds.victory.stop();
                }
                currentState = GAME_CONFIG.STATES.MENU;
                return;
            }
            this.isPausedForIntro = false;
            return;
        }
        if (key === '9') {
            this.isDevMode = !this.isDevMode;
            if (soundManager) soundManager.play('select');
            return;
        }
        if (this.isDevMode) {
            const stepMap = { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 };
            if (stepMap[key] !== undefined) {
                this.jumpToStep(stepMap[key]);
                if (soundManager) soundManager.play('select');
                return;
            }
        }
        if (this.successPauseTimer > 0) return;
        if (keyCode === ESCAPE) {
            pausedFromState = GAME_CONFIG.STATES.TUTORIAL;
            currentState = GAME_CONFIG.STATES.PAUSED;
            return;
        }
        player.handleKeyPress(keyCode, ball);
    },

    jumpToStep: function (step) {
        tutorialManager.currentStep = step;
        tutorialManager.successCount = 0;
        this.initializedStep = -1;
        this.isPausedForIntro = true;
        this.successPauseTimer = 0;
        this.pendingSuccessDelay = 0;
        this.ballResetTimer = 0;
        this.hasHitBall = false;
        this.needsReset = false;
        this.skillTriggered = false;
        this.scoringMessage = "";
    },

    drawDevMenu: function () {
        push();
        fill(...GAME_CONFIG.COLORS.DARK_GRAY);
        noStroke();
        rect(10, 10, 280, 130, 10);

        fill(...GAME_CONFIG.COLORS.YELLOW);
        textSize(GAME_CONFIG.UI.SIZE_SUB);
        textAlign(LEFT, TOP);
        text("TUTORIAL DEV MODE", 20, 20);

        fill(255);
        textSize(GAME_CONFIG.UI.DEV_MODE_TEXT);
        text(`Current Step: ${tutorialManager.currentStep} / 5`, 20, 50);
        text(`Success Count: ${tutorialManager.successCount} / ${tutorialManager.targetCount}`, 20, 75);
        fill(200, 200, 200);
        textSize(GAME_CONFIG.UI.HUD_SCORE_SUB);
        text("Press '1'–'5' to jump to step  |  '9' to close", 20, 105);
        pop();
    },

    resetBallFull: function () {
        ball.reset(layout.sideRight,
            layout.courtBottom - GAME_CONFIG.TUTORIAL.PLAYER_SERVE_Y_OFFSET, 'PLAYER');
        ball.isWaiting = false;
    },

    resetBallForServe: function () {
        player.x = layout.sideRight;
        player.y = layout.courtBottom - GAME_CONFIG.TUTORIAL.PLAYER_SERVE_Y_OFFSET;
        player.swingTimer = 0;

        ball.reset(player.x, player.y, 'PLAYER');
        this.ballResetTimer = 0;
        this.hasHitBall = false;
        this.needsReset = false;
        this.pendingSuccessDelay = 0;
        player.skillCooldown = player.maxCooldown;
    },

    resetBallForAIServe: function () {
        if (scoreManager) {
            // For tutorial steps 3, 4, 5 AI always serve from left
            scoreManager.currentServer = 'OPPONENT';
            scoreManager.currentSide = 'LEFT';
        }

        player.x = layout.sideRight;
        player.y = layout.courtBottom - GAME_CONFIG.TUTORIAL.PLAYER_SERVE_Y_OFFSET;
        player.swingTimer = 0;

        if (opponentAI) {
            opponentAI.resetServeState();
        }
        opponent.x = layout.sideLeft;
        opponent.y = layout.courtTop + GAME_CONFIG.TUTORIAL.OPPONENT_START_Y_OFFSET;
        opponent.swingTimer = 0;

        ball.reset(opponent.x, opponent.y, 'OPPONENT');

        this.ballResetTimer = 0;
        this.hasHitBall = false;
        this.needsReset = false;
        this.successPauseTimer = 0;
        this.pendingSuccessDelay = 0;
        this.skillTriggered = false;
        player.activeBuff = null;

        if (tutorialManager && tutorialManager.currentStep === 4) {
            player.skillCooldown = 0;
            this.isSkillReady = true;
        } else {
            player.skillCooldown = player.maxCooldown;
            this.isSkillReady = false;
        }

        this.lastPlayerScore = scoreManager.playerPoints;
        this.lastOpponentScore = scoreManager.opponentPoints;
    },

    handleResetTimer: function (resetAction) {
        if (this.needsReset) {
            player.skillCooldown = player.maxCooldown;
            this.isSkillReady = false;
            this.ballResetTimer++;
            if (this.ballResetTimer > GAME_CONFIG.TUTORIAL.RESET_WAIT_LIMIT) {
                resetAction();
            }
        } else {
            this.ballResetTimer = 0;
        }
    },

    handleMoveLogic: function () {
        let d = dist(player.x, player.y, tutorialManager.targetX, tutorialManager.targetY);

        if (d < GAME_CONFIG.TUTORIAL.TARGET_RADIUS && this.successPauseTimer === 0) {
            this.scoringMessage = "WELL DONE!";
            this.successPauseTimer = GAME_CONFIG.TUTORIAL.PAUSE_MINOR;
        }
        if (this.successPauseTimer > 0) return;
    },

    // Step 2: Hitting a valid serve over the net
    handleServeLogic: function () {
        if (ball.isWaiting && !this.needsReset) {
            scoreManager.currentServer = 'PLAYER';
            ball.x = player.x;
            ball.y = player.y;
            ball.vz = 0; ball.vx = 0; ball.vy = 0;
        }

        // Check if player hit the ball over the net successfully
        if (this.hasHitBall && 
            ball.z <= 0 && 
            ball.y < layout.netY && 
            this.pendingSuccessDelay === 0 && 
            this.successPauseTimer === 0) {
            this.pendingSuccessMessage = "GREAT SERVE!";
            this.pendingSuccessPauseDuration = GAME_CONFIG.TUTORIAL.PAUSE_MINOR;
            this.pendingSuccessDelay = 30;
        }

        if (this.pendingSuccessDelay > 0) return;

        if (!this.needsReset) {
            // Player struck the ball
            if (!ball.isWaiting && !ball.isTossing && ball.vy < GAME_CONFIG.TUTORIAL.HIT_VY_THRESHOLD) {
                this.hasHitBall = true;
            }
            let status = this.getBallStatus();
            // Reset if ball hit net or toss was missed
            if (status.isDead || status.tossMissed) {
                this.needsReset = true;
            }
        }
        this.handleResetTimer(() => this.resetBallForServe());
    },

    // Step 3: Returning the opponent's serve successfully
    handleReturnLogic: function () {
        if (ball.isWaiting && !this.needsReset) {
            scoreManager.currentServer = 'OPPONENT';
            ball.x = opponent.x;
            ball.y = opponent.y;
            ball.vz = 0; ball.vx = 0; ball.vy = 0;
        }

        // Check if player returned the ball over the net
        if (this.hasHitBall && 
            ball.y < layout.netY && 
            this.pendingSuccessDelay === 0 && 
            this.successPauseTimer === 0) {
            this.pendingSuccessMessage = "GREAT RETURN!";
            this.pendingSuccessPauseDuration = GAME_CONFIG.TUTORIAL.PAUSE_MINOR;
            this.pendingSuccessDelay = 20;
        }

        if (this.pendingSuccessDelay > 0) return;

        if (!this.needsReset) {
            // Player successfully struck the ball
            if (!ball.isWaiting && !ball.isTossing
                && ball.vy < GAME_CONFIG.TUTORIAL.HIT_VY_THRESHOLD && !this.hasHitBall) {
                this.hasHitBall = true;
            }
            let status = this.getBallStatus();
            // Reset if ball went out, died, or player missed the hit
            if (status.isOut || status.isDead || (ball.isWaiting && this.hasHitBall)) {
                this.needsReset = true;
            }
        }
        this.handleResetTimer(() => this.resetBallForAIServe());
    },

    // Step 4: Successfully using the special skill mechanics
    handleSkillLogic: function () {
        if (player.skillCooldown === 0) {
            this.isSkillReady = true;
        }
        // when skill fires, cooldown resets to maxCooldown; detect that jump within a 5-frame window
        let hasJustFiredSkill = this.isSkillReady && 
            (player.skillCooldown > player.maxCooldown - GAME_CONFIG.TUTORIAL.SKILL_TRIGGER_MARGIN);

        if (hasJustFiredSkill && 
            !this.skillTriggered && 
            this.pendingSuccessDelay === 0 && 
            this.successPauseTimer === 0) {
            this.pendingSuccessMessage = "AMAZING SKILL!";
            this.pendingSuccessPauseDuration = GAME_CONFIG.TUTORIAL.PAUSE_MINOR;
            this.pendingSuccessDelay = 30;
            this.skillTriggered = true;
        }

        if (this.pendingSuccessDelay > 0) return;

        if (!this.needsReset) {
            let status = this.getBallStatus();
            // Reset if the ball dies or goes out of bounds
            if (status.isDead || status.isOut) {
                this.needsReset = true;
                player.activeBuff = null;
            }
        }
        this.handleResetTimer(() => this.resetBallForAIServe());
    },

    // Step 5: The final mock match with full score and win condition logic
    handleScoringLogic: function () {
        // player score a new point?
        if (scoreManager.playerPoints > this.lastPlayerScore) {
            this.scoringMessage = "YOU SCORE!";
            this.successPauseTimer = GAME_CONFIG.TUTORIAL.PAUSE_MAJOR;
            this.lastPlayerScore = scoreManager.playerPoints;
            return;
        }
        // AI score a new point?
        if (scoreManager.opponentPoints > this.lastOpponentScore) {
            this.scoringMessage = "AI SCORE!";
            this.successPauseTimer = GAME_CONFIG.TUTORIAL.PAUSE_MAJOR;
            this.lastOpponentScore = scoreManager.opponentPoints;
            return;
        }

        if (!this.needsReset) {
            let status = this.getBallStatus();
            // Ball died or went out of bounds, so the rally is over
            if (status.isDead || status.isOpponentOut || status.isPlayerOut) {
                let winner;
                if (status.isPlayerOut) {
                    winner = 'OPPONENT';
                } else if (status.isOpponentOut) {
                    winner = 'PLAYER';
                } else {
                    // If it died in-court, winner is whoever hit it over the net
                    winner = (ball.y < layout.netY) ? 'PLAYER' : 'OPPONENT';
                }

                if (!ball.isWaiting && !ball.roundEnding) {
                    ball.terminateRound(winner);
                }
                this.needsReset = true;
            }
        }
        this.handleResetTimer(() => {
            this.lastPlayerScore = scoreManager.playerPoints;
            this.lastOpponentScore = scoreManager.opponentPoints;
            this.resetBallForAIServe();
        });
    },

    handleSuccessPause: function () {
        // pendingSuccessDelay adds a short buffer before showing the message
        if (this.pendingSuccessDelay > 0) {
            this.pendingSuccessDelay--;
            if (this.pendingSuccessDelay === 0) {
                this.scoringMessage = this.pendingSuccessMessage;
                this.successPauseTimer = this.pendingSuccessPauseDuration;
            }
        }

        if (this.successPauseTimer <= 0) return;
        const { PAUSE_MINOR, PAUSE_MAJOR } = GAME_CONFIG.TUTORIAL;

        // Only trigger sound on the exact initial frame we entered the success state
        const isAIMessage = this.scoringMessage.includes("AI");
        if (!isAIMessage) {
            if (this.successPauseTimer === PAUSE_MINOR &&
                this.scoringMessage !== "YOU SCORE!") {
                if (soundManager) soundManager.play('success');
            } else if (this.successPauseTimer === PAUSE_MAJOR) {
                if (soundManager) soundManager.play('success');
            }
        }
        this.successPauseTimer--;
        push();
        textAlign(CENTER, CENTER);
        stroke(...GAME_CONFIG.COLORS.BLACK); strokeWeight(6); textSize(GAME_CONFIG.TUTORIAL.SUCCESS_TEXT_SIZE);
        if (this.scoringMessage.includes("AI")) fill(...GAME_CONFIG.COLORS.TEXT_ERROR);
        else if (this.scoringMessage.includes("GREAT")) fill(...GAME_CONFIG.COLORS.YELLOW);
        else fill(0, 255, 0);

        text(this.scoringMessage, layout.VIRTUAL_W / 2, layout.VIRTUAL_H / 2);
        pop();

        if (this.successPauseTimer === 0) {
            const handler = this.stepHandlers[tutorialManager.currentStep];
            if (handler?.onSuccess) handler.onSuccess();
        }
    },

    displayTutorialUI: function (txt) {
        push();
        textAlign(CENTER, TOP);
        textStyle(BOLD);
        stroke(...GAME_CONFIG.COLORS.BLACK);
        strokeWeight(4);
        fill(...GAME_CONFIG.COLORS.GOLD);
        const { UI_TEXT_SIZE, UI_BOX_W, UI_BOX_H } = GAME_CONFIG.TUTORIAL;
        textSize(UI_TEXT_SIZE);
        let boxX = (layout.VIRTUAL_W - UI_BOX_W) / 2;
        let boxY = layout.VIRTUAL_H * 0.85;

        text(txt, boxX, boxY, UI_BOX_W, UI_BOX_H);
        pop();
    },

    drawTargetZone: function (x, y) {
        push();
        const { TARGET_ZONE_W, TARGET_ZONE_H } = GAME_CONFIG.TUTORIAL;
        noFill();
        stroke(...GAME_CONFIG.COLORS.GOLD);
        strokeWeight(5);
        ellipse(x, y, TARGET_ZONE_W, TARGET_ZONE_H);

        if (frameCount % 60 < 30) {
            fill(...GAME_CONFIG.COLORS.TUTORIAL_TEXT_HIGHLIGHT);
            ellipse(x, y, TARGET_ZONE_W, TARGET_ZONE_H);
        }
        pop();
    },

    drawTransitionOverlay: function () {
        let intro = tutorialManager.getStepIntro();

        if (tutorialManager.currentStep > 5) {
            if (soundManager && !this.victorySoundPlayedInTutorial) {
                soundManager.play('victory');
                this.victorySoundPlayedInTutorial = true;
            }
        }

        push();
        fill(...GAME_CONFIG.COLORS.BLACK, 200);
        rect(0, 0, layout.VIRTUAL_W, layout.VIRTUAL_H);

        textAlign(CENTER, CENTER);
        textStyle(BOLD);

        // title
        fill(...GAME_CONFIG.COLORS.GOLD);
        textSize(64);
        text(intro.title, layout.VIRTUAL_W / 2, layout.VIRTUAL_H * 0.3);

        fill(...GAME_CONFIG.COLORS.WHITE);
        textSize(32);
        let descW = 700;
        text(intro.desc, layout.VIRTUAL_W / 3.4, layout.VIRTUAL_H * 0.32, descW, 300);

        fill(GAME_CONFIG.COLORS.MENU_BG_DARK);
        textSize(24);
        if (frameCount % 60 < 30) {
            let actionText = tutorialManager.currentStep > 5 
                ? "Press ANY KEY to Return to Menu" 
                : "Press ANY KEY to Start";
            text(actionText, layout.VIRTUAL_W / 2, layout.VIRTUAL_H * 0.69);
        }
        pop();
    }
};