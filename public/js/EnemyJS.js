import { rayCasterEnemie } from "./rayCasterFunctions.js";

function goblinObj(position, obstaclesEnemys, game) {
  this.game = game;
  this.position = position;
  this.obstaclesEnemys = obstaclesEnemys;

  this.goblin;
  this.goblinRay;

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

    this.goblinRay = new rayCasterEnemie(
      this.game,
      this.goblin,
      160,
      300,
      //   muriLayer,
      this.obstaclesEnemys
    );

    this.goblinRay.initializeRays();

    this.goblin.body.setVelocity(0);
    this.goblin.anims.play("goblin-idle");
  };

    this.goblinChasePlayer = (player) => {
        console.log("Verifica");
    for (let intersection of this.goblinRay.intersectionsShortRange) {
      if (intersection.object === player) {
        //   this.physics.moveToObject(enemies, player, 100);
        console.log("ALERT 1 :" + intersection.object);
      }
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
