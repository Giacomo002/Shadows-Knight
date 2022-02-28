class GoblinObj {
  constructor(position, game, map, player) {
    this.game = game;
    this.position = position;
    this.map = map;

    this.goblin;
    this.player = player;

    this.goblinSpawnPoint;
    this.velocityGoblin = 95;

    this.isChasing = true;
    this.isAttaccking = false;
    this.targetEscapeAg = new Phaser.Math.Vector2();

    this.hitGoblin;
    this.deadGoblin;
    this.alive = true;

    this.goblinInitialize = () => {
      this.goblin = this.game.physics.add.sprite(
        this.position.x,
        this.position.y,
        "goblin-i"
      );

      // this.goblin.setCollideWorldBounds(true);
      this.goblin.setSize(40, 45);
      this.goblin.setOffset(35, 40);

      this.game.anims.create({
        key: "goblin-idle",
        frames: this.game.anims.generateFrameNumbers("goblin-i", {
          start: 0,
          end: 5,
        }),
        frameRate: 11,
        repeat: -1,
      });

      this.game.anims.create({
        key: "goblin-runL",
        frames: this.game.anims.generateFrameNumbers("goblin-rL", {
          start: 0,
          end: 5,
        }),
        frameRate: 11,
        repeat: -1,
      });

      this.game.anims.create({
        key: "goblin-runR",
        frames: this.game.anims.generateFrameNumbers("goblin-rR", {
          start: 0,
          end: 5,
        }),
        frameRate: 11,
        repeat: -1,
      });

      this.hitGoblin = this.game.add.sprite(
        this.goblin.x,
        this.goblin.y,
        "hit-e"
      );

      this.deadGoblin = this.game.add.sprite(
        this.goblin.x,
        this.goblin.y,
        "dead-e"
      );

      this.hitGoblin.visible = false;
      this.deadGoblin.visible = false;

      this.hitGoblin.setDepth(1);
      this.deadGoblin.setDepth(1);


      this.game.anims.create({
        key: "dead-goblin",
        frames: this.game.anims.generateFrameNumbers("dead-e", {
          start: 0,
          end: 3,
        }),
        frameRate: 11,
        repeat: 0,
      });

      this.game.anims.create({
        key: "hit-goblin",
        frames: this.game.anims.generateFrameNumbers("hit-e", {
          start: 0,
          end: 2,
        }),
        frameRate: 24,
        repeat: 0,
      });

      this.hitGoblin.on("animationcomplete", () => {
        this.hitGoblin.visible = false;
      });

      this.deadGoblin.on("animationcomplete", () => {
        this.deadGoblin.visible = false;
        this.goblin.destroy();
      });

      this.targetEscapeAg.x = this.goblin.x;
      this.targetEscapeAg.y = this.goblin.y;

      this.goblin.body.setVelocity(0);
      this.goblin.anims.play("goblin-idle");

      PhaserHealth.AddTo(this.goblin, 110, 0, 100);

      this.goblin.on("die", this.dieGoblin);

      this.game.physics.add.collider(this.goblin, this.map.background);
      this.game.physics.add.collider(this.goblin, this.map.decorazioniTerreno);
      this.game.physics.collide(this.goblin, this.map.walls);
    };

    this.getRandomUniformMovAroundPlayer = () => {};

    this.goblinChasePlayer = (player) => {
      // this.goblin.tint = 0xff3f00;

      if (this.isChasing && this.goblin.getHealth() > 0) {
        this.goblin.body.setVelocity(0);

        const dx = Math.abs(this.goblin.x - player.x);
        const dy = Math.abs(this.goblin.y - player.y);

        //radius
        if (dx > dy) {
          //close gap x
          if (this.goblin.x < player.x) {
            //right
            this.goblin.setVelocity(this.velocityGoblin, 0);
            this.goblin.anims.play("goblin-runR", true);
          } else {
            //left
            this.goblin.setVelocity(-this.velocityGoblin, 0);
            this.goblin.anims.play("goblin-runL", true);
          }
        } else {
          //close gap y
          if (this.goblin.y < player.y) {
            //down
            this.goblin.setVelocity(0, this.velocityGoblin);
            this.goblin.anims.play("goblin-runR", true);
          } else {
            //up
            this.goblin.setVelocity(0, -this.velocityGoblin);
            this.goblin.anims.play("goblin-runR", true);
          }
        }

        this.goblin.body.velocity.normalize().scale(this.velocityGoblin);
        // this.game.physics.add.overlap(
        //   this.goblin,
        //   goblinGroupBody,
        //   this.getRandomUniformMovAroundPlayer(), null, this.game);
      }
    };

    this.dieGoblin = () => {
      
      this.goblin.setActive(false);
      this.goblin.setVisible(false);
      this.deadGoblin.x = this.goblin.x;
      this.deadGoblin.y = this.goblin.y;
        this.deadGoblin.visible = true;
        this.deadGoblin.anims.play("dead-goblin");
        this.alive = false;
      
    }

    this.changeDirection = () => {
      if (this.goblin.body.velocity.x < 0) {
        this.goblin.scaleX = -1;
      } else {
        this.goblin.scaleX = 1;
      }
    };
  }
}

export { GoblinObj };
