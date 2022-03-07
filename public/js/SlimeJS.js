class SlimeObj {
  constructor(position, game, map, player, sounds) {
    this.game = game;
    this.position = position;
    this.map = map;

    this.slime;
    this.player = player;

    this.sounds = sounds;

    this.slimeSpawnPoint;
    this.velocityslime = 60;
    this.lifeSlime = 100;
    this.damageToDie = 3;
    this.canIfire = false;

    this.isChasing = true;
    this.isAttaccking = false;
    this.targetEscapeAg;
    this.targetChased = false;
    this.projectiles;

    this.hitSlime;
    this.deadslime;
    this.alive = true;

    this.slimeInitialize = () => {
      this.slime = this.game.physics.add.sprite(
        this.position.x,
        this.position.y,
        "slime-i"
      );

      this.slime.setSize(40, 45);
      this.slime.setOffset(35, 40);

      this.game.anims.create({
        key: "slime-idle",
        frames: this.game.anims.generateFrameNumbers("slime-i", {
          start: 0,
          end: 5,
        }),
        frameRate: 11,
        repeat: -1,
      });

      this.game.anims.create({
        key: "slime-runL",
        frames: this.game.anims.generateFrameNumbers("slime-rL", {
          start: 0,
          end: 5,
        }),
        frameRate: 11,
        repeat: -1,
      });

      this.game.anims.create({
        key: "slime-runR",
        frames: this.game.anims.generateFrameNumbers("slime-rR", {
          start: 0,
          end: 5,
        }),
        frameRate: 11,
        repeat: -1,
      });

      this.hitSlime = this.game.add.sprite(this.slime.x, this.slime.y, "hit-e");

      this.deadslime = this.game.add.sprite(
        this.slime.x,
        this.slime.y,
        "dead-e"
      );

      this.hitSlime.visible = false;
      this.deadslime.visible = false;

      this.hitSlime.setDepth(1);
      this.deadslime.setDepth(1);

      this.game.anims.create({
        key: "dead-slime",
        frames: this.game.anims.generateFrameNumbers("dead-e", {
          start: 0,
          end: 3,
        }),
        frameRate: 11,
        repeat: 0,
      });

      this.game.anims.create({
        key: "hit-slime",
        frames: this.game.anims.generateFrameNumbers("hit-e", {
          start: 0,
          end: 2,
        }),
        frameRate: 24,
        repeat: 0,
      });

      this.hitSlime.on("animationcomplete", () => {
        this.hitSlime.visible = false;
      });

      this.deadslime.on("animationcomplete", () => {
        this.deadslime.visible = false;
      });

      this.slime.body.setVelocity(0);
      this.slime.anims.play("slime-idle", true);

      PhaserHealth.AddTo(this.slime, this.lifeSlime, 0, 100);

      this.slime.on("die", this.timerSetToTrue);

      this.timerSlimeAttack = this.game.time.addEvent({
        delay: 2000,
        callback: this.slimeAttack,
        callbackScope: this,
        loop: true,
      });

      this.game.physics.add.collider(this.slime, this.map.background);
      this.game.physics.add.collider(this.slime, this.map.decorazioniTerreno);
      this.game.physics.collide(this.slime, this.map.walls);
    };

    this.slimeChasePlayer = (player, speedUp) => {
      if (this.isChasing && this.slime.getHealth() > 0) {
        this.slime.body.setVelocity(0);

        const dx = Math.abs(this.slime.x - player.x);
        const dy = Math.abs(this.slime.y - player.y);

        //radius
        if (dx > dy) {
          //close gap x
          if (this.slime.x < player.x) {
            //right
            this.slime.setVelocity(this.velocityslime + speedUp, 0);
            this.slime.anims.play("slime-runR", true);
          } else {
            //left
            this.slime.setVelocity(-(this.velocityslime + speedUp), 0);
            this.slime.anims.play("slime-runL", true);
          }
        } else {
          //close gap y
          if (this.slime.y < player.y) {
            //down
            this.slime.setVelocity(0, this.velocityslime + speedUp);

            if (this.slime.x < player.x) {
              //right
              this.slime.anims.play("slime-runR", true);
            } else {
              //left
              this.slime.anims.play("slime-runL", true);
            }
          } else {
            //up
            this.slime.setVelocity(0, -(this.velocityslime + speedUp));

            if (this.slime.x < player.x) {
              //right
              this.slime.anims.play("slime-runR", true);
            } else {
              //left
              this.slime.anims.play("slime-runL", true);
            }
          }
        }

        this.slime.body.velocity
          .normalize()
          .scale(this.velocityslime + speedUp);
      }
    };

    this.killProjectiles = (projectiles, background) => {
      projectiles.destroy();
    };

    this.slimeAttack = () => {
      if (this.canIfire) {
        this.projectiles = this.game.physics.add.sprite(
          this.slime.x,
          this.slime.y,
          "slime-pr"
        );

        this.game.physics.moveToObject(
          this.projectiles,
          this.player.player,
          200
        );
        this.sounds.playprojectiles();
        this.game.physics.add.collider(
          this.projectiles,
          this.map.background,
          this.killProjectiles,
          null,
          this
        );
        this.game.physics.add.collider(
          this.projectiles,
          this.player.player,
          this.player.slimeProjectilesMakedamage,
          null,
          this
        );
      }
    };

    this.timerSetToTrue = () => {
      this.player.playerGetdamaged = false;
      this.deadslime.x = this.slime.x;
      this.deadslime.y = this.slime.y;
      this.dieslime();
    };
    this.dieslime = () => {
      this.slime.alpha = 0;
      this.deadslime.visible = true;
      this.canIfire = false;

      this.deadslime.anims.play("dead-slime");
      this.alive = false;
    };

    this.trapsDamage = () => {
      var tileTrappole = map.trappoleTerreno.getTileAtWorldXY(
        this.slime.x,
        this.slime.y
      );

      if (tileTrappole) {
        if (
          tileTrappole.index == 125 ||
          tileTrappole.index == 126 ||
          tileTrappole.index == 127 ||
          tileTrappole.index == 128
        ) {
          this.slime.damage(2);
          this.hitSlime.visible = true;
          this.hitSlime.x = this.slime.x;
          this.hitSlime.y = this.slime.y;
          this.hitSlime.anims.play("hit-slime");
          this.slime.tint = 0xff3f00;
          this.sounds.playHit();
        }
      }
    };

    this.playerDamage = () => {
      this.slime.damage(this.damageToDie);
      this.hitSlime.visible = true;
      this.hitSlime.x = this.slime.x;
      this.hitSlime.y = this.slime.y;
      this.hitSlime.anims.play("hit-slime");
      this.slime.tint = 0xff3f00;
      this.sounds.playHit();
    };

    this.changeDirection = () => {
      if (this.slime.body.velocity.x < 0) {
        this.slime.scaleX = -1;
      } else {
        this.slime.scaleX = 1;
      }
    };

    this.getBody = () => {
      return this.slime;
    };
  }
}

export { SlimeObj };
