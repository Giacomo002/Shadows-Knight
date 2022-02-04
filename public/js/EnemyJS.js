import { rayCasterEnemie } from "./rayCasterFunctions.js";

function goblinObj(position, obstaclesEnemys, game) {
  this.game = game;
  this.position = position;
  this.obstaclesEnemys = obstaclesEnemys;

  this.goblin;

  this.goblinSpawnPoint;
  this.velocityGoblin = 200;

  this.goblinInitialize = () => {
    this.goblin = this.game.physics.add.sprite(
      this.position.x,
      this.position.y,
      "goblin-i"
    );

    this.goblin.setSize(40, 65);
    this.goblin.setOffset(35, 25);

    this.game.anims.create({
      key: "goblin-idle",
      frames: this.game.anims.generateFrameNumbers("goblin-i", {
        start: 0,
        end: 5,
      }),
      frameRate: 11,
      repeat: -1,
    });

    this.goblin.body.setVelocity(0);
    this.goblin.anims.play("goblin-idle");
  };

  this.goblinChasePlayer = (tileAttackPlayer, checkForPlayer, player) => {
    var tileGoblin = checkForPlayer.getTileAtWorldXY(
      this.goblin.x,
      this.goblin.y
    );
    if (tileAttackPlayer) {
      if (
        tileAttackPlayer.properties.tileIDchecker ==
        tileGoblin.properties.tileIDchecker
      ) {
        this.game.physics.moveToObject(this.goblin, player, 100);
        console.log(
          "Player: " +
            tileAttackPlayer.properties.tileIDchecker +
            " Enemy: " +
            checkForPlayer.getTileAtWorldXY(this.goblin.x, this.goblin.y)
              .properties.tileIDchecker
        );
      } else {
          if (
           Math.abs(this.goblin.body.velocity.x) > 1 &&
           Math.abs(this.goblin.body.velocity.y) > 1
         ) {
           console.log("no");
           this.goblin.body.setVelocity(0);
         } 
      }
    } else if (
      Math.abs(this.goblin.body.velocity.x) > 1 &&
      Math.abs(this.goblin.body.velocity.y) > 1
    ) {
      console.log("no_player fuori");
      this.goblin.body.setVelocity(0);
    } 
  };

  this.changeDirection = () => {
    if (this.goblin.body.velocity.x < 0) {
      this.goblin.scaleX = -1;
    } else {
      this.goblin.scaleX = 1;
    }
  };
}

export { goblinObj };
