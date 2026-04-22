class SoundManager {
    constructor() {
        this.basePath = 'assets/sounds/';
        this.sounds = {};
        this.currentBGM = null; // which sound
        this.targetVolume = GAME_CONFIG.SOUND.TARGET_VOLUME_DEFAULT;  //volume
        this.sfxVolume = GAME_CONFIG.SOUND.SFX_VOLUME_DEFAULT;
        this.isFading = false;
        this.fadeOutTimeouts = [];
        this.loopTimeouts = [];
        this.lastPlayTime = {};
        this.needsMusicStateReset = false;

        let startAudio = () => {
            if (getAudioContext().state !== 'running') {
                userStartAudio().then(() => {
                    this.needsMusicStateReset = true;
                    this.isFading = false;
                    if (this.currentBGM && this.currentBGM.isLoaded() && !this.currentBGM.isPlaying()) {
                        this.playBGMWithFadeLoop(this.currentBGM, GAME_CONFIG.SOUND.FADE_TIME_DEFAULT);
                    }
                });
            }
            window.removeEventListener('mousedown', startAudio);
            window.removeEventListener('keydown', startAudio);
        }
        window.addEventListener('mousedown', startAudio);
        window.addEventListener('keydown', startAudio);
    }

    loadSounds() {
        this.sounds.bgmGame = loadSound(this.basePath + 'bgm/bgm_game.mp3', () => {
            this.sounds.bgmGame.setVolume(0);
        });
        this.sounds.bgmMenu = loadSound(this.basePath + 'bgm/bgm_main_menu.mp3', () => {
            this.sounds.bgmMenu.setVolume(0);
        });

        const sfxPath = this.basePath + 'sfx/';

        const ballPath = sfxPath + 'ball_interaction/';
        this.sounds.swing = loadSound(ballPath + 'fast_travel.wav');
        this.sounds.hit = loadSound(ballPath + 'frame_hit.wav');

        const crowdPath = sfxPath + 'crowd_dynamics/';
        this.sounds.clap = loadSound(crowdPath + 'cheer.wav');
        this.sounds.boo = loadSound(crowdPath + 'disappoint_1.wav');
        this.sounds.victory = loadSound(crowdPath + 'win.wav');

        const uiPath = sfxPath + 'ui/';
        this.sounds.select = loadSound(uiPath + 'button_hover.mp3');
        this.sounds.confirm = loadSound(uiPath + 'button_click.mp3');
        this.sounds.success = loadSound(uiPath + 'success.mp3');
    }

    //change BGM
    updateBGM(state) {
        if (!this.sounds.bgmGame || !this.sounds.bgmMenu) return;
        if (!this.sounds.bgmGame.isLoaded() || !this.sounds.bgmMenu.isLoaded()) return;
        let nextBGM = (state === GAME_CONFIG.STATES.PLAYING) ? this.sounds.bgmGame : this.sounds.bgmMenu;

        let isDifferent = this.currentBGM !== nextBGM;
        let isNotPlaying = this.currentBGM && !this.currentBGM.isPlaying();

        if (isDifferent || isNotPlaying || !this.currentBGM) {
            this.transitionTo(nextBGM);
        }
    }

    // smoothly switch from current BGM to a new one
    transitionTo(nextBGM) {
        if (!nextBGM || !nextBGM.isLoaded()) return;
        if (this.currentBGM === nextBGM && nextBGM.isPlaying()) return;

        if (this.fadeOutTimeouts) {
            this.fadeOutTimeouts.forEach(t => clearTimeout(t));
        }
        this.fadeOutTimeouts = [];
        if (this.loopTimeouts) {
            this.loopTimeouts.forEach(t => clearTimeout(t));
        }
        this.loopTimeouts = [];

        this.isFading = true;
        const fadeTime = GAME_CONFIG.SOUND.FADE_TIME_DEFAULT;
        let oldBGM = this.currentBGM;
        // fade out the old music
        if (oldBGM && oldBGM.isLoaded() && oldBGM.isPlaying()) {
            oldBGM.setVolume(0, fadeTime);
            let t1 = setTimeout(() => {
                if (this.currentBGM !== oldBGM && oldBGM.isLoaded() && oldBGM.isPlaying()) {
                    oldBGM.stop();
                }
            }, fadeTime * 1000);
            this.fadeOutTimeouts.push(t1);
        }

        this.currentBGM = nextBGM;
        // fade in the new music
        if (getAudioContext().state === 'running') {
            this.currentBGM.setVolume(0);
            let t2 = setTimeout(() => {
                this.playBGMWithFadeLoop(this.currentBGM, fadeTime);

                let t3 = setTimeout(() => {
                    this.isFading = false;
                }, fadeTime * 1000);
                this.loopTimeouts.push(t3);
            }, GAME_CONFIG.SOUND.BUFFER_MS);
            this.loopTimeouts.push(t2);
        } else {
            this.isFading = false;
            if (oldBGM && oldBGM.isLoaded() && oldBGM.isPlaying()) {
                oldBGM.stop();
            }
        }
    }

    // plays BGM with a smooth fade-in and manual seamless looping
    playBGMWithFadeLoop(bgm, fadeTime) {
        if (!bgm || !bgm.isLoaded()) return;

        bgm.stop();
        if (this.loopTimeouts) {
            this.loopTimeouts.forEach(t => clearTimeout(t));
        }
        this.loopTimeouts = [];

        bgm.setVolume(0);
        bgm.play(0, 1, 0);

        // slight delay before fading in to avoid audio pop at track start
        let tFadeIn = setTimeout(() => {
            if (this.currentBGM === bgm) {
                bgm.setVolume(0);
                bgm.setVolume(this.targetVolume, fadeTime);
            }
        }, GAME_CONFIG.SOUND.BUFFER_MS);
        this.loopTimeouts.push(tFadeIn);

        let dur = bgm.duration();
        // if track is long enough, manually cross-fade near the end and restart to avoid abrupt loop click
        if (dur > fadeTime * GAME_CONFIG.SOUND.FADE_TIME_MULTIPLIER) {
            let fadeOutStart = (dur - fadeTime) * 1000;
            let loopTimeout = setTimeout(() => {
                if (this.currentBGM === bgm && bgm.isPlaying()) {
                    bgm.setVolume(0, fadeTime);

                    let restartTimeout = setTimeout(() => {
                        if (this.currentBGM === bgm) {
                            this.playBGMWithFadeLoop(bgm, fadeTime);
                        }
                    }, fadeTime * 1000);
                    this.loopTimeouts.push(restartTimeout);
                }
            }, fadeOutStart);
            this.loopTimeouts.push(loopTimeout);
        } else {
            bgm.loop();
            bgm.setVolume(this.targetVolume, fadeTime);
        }
    }

    play(name) {
        if (this.sounds[name]) {
            const now = millis();

            let minInterval = GAME_CONFIG.SOUND.COOLDOWN[name] || 0;
            if (this.lastPlayTime[name] && (now - this.lastPlayTime[name] < minInterval)) {
                return;
            }

            let baseVol = GAME_CONFIG.SOUND.VOLUME[name] || 0.5;
            let finalVol = baseVol * this.sfxVolume;

            if (name === 'victory') {
                if (this.sounds.clap && this.sounds.clap.isLoaded() && this.sounds.clap.isPlaying()) {
                    this.sounds.clap.stop();
                }
            }

            if (name === 'boo' || name === 'clap') {
                if (this.sounds[name] && this.sounds[name].isLoaded() && this.sounds[name].isPlaying()) {
                    this.sounds[name].stop();
                }
            }
            this.sounds[name].setVolume(finalVol);
            this.sounds[name].play();
            this.lastPlayTime[name] = now;
        }
    }

    setMasterVolume(val) {
        this.targetVolume = val;
        if (this.currentBGM && !this.isFading) {
            this.currentBGM.setVolume(val);
        }
    }
}