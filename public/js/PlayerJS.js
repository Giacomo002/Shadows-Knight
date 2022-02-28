class playerObj {
  constructor(cursors, game, map) {
    this.game = game;
    this.cursors = cursors;
    this.map = map;

    this.player;
    this.sword;
    this.swordAnimation;
    this.currentLevel = 0;
    this.attack = false;
    this.alreadyAttack = false;
    this.swordTween;
    this.swordSlash;
    this.oldSwordposition;
    this.swordRotValue;

    this.playerSpawnPoint;
    this.velocityPlayer = 340;
    this.bar;

    this.makeBar = (color) => {
      //draw the bar
      this.mask = this.game.add.image(
        window.innerWidth / 2,
        window.innerHeight / 2,
        "mask"
      );
      this.barBackground = this.game.add.graphics();
      this.bar = this.game.add.graphics();
      this.barUi = this.game.add.image(250, 70, "healthBarUi");

      //color the bar
      this.barBackground.fillStyle(0x242a36, 1);
      this.bar.fillStyle(color, 1);

      //fill the bar with a rectangle
      this.barBackground.fillRect(0, 0, 290, 50);
      this.bar.fillRect(0, 0, 290, 50);

      //position the bar
      this.bar.x = 145;
      this.bar.y = 40;
      this.barBackground.x = 145;
      this.barBackground.y = 40;

      this.mask.setScrollFactor(0, 0);
      this.barBackground.setScrollFactor(0, 0);
      this.bar.setScrollFactor(0, 0);
      this.barUi.setScrollFactor(0, 0);

      this.mask.setDepth(1);
      this.barBackground.setDepth(1);
      this.bar.setDepth(1);
      this.barUi.setDepth(1);
    };

    this.healthBarUpdate = () => {
      //scale the bar
      this.bar.scaleX = this.player.getHealth() / this.player.getMaxHealth();
      this.bar.setScrollFactor(0, 0);
      //position the bar
      // this.bar.x = this.player.x;
      // this.bar.y = this.player.y;
    };

    this.playerInitialize = (enemyGoblinEntity) => {
      this.playerSpawnPoint = this.map.map.findObject(
        "SpawnGiocatore",
        (obj) => obj.name === "Spawn Giocatore"
      );

      this.player = this.game.physics.add.sprite(
        this.playerSpawnPoint.x,
        this.playerSpawnPoint.y,
        "knight-i"
      );

      this.player.setSize(40, 45);
      this.player.setOffset(35, 40);

      this.game.anims.create({
        key: "knight-run",
        frames: this.game.anims.generateFrameNumbers("knight-r", {
          start: 0,
          end: 5,
        }),
        frameRate: 11,
        repeat: -1,
      });

      this.game.anims.create({
        key: "knight-idle",
        frames: this.game.anims.generateFrameNumbers("knight-i", {
          start: 0,
          end: 5,
        }),
        frameRate: 11,
        repeat: -1,
      });

      this.sword = this.game.add.sprite(
        this.player.x,
        this.player.y,
        "sword-knight"
      );
      this.sword.setSize(40, 45);
      this.sword.setOrigin(-0.2, 0.7);


      this.swordSlash = this.game.add.sprite(
        this.sword.x,
        this.sword.y,
        "sword-slash"
      );
  
      this.swordSlash.alpha = 0.8;
      this.swordSlash.setOrigin(-0.5, 0.5);

      this.game.anims.create({
        key: "s-k-slash",
        frames: this.game.anims.generateFrameNumbers("sword-slash", {
          start: 0,
          end: 2,
        }),
        frameRate: 11,
        repeat: 0,
      });

      this.swordSlash.visible = false;
      this.swordSlash.setDepth(0.5);

      this.swordTween = this.game.tweens.add({
        targets: this.sword,
        duration: 100,
        rotation: 0,
        yoyo: false,
      });

      this.swordSlash.on("animationcomplete", () => {
        this.swordSlash.visible = false;
      });

      // Add component to *one* game object and assign health=1, minHealth=0, maxHealth=2
      PhaserHealth.AddTo(this.player, 100, 0, 100);

      this.makeBar(0xac3232);
      this.healthBarUpdate();

      this.player.body.setVelocity(0);
      this.player.anims.play("knight-idle");

      // Hide and deactivate sprite when health decreases below 0
      this.player.on("die", function (spr) {
        spr.setActive(false).setVisible(false);
      });

      this.game.physics.add.collider(this.player, this.map.background);
      this.game.physics.add.collider(this.player, this.map.decorazioniTerreno);
      this.game.physics.collide(this.player, this.map.walls);
      // this.game.physics.add.overlap(this.swordSlash, this.swordTest, this.test);
      this.game.physics.add.overlap(this.player, this.map.ground);
      this.game.physics.add.collider(this.player, enemyGoblinEntity);
    };

    this.getRotationBetween = (objTarget, mouseTarget) => {
      if (mouseTarget) {
        return Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          objTarget.x + this.game.cameras.main.scrollX,
          objTarget.y + this.game.cameras.main.scrollY
        );
      } else {
        return Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          objTarget.x,
          objTarget.y
        );
      }
    };

    this.movement = (offsetY) => {
      this.cursors = this.game.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      });

      if (this.cursors.left.isDown && this.cursors.up.isDown) {
        this.player.setVelocityX(-this.velocityPlayer);
        this.player.setVelocityY(-this.velocityPlayer);

        this.player.body.setOffset(70, offsetY);

        this.player.anims.play("knight-run", true);
      } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
        this.player.setVelocityX(this.velocityPlayer);
        this.player.setVelocityY(-this.velocityPlayer);

        this.player.setOffset(35, offsetY);
        this.player.anims.play("knight-run", true);
      } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
        this.player.setVelocityX(-this.velocityPlayer);
        this.player.setVelocityY(this.velocityPlayer);

        this.player.body.setOffset(70, offsetY);
        this.player.anims.play("knight-run", true);
      } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
        this.player.setVelocityX(this.velocityPlayer);
        this.player.setVelocityY(this.velocityPlayer);

        this.player.setOffset(35, offsetY);
        this.player.anims.play("knight-run", true);
      } else if (this.cursors.left.isDown) {
        this.player.setVelocityX(-this.velocityPlayer);

        this.player.setOffset(70, offsetY);
        this.player.anims.play("knight-run", true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(this.velocityPlayer);

        this.player.setOffset(35, offsetY);
        this.player.anims.play("knight-run", true);
      } else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-this.velocityPlayer);

        this.player.setOffset(35, offsetY);
        this.player.anims.play("knight-run", true);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(this.velocityPlayer);

        this.player.setOffset(35, offsetY);
        this.player.anims.play("knight-run", true);
      } else {
        this.player.body.setVelocity(0);
        this.player.anims.play("knight-idle", true);
      }

      this.sword.x = this.player.x;
      this.sword.y = this.player.y;

      this.swordSlash.x = this.sword.x;
      this.swordSlash.y = this.sword.y;

      if (!this.swordTween.isPlaying()) {
        if (this.sword.rotation < -1.69 || this.sword.rotation > 1.69) {
          this.sword.setTexture("sword-flip-knight");
          this.sword.setOrigin(-0.2, 0.3);
          this.sword.rotation = this.getRotationBetween(
            this.game.input.mousePointer,
            true
          );
          this.swordSlash.rotation = this.sword.rotation;
        } else if (this.sword.rotation > -1.69 || this.sword.rotation < 1.69) {
          this.sword.setTexture("sword-knight");
          this.sword.setOrigin(-0.2, 0.7);
          this.sword.rotation = this.getRotationBetween(
            this.game.input.mousePointer,
            true
          );
          this.swordSlash.rotation = this.sword.rotation;
        }

        if (this.sword.rotation < -1.69 || this.sword.rotation > 1.69) {
          // this.sword.tint = 0xffff00;
          this.player.scaleX = -1;
          // this.swordSlash.setOrigin(-0.6, 0.7);
        } else if (this.sword.rotation > -1.69 || this.sword.rotation < 1.69) {
          // this.sword.tint = 0xff00ff;
          this.player.scaleX = 1;
          // this.swordSlash.setOrigin(-0.6, 0.3);
        }

        this.oldSwordposition = this.sword.rotation;

        if (this.oldSwordposition < -1.69 || this.oldSwordposition > 1.69) {
          this.swordRotValue = this.oldSwordposition - Phaser.Math.DegToRad(80);
        } else if (
          this.oldSwordposition > -1.69 ||
          this.oldSwordposition < 1.69
        ) {
          this.swordRotValue = this.oldSwordposition + Phaser.Math.DegToRad(80);
        }
      }
    };

    this.resetTween = () => {
      if (this.swordTween) {
        this.swordTween.pause();
      }
      this.sword.rotation = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        this.game.input.mousePointer.x + this.game.cameras.main.scrollX,
        this.game.input.mousePointer.y + this.game.cameras.main.scrollY
      );
    };


    this.attackDamageSystem = (goblinEntity) => {
      // this.arrowTest0.x = this.sword.x;
      // this.arrowTest0.y = this.sword.y;
      // this.arrowTest1.x = this.sword.x;
      // this.arrowTest1.y = this.sword.y;
      // this.arrowTest2.x = this.sword.x;
      // this.arrowTest2.y = this.sword.y;
      // this.arrowTest3.x = this.sword.x;
      // this.arrowTest3.y = this.sword.y;

      // this.arrowTest0.rotation =
      //   this.getRotationBetween(this.game.input.mousePointer, true) + 0.0;
      // this.arrowTest1.rotation =
      //   this.getRotationBetween(this.game.input.mousePointer, true) + 0.5;
      // this.arrowTest2.rotation =
      //   this.getRotationBetween(this.game.input.mousePointer, true) - 0.5;
      this.enemyAngle = this.getRotationBetween(goblinEntity.goblin, false);

      this.cursorsAngle = this.getRotationBetween(
        this.game.input.mousePointer,
        true
      );
      this.limitDamage1 =
        this.getRotationBetween(this.game.input.mousePointer, true) + 0.5;
      this.limitDamage2 =
        this.getRotationBetween(this.game.input.mousePointer, true) - 0.5;

      if (
        (this.enemyAngle > this.cursorsAngle &&
          this.enemyAngle < this.limitDamage1) ||
        (this.enemyAngle > this.limitDamage2 &&
          this.enemyAngle < this.cursorsAngle) ||
        this.enemyAngle == this.cursorsAngle
      ) {
        if (this.swordSlash._visible && this.swordTween.isPlaying()) {
          goblinEntity.goblin.damage(6);
          goblinEntity.hitGoblin.visible = true;
          goblinEntity.hitGoblin.x = goblinEntity.goblin.x;
          goblinEntity.hitGoblin.y = goblinEntity.goblin.y;
          goblinEntity.hitGoblin.anims.play("hit-goblin");
          console.log(goblinEntity.goblin.getHealth());
        }
        
      }
    };

    this.swordAttack = () => {
      this.swordTween = this.game.tweens.add({
        targets: this.sword,
        duration: 130,
        rotation: this.swordRotValue,
        ease: "Cubic",
      });
      this.swordTween.restart();
      this.swordSlash.visible = true;
      this.swordSlash.anims.play("s-k-slash");
    };

    this.changeLevel = (tile) => {
      this.currentLevel = tile.properties.level;
    };
  }
}

export { playerObj };
