class SoundManager {
   constructor() {
       this.basePath = 'assets/sounds/';
       this.sounds = {};
       this.currentBGM = null; // which sound
       this.targetVolume = 0.3;  //volume
       this.isFading = false;

       let startAudio = () => {
         if (getAudioContext().state !== 'running') {
             userStartAudio().then(() => {
                if (typeof currentState !== 'undefined') {
                    this.updateBGM(currentState); 
                }                 
                console.log("Audio Unlocked!");
             });
         }
         window.removeEventListener('mousedown', startAudio);
         window.removeEventListener('keydown', startAudio);
   }
    window.addEventListener('mousedown', startAudio);
    window.addEventListener('keydown', startAudio);
   }
   loadSounds() {
       // BGM
       this.sounds.bgmGame = loadSound(this.basePath + 'BGM/bgm_game.mp3');
       this.sounds.bgmMenu = loadSound(this.basePath + 'BGM/bgm_main_menu.mp3');

       const sfxPath = this.basePath + 'Sound Effects (SFX)/';

       //1.Ball&Interaction
       const ballPath = sfxPath + '1.Ball&Interaction/';
       this.sounds.swing = loadSound(ballPath + 'fast_travel.wav'); // swing
       this.sounds.hit = loadSound(ballPath + 'frame_hit.wav');      // hit

       //2.CowdDynamics
       const crowdPath = sfxPath + '2.CowdDynamics/';
       this.sounds.clap = loadSound(crowdPath + 'the_whoa.wav');
       this.sounds.boo = loadSound(crowdPath + 'the_ooh.wav');
   }

   //change BGM
   updateBGM(state) {
   let nextBGM = (state === GAME_CONFIG.STATES.PLAYING) ? this.sounds.bgmGame : this.sounds.bgmMenu;
        if (this.currentBGM !== nextBGM && !this.isFading) {
            this.transitionTo(nextBGM);
        }
    }

  transitionTo(nextBGM) {
   this.isFading = true;
   const fadeTime = 0.8; // Switching Time

   // first bgm fade out and stop
   if (this.currentBGM && this.currentBGM.isPlaying()) {
       this.currentBGM.fade(0, fadeTime);
       setTimeout(() => {
           this.currentBGM.stop();
           this.startNewBGM(nextBGM, fadeTime);
       }, fadeTime * 1000);
   } else {
       this.startNewBGM(nextBGM, fadeTime);
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

score(winner) {
    if (typeof currentState !== 'undefined' && currentState !== GAME_CONFIG.STATES.PLAYING) {
        return; 
    }

    if (!winner) return;

    if (typeof ball !== 'undefined') {
        if (ball.isWaiting) return; 

        if (!ball.lastHitter) return; 
    }

    const w = String(winner).toUpperCase();    
    
    if (w === 'PLAYER') {
        this.play('clap'); // 玩家 1 (下方貓咪) 贏了，永遠拍手
    } else if (w === 'OPPONENT') {
        // 🌟 核心修正：判斷是不是雙人模式！
        if (typeof isMultiplayer !== 'undefined' && isMultiplayer) {
            this.play('clap'); // 雙人模式下，玩家 2 (上方貓咪) 贏了也是拍手！
        } else {
            this.play('boo');  // 單人模式下，AI 贏了才會發出噓聲！
        }
    }
}
play(name) {
    if (this.sounds[name]) {

       if (name === 'boo' || name === 'clap') {
           this.sounds[name].stop();
       }
       this.sounds[name].setVolume(1.0); 
       this.sounds[name].play();
    }
}
}