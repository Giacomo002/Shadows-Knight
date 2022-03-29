class SoundsObj {
  constructor(game) {
    this.game = game;

    this.soundtrack;
    this.hit;
    this.sword;
    this.projectiles;
    this.lose;

    this.soundInitialize = () => {
      this.soundtrack = this.game.sound.add("soundtrack-sound");
      // this.soundtrack.play();
      this.soundtrack.setLoop(true);
      this.soundtrack.setVolume(0.5);

      this.hit = this.game.sound.add("hit-sound");
      this.hit.setVolume(0.8);

      this.sword = this.game.sound.add("sword-sound");
      this.sword.setVolume(0.8);

      this.projectiles = this.game.sound.add("projectiles-sound");
      this.projectiles.setVolume(0.8);

      this.lose = this.game.sound.add("lose-sound");
      this.lose.setVolume(1);
    };

    this.playHit = () => {
      if (!this.hit.isPlaying) {
        this.hit.play();
      }
    };
    this.playSword = () => {
      this.sword.play();
    };
    this.playprojectiles = () => {
      this.projectiles.play();
    };
    this.playLose = () => {
      this.lose.play();
    };
    this.stopBase = () => {
      this.soundtrack.stop();
    };
  }
}

export { SoundsObj };
