class SoundManager {
    constructor() {
        this.basePath = 'assets/sounds/';
        this.sounds = {};
        this.currentBGM = null; // which sound
        this.targetVolume = 0.3;  //volume
        this.sfxVolume = 0.5;
        this.isFading = false;
        this.lastPlayTime = {};
        this.needsMusicStateReset = false;

        let startAudio = () => {
            if (getAudioContext().state !== 'running') {
                userStartAudio().then(() => {
                    this.needsMusicStateReset = true;
                    this.isFading = false;
                });
            }
            window.removeEventListener('mousedown', startAudio);
            window.removeEventListener('keydown', startAudio);
        }
        window.addEventListener('mousedown', startAudio);
        window.addEventListener('keydown', startAudio);
    }
    loadSounds() {
        this.sounds.bgmGame = loadSound(this.basePath + 'bgm/bgm_game.mp3');
        this.sounds.bgmMenu = loadSound(this.basePath + 'bgm/bgm_main_menu.mp3');

        const sfxPath = this.basePath + 'sfx/';

        const ballPath = sfxPath + 'ball_interaction/';
        this.sounds.swing = loadSound(ballPath + 'fast_travel.wav'); // swing
        this.sounds.hit = loadSound(ballPath + 'frame_hit.wav');      // hit

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
        if (!this.isFading) {
            let isDifferent = this.currentBGM !== nextBGM;
            let isNotPlaying = this.currentBGM && !this.currentBGM.isPlaying();

            if (isDifferent || isNotPlaying || !this.currentBGM) {
                this.transitionTo(nextBGM);
            }
        }
    }

    transitionTo(nextBGM) {
        if (!nextBGM || !nextBGM.isLoaded()) return;
        if (this.currentBGM === nextBGM && nextBGM.isPlaying()) return;

        this.isFading = true;
        const fadeTime = 1.5;
        let oldBGM = this.currentBGM;

        if (oldBGM && oldBGM.isPlaying()) {
            oldBGM.fade(0, fadeTime);
            setTimeout(() => {
                if (this.currentBGM !== oldBGM) {
                    oldBGM.stop();
                }
            }, fadeTime * 1000);
        }

        this.currentBGM = nextBGM;

        if (getAudioContext().state === 'running') {
            this.currentBGM.setVolume(0);
            if (!this.currentBGM.isPlaying()) {
                this.currentBGM.loop();
            }

            setTimeout(() => {
                this.currentBGM.fade(this.targetVolume, fadeTime);
                
                setTimeout(() => {
                    this.isFading = false;
                }, fadeTime * 1000);
            }, 100); 
        } else {
            this.isFading = false;
        }
    }

    startNewBGM(newBGM, fadeTime) {
        if (newBGM && newBGM.isLoaded()) {
            this.currentBGM = newBGM;
            this.currentBGM.setVolume(0);
            this.currentBGM.loop();
            this.currentBGM.fade(this.targetVolume, fadeTime); // fade in
            this.isFading = false;
        }
    }

    play(name) {
        if (this.sounds[name]) {
            const now = millis();

            const cooldownConfig = {
                'success': 200,
                'select': 50,
                'confirm': 100,
                'swing': 200,
                'hit': 100,
                'clap': 500,
                'boo': 500
            };

            let minInterval = cooldownConfig[name] || 0;
            if (this.lastPlayTime[name] && (now - this.lastPlayTime[name] < minInterval)) {
                return;
            }

            const volumeConfig = {
                'success': 2.0,
                'victory': 0.8,
                'select': 1.5,
                'confirm': 0.6,
                'swing': 2.0,
                'hit': 0.3,
                'clap': 0.5,
                'boo': 0.4
            };

            let baseVol = volumeConfig[name] || 0.5;
            let finalVol = baseVol * this.sfxVolume;

            if (name === 'victory') {
                if (this.sounds.clap) this.sounds.clap.stop();
            }

            if (name === 'boo' || name === 'clap') {
                this.sounds[name].stop();
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