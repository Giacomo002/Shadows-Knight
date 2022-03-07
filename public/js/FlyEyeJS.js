class FlyEyeObj {
  constructor(position, game, map, player, sounds) {
    this.game = game;
    this.position = position;
    this.map = map;

    this.flyEye;
    this.player = player;

    this.sounds = sounds;

    this.flyEyeSpawnPoint;
    this.velocityFlyEye = 100;
    this.lifeFlyEye = 100;
    this.damageToDie = 7;
    this.rangeChasePlayer = 300;
    this.radiusPath = this.player.flyEyeAreaRadius;
    this.velocityRadSecPath = 0.001;
    this.pathCenterAttack = new Phaser.Math.Vector2();
    this.setNewDefault = true;

    this.isChasing = true;
    this.isAttaccking = false;
    this.targetEscapeAg;
    this.targetChased = false;

    this.hitFlyEye;
    this.deadflyEye;
    this.alive = true;

    this.flyEyeInitialize = () => {
      this.flyEye = this.game.physics.add.sprite(
        this.position.x,
        this.position.y,
        "flyEye-i"
      );

      this.flyEye.setSize(40, 45);
      this.flyEye.setOffset(35, 40);

      this.game.anims.create({
        key: "flyEye-idleL",
        frames: this.game.anims.generateFrameNumbers("flyEye-iL", {
          start: 0,
          end: 3,
        }),
        frameRate: 11,
        repeat: -1,
      });

      this.game.anims.create({
        key: "flyEye-idleR",
        frames: this.game.anims.generateFrameNumbers("flyEye-iR", {
          start: 0,
          end: 3,
        }),
        frameRate: 11,
        repeat: -1,
      });

      this.hitFlyEye = this.game.add.sprite(
        this.flyEye.x,
        this.flyEye.y,
        "hit-e"
      );

      this.deadflyEye = this.game.add.sprite(
        this.flyEye.x,
        this.flyEye.y,
        "dead-e"
      );

      this.hitFlyEye.visible = false;
      this.deadflyEye.visible = false;

      this.hitFlyEye.setDepth(1);
      this.deadflyEye.setDepth(1);

      this.game.anims.create({
        key: "dead-flyEye",
        frames: this.game.anims.generateFrameNumbers("dead-e", {
          start: 0,
          end: 3,
        }),
        frameRate: 11,
        repeat: 0,
      });

      this.game.anims.create({
        key: "hit-flyEye",
        frames: this.game.anims.generateFrameNumbers("hit-e", {
          start: 0,
          end: 2,
        }),
        frameRate: 24,
        repeat: 0,
      });

      this.hitFlyEye.on("animationcomplete", () => {
        this.hitFlyEye.visible = false;
      });

      this.deadflyEye.on("animationcomplete", () => {
        this.deadflyEye.visible = false;
      });

      this.flyEye.body.setVelocity(0);
      this.flyEye.anims.play("flyEye-idleR", true);

      PhaserHealth.AddTo(this.flyEye, this.lifeFlyEye, 0, 100);

      this.flyEye.on("die", this.timerSetToTrue);

      this.pathCenterAttack = this.player.flyEyeArea.getRandomPoint();

      this.timerFlyEyeChangePos = this.game.time.addEvent({
        delay: 500,
        callback: this.flyEyeChangePosition,
        callbackScope: this,
        loop: true,
      });

      this.game.physics.add.collider(this.flyEye, this.map.background);
      this.game.physics.collide(this.flyEye, this.map.walls);
    };

    this.flyEyeChangePosition = () => {
      this.pathCenterAttack = this.player.flyEyeArea.getRandomPoint();
    };

    this.moveSpriteOnCircle = () => {
      if (this.isChasing && this.flyEye.getHealth() > 0) {
        this.game.physics.moveToObject(
          this.flyEye,
          this.pathCenterAttack,
          this.velocityFlyEye
        );

        if (this.flyEye.body.velocity.x > 0) {
          this.flyEye.anims.play("flyEye-idleR", true);
        } else {
          this.flyEye.anims.play("flyEye-idleL", true);
        }
      }
    };

    this.flyEyeChasePlayer = (player, speedUp) => {
      if (this.isChasing && this.flyEye.getHealth() > 0) {
        const dx = Math.abs(this.flyEye.x - player.x);
        const dy = Math.abs(this.flyEye.y - player.y);

        if (dx > dy) {
          this.flyEye.body.setVelocity(0);
          if (this.flyEye.x < player.x) {
            this.flyEye.setVelocity(this.velocityFlyEye + speedUp, 0);
            this.flyEye.anims.play("flyEye-idleR", true);
          } else {
            this.flyEye.setVelocity(-(this.velocityFlyEye + speedUp), 0);
            this.flyEye.anims.play("flyEye-idleL", true);
          }
        } else {
          if (this.flyEye.y < player.y) {
            this.flyEye.setVelocity(0, this.velocityFlyEye + speedUp);
          } else {
            this.flyEye.setVelocity(0, -(this.velocityFlyEye + speedUp));
          }
        }

        this.flyEye.body.velocity
          .normalize()
          .scale(this.velocityFlyEye + speedUp);
      }
    };

    this.timerSetToTrue = () => {
      this.player.playerGetdamaged = false;
      this.deadflyEye.x = this.flyEye.x;
      this.deadflyEye.y = this.flyEye.y;
      this.dieflyEye();
    };

    this.dieflyEye = () => {
      this.flyEye.alpha = 0;
      this.deadflyEye.visible = true;
      this.deadflyEye.anims.play("dead-flyEye");
      this.alive = false;
    };

    this.trapsDamage = () => {
      var tileTrappole = map.trappoleTerreno.getTileAtWorldXY(
        this.flyEye.x,
        this.flyEye.y
      );

      if (tileTrappole) {
        if (
          tileTrappole.index == 125 ||
          tileTrappole.index == 126 ||
          tileTrappole.index == 127 ||
          tileTrappole.index == 128
        ) {
          this.flyEye.damage(2);
          this.hitFlyEye.visible = true;
          this.hitFlyEye.x = this.flyEye.x;
          this.hitFlyEye.y = this.flyEye.y;
          this.hitFlyEye.anims.play("hit-flyEye");
          this.flyEye.tint = 0xff3f00;
          this.sounds.playHit();
        }
      }
    };

    this.playerDamage = () => {
      this.flyEye.damage(this.damageToDie);
      this.hitFlyEye.visible = true;
      this.hitFlyEye.x = this.flyEye.x;
      this.hitFlyEye.y = this.flyEye.y;
      this.hitFlyEye.anims.play("hit-goblin");
      this.flyEye.tint = 0xff3f00;
      this.sounds.playHit();
    };

    this.changeDirection = () => {
      if (this.flyEye.body.velocity.x < 0) {
        this.flyEye.scaleX = -1;
      } else {
        this.flyEye.scaleX = 1;
      }
    };

    this.getBody = () => {
      return this.flyEye;
    };
  }
}

export { FlyEyeObj };
