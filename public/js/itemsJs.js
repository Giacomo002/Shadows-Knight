class ItemsObj {
  constructor(game, map, player, position) {
    this.game = game;
    this.map = map;
    this.player = player;

    this.key;
    this.position = position;

    this.itemsKeyInitialize = () => {
      this.key = this.game.physics.add.sprite(
        this.position.x,
        this.position.y,
        "key"
      );

      this.game.physics.add.collider(
        this.key,
        this.player.player,
        this.keyPickUp,
        null,
        this
      );
    };
    this.keyPickUp = () => {
      this.key.destroy();
      this.game.keyCounter += 1;
     
      
      if (this.game.keyCounter == 2 && this.game.level1 == false) {
        this.game.keyCounter = 0;
        this.game.level1 = true;
        this.map.porteLevel1.alpha = 0;
        this.player.level1ColliderPlayer.active = false;
        this.game.level1CollideSlime.active = false;
        this.game.level1CollideFlyEye.active = false;
        this.game.level1CollideGoblin.active = false;
        this.player.textScrol.setText([
          "Ciao!",
          " ",
          "Cerca le chiavi",
          "per avanzare di",
          "livello.",
          " ",
          "---------------",
          "Devi trovare le",
          " ",
          "3 chiavi",
        ]);
      } else if (this.game.keyCounter == 3 && this.game.level2 == false) {
        this.game.keyCounter = 0;
        this.game.level2 = true;
        this.map.porteLevel2.alpha = 0;
        this.player.level2ColliderPlayer.active = false;
        this.game.level2CollideSlime.active = false;
        this.game.level2CollideFlyEye.active = false;
        this.game.level2CollideGoblin.active = false;
        this.player.textScrol.setText([
          "Ciao!",
          " ",
          "BRAVO! Uccidili",
          "tutti, per",
          "divertimento!",
          " ",
        ]);
      }
      this.player.textKey.setText(this.game.keyCounter);
    };
  }
}

export { ItemsObj };
