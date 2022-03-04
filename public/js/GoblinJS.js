class GoblinObj {
  constructor(position, game, map, player) {
    this.game = game;
    this.position = position;
    this.map = map;

    this.goblin;
    this.player = player;

    this.goblinSpawnPoint;
    this.velocityGoblin = 90;
    this.lifeGoblin = 100;
    this.damageToDie = 5;

    this.isChasing = false;
    this.isAttaccking = false;
    this.targetEscapeAg;
    this.targetChased = false;

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

      this.swordGoblin = this.game.add.sprite(
        this.goblin.x,
        this.goblin.y,
        "sword-goblin"
      );
      this.swordGoblin.setOrigin(-0.1, 0.4);

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

        // this.goblin.destroy();
      });

      this.goblin.body.setVelocity(0);
      this.goblin.anims.play("goblin-idle", true);

      PhaserHealth.AddTo(this.goblin, this.lifeGoblin, 0, 100);

      this.goblin.on("die", this.timerSetToTrue);

      this.game.physics.add.collider(this.goblin, this.map.background);
      this.game.physics.add.collider(this.goblin, this.map.decorazioniTerreno);
      this.game.physics.collide(this.goblin, this.map.walls);
    };

    

    this.getRandomUniformMovAroundPlayer = (objArea) => {
      this.targetEscapeAg = new Phaser.Math.Vector2();
      objArea.getRandomPoint(this.targetEscapeAg);
      // this.targetEscapeAg.floor();
      return this.targetEscapeAg;
    };

    this.goblinChasePlayer = (player, speedUp) => {
      // this.goblin.tint = 0xff3f00;
      this.swordGoblin.x = this.goblin.x;
      this.swordGoblin.y = this.goblin.y;

      if (this.isChasing && this.goblin.getHealth() > 0) {
        this.goblin.body.setVelocity(0);

        const dx = Math.abs(this.goblin.x - player.x);
        const dy = Math.abs(this.goblin.y - player.y);

        //radius
        if (dx > dy) {
          //close gap x
          if (this.goblin.x < player.x) {
            //right
            this.goblin.setVelocity(this.velocityGoblin + speedUp, 0);
            this.goblin.anims.play("goblin-runR", true);
          } else {
            //left
            this.goblin.setVelocity(-(this.velocityGoblin + speedUp), 0);
            this.goblin.anims.play("goblin-runL", true);
          }
        } else {
          //close gap y
          if (this.goblin.y < player.y) {
            //down
            this.goblin.setVelocity(0, this.velocityGoblin + speedUp);
            // this.goblin.anims.play("goblin-runR", true);
            if (this.goblin.x < player.x) {
              //right
              this.goblin.anims.play("goblin-runR", true);
              this.swordGoblin.scaleX = 1;
            } else {
              //left
              this.goblin.anims.play("goblin-runL", true);
              this.swordGoblin.scaleX = -1;
            }
          } else {
            //up
            this.goblin.setVelocity(0, -(this.velocityGoblin + speedUp));
            // this.goblin.anims.play("goblin-runR", true);
            if (this.goblin.x < player.x) {
              //right
              this.goblin.anims.play("goblin-runR", true);
              this.swordGoblin.scaleX = 1;
            } else {
              //left
              this.goblin.anims.play("goblin-runL", true);
              this.swordGoblin.scaleX = -1;
            }
          }
        }

        this.goblin.body.velocity
          .normalize()
          .scale(this.velocityGoblin + speedUp);
      }
    };

    this.timerSetToTrue = () => {
      this.player.playerGetdamaged = false;
      this.alive = false;
      this.deadGoblin.x = this.goblin.x;
      this.deadGoblin.y = this.goblin.y;
      this.dieGoblin();
    };
    this.dieGoblin = () => {
      this.goblin.alpha = 0;
      this.deadGoblin.visible = true;
      this.swordGoblin.alpha = 0;
      this.deadGoblin.anims.play("dead-goblin");
    };

    this.trapsDamage = () => {
      var tileTrappole = map.trappoleTerreno.getTileAtWorldXY(
        this.goblin.x,
        this.goblin.y
      );

      if (tileTrappole) {
        if (
          tileTrappole.index == 125 ||
          tileTrappole.index == 126 ||
          tileTrappole.index == 127 ||
          tileTrappole.index == 128
        ) {
          // this.player.player.tint = 0xff00ff;
          this.goblin.damage(2);
          this.hitGoblin.visible = true;
          this.hitGoblin.x = this.goblin.x;
          this.hitGoblin.y = this.goblin.y;
          this.hitGoblin.anims.play("hit-goblin");
          this.goblin.tint = 0xff3f00;
        }
      }
    };

    this.playerDamage = () => {
      this.goblin.damage(this.damageToDie);
      this.hitGoblin.visible = true;
      this.hitGoblin.x = this.goblin.x;
      this.hitGoblin.y = this.goblin.y;
      this.hitGoblin.anims.play("hit-goblin");
      this.goblin.tint = 0xff3f00;
    };

    this.changeDirection = () => {
      if (this.goblin.body.velocity.x < 0) {
        this.goblin.scaleX = -1;
      } else {
        this.goblin.scaleX = 1;
      }
    };

    this.getBody = () => {
      return this.goblin;
    };
  }
}

export { GoblinObj };
