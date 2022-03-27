class PlayerObj {
  constructor(cursors, game, map, sounds, gameScene) {
    this.game = game;
    this.cursors = cursors;
    this.map = map;

    this.sounds = sounds;

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
    this.swordAttackRange = 110;

    this.playerSpawnPoint;
    this.velocityPlayer = 360;
    this.playerGetdamaged = false;
    this.bar;

    this.level1ColliderPlayer;
    this.level2ColliderPlayer;

    this.playerRay;
    this.textKey;

    this.flyEyeArea;
    this.flyEyeAreaRadius = 190;

     this.maskStart;

    this.makeBar = (color) => {
      //draw the bar
      this.maskRed = this.game.add.image(
        window.innerWidth / 2,
        window.innerHeight / 2,
        "mask"
      );
      this.mask = this.game.add.image(
        window.innerWidth / 2,
        window.innerHeight / 2,
        "mask"
      );

      

      this.barBackground = this.game.add.graphics();
      this.bar = this.game.add.graphics();
      this.barUi = this.game.add.image(
        window.innerWidth / 2,
        70,
        "healthBarUi"
      );

      this.scrolOpen = this.game.add.image(
        260,
        window.innerHeight - 230,
        "scrolOpen"
      );

      this.textKey = this.game.add.text(1135, 55, "0", {
        fontFamily: "AppleFont",
        fontSize: "40px",
      });

      this.textParagraph = [
        "Ciao!",
        " ",
        "Cerca le chiavi",
        "per avanzare di",
        "livello.",
        " ",
        "---------------",
        "Devi trovare le",
        " ",
        "2 chiavi",
      ];

      this.textScrol = this.game.add.text(
        90,
        window.innerHeight - 370,
        this.textParagraph,
        {
          fontFamily: "AppleFont",
          fontSize: "23px",
        }
      );


      //color the bar
      this.barBackground.fillStyle(0xcc9035, 1);
      this.bar.fillStyle(color, 1);

      //fill the bar with a rectangle
      this.barBackground.fillRect(0, 0, 359, 50);
      this.bar.fillRect(0, 0, 359, 50);

      //position the bar
      this.bar.x = 695;
      this.bar.y = 40;
      this.barBackground.x = 695;
      this.barBackground.y = 40;

      this.maskStart = this.game.add.image(
        window.innerWidth / 2,
        window.innerHeight / 2,
        "maskStart"
      );

      this.maskRed.setScrollFactor(0, 0);
      this.mask.setScrollFactor(0, 0);
      this.barBackground.setScrollFactor(0, 0);
      this.bar.setScrollFactor(0, 0);
      this.barUi.setScrollFactor(0, 0);
      this.scrolOpen.setScrollFactor(0, 0);
      this.textKey.setScrollFactor(0, 0);
      this.textScrol.setScrollFactor(0, 0);
      this.maskStart.setScrollFactor(0, 0);

      this.maskRed.setDepth(1);
      this.maskRed.setTintFill(0x990000);
      this.mask.setDepth(1);
      this.barBackground.setDepth(1);
      this.bar.setDepth(1);
      this.barUi.setDepth(1);
      this.textKey.setDepth(1);
      this.textKey.setTintFill(0x7d3600);
      this.scrolOpen.setDepth(1);
      this.textScrol.setDepth(1);
      this.textScrol.setTintFill(0x7d3600);
      this.maskStart.setDepth(1);
    };

    this.colorDarknes = (col, amt) => {
      var num = parseInt(col, 16);
      var r = (num >> 16) + amt;
      var b = ((num >> 8) & 0x00ff) + amt;
      var g = (num & 0x0000ff) + amt;
      var newColor = g | (b << 8) | (r << 16);
      return newColor.toString(16);
    };

    this.healthBarUpdate = () => {
      //scale the bar
      this.bar.scaleX = this.player.getHealth() / this.player.getMaxHealth();
      this.bar.setScrollFactor(0, 0);
      this.maskRed.alpha =
        1 - this.player.getHealth() / this.player.getMaxHealth();
      this.mask.alpha = this.player.getHealth() / this.player.getMaxHealth();

      this.maskRed.setDepth(1);
      this.maskRed.setTintFill(0x990000);
      this.mask.setDepth(1);
      this.barBackground.setDepth(1);
      this.bar.setDepth(1);
      this.barUi.setDepth(1);
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

      PhaserHealth.AddTo(this.player, 100, 0, 100);

      this.timerGetdamagedGoblin = this.game.time.addEvent({
        delay: 1500,
        callback: this.goblinMakedamage,
        callbackScope: this,
        loop: true,
      });

      this.makeBar(0xac3232);
      this.healthBarUpdate();

      this.player.body.setVelocity(0);
      this.player.anims.play("knight-idle");

      this.player.on("die", this.diePlayer);

      this.flyEyeArea = new Phaser.Geom.Circle(
        this.player.x,
        this.player.y,
        this.flyEyeAreaRadius
      );

      this.game.physics.add.collider(this.player, this.map.background);
      this.game.physics.add.collider(this.player, this.map.decorazioniTerreno);
      this.level1ColliderPlayer = this.game.physics.add.collider(
        this.player,
        this.map.porteLevel1
      );
      this.level2ColliderPlayer = this.game.physics.add.collider(
        this.player,
        this.map.porteLevel2
      );
      this.game.physics.collide(this.player, this.map.walls);
      this.game.physics.add.overlap(this.player, this.map.ground);
      this.game.physics.add.collider(this.player, enemyGoblinEntity);
    };

    this.diePlayer = () => {
      this.sounds.stopBase();
      this.sounds.playLose();
      this.maskLose = this.game.add.image(
        window.innerWidth / 2,
        window.innerHeight / 2,
        "maskLose"
      );
      this.maskLose.setDepth(1);
      this.maskLose.setScrollFactor(0, 0);
      gameScene.scene.pause("default");
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

    this.checkStartOverlay = () => {
      if (this.maskStart.alpha == 1) {
        this.maskStart.alpha = 0;
      }
    }

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

         this.checkStartOverlay();

        this.player.setVelocityX(-this.velocityPlayer);

        this.player.setOffset(70, offsetY);
        this.player.anims.play("knight-run", true);
      } else if (this.cursors.right.isDown) {

         this.checkStartOverlay();

        this.player.setVelocityX(this.velocityPlayer);

        this.player.setOffset(35, offsetY);
        this.player.anims.play("knight-run", true);
      } else if (this.cursors.up.isDown) {

        this.checkStartOverlay();

        this.player.setVelocityY(-this.velocityPlayer);

        this.player.setOffset(35, offsetY);
        this.player.anims.play("knight-run", true);
      } else if (this.cursors.down.isDown) {

         this.checkStartOverlay();

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
          this.player.scaleX = -1;
        } else if (this.sword.rotation > -1.69 || this.sword.rotation < 1.69) {
          this.player.scaleX = 1;
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

    this.goblinMakedamage = () => {
      if (this.playerGetdamaged) {
        this.player.damage(15);
        this.player.tint = 0xff3f00;
        this.sounds.playHit();
        setTimeout(() => {
          this.player.tint = 0xffffff;
        }, 160);
      }
    };
    this.slimeMakedamage = () => {
      if (this.playerGetdamaged) {
        this.player.damage(10);
        this.player.tint = 0xff3f00;
        this.sounds.playHit();
        setTimeout(() => {
          this.player.tint = 0xffffff;
        }, 160);
      }
    };
    this.slimeProjectilesMakedamage = (projectiles, player) => {
      this.player.damage(20);
      projectiles.destroy();
      this.player.tint = 0xff3f00;
      this.sounds.playHit();
      setTimeout(() => {
        this.player.tint = 0xffffff;
      }, 160);
    };
    this.flyEyeMakedamage = () => {
      if (this.playerGetdamaged) {
        this.player.damage(8);
        this.player.tint = 0xff3f00;
        this.sounds.playHit();
        setTimeout(() => {
          this.player.tint = 0xffffff;
        }, 160);
      }
    };

    this.attackDamageSystem = (enemyEntity) => {
      this.enemyAngle = this.getRotationBetween(enemyEntity.getBody(), false);
      this.cursorsAngle = this.getRotationBetween(
        this.game.input.mousePointer,
        true
      );
      this.limitDamage1 =
        this.getRotationBetween(this.game.input.mousePointer, true) + 0.6;
      this.limitDamage2 =
        this.getRotationBetween(this.game.input.mousePointer, true) - 0.6;

      if (
        (this.enemyAngle > this.cursorsAngle &&
          this.enemyAngle < this.limitDamage1) ||
        (this.enemyAngle > this.limitDamage2 &&
          this.enemyAngle < this.cursorsAngle) ||
        this.enemyAngle == this.cursorsAngle
      ) {
        if (this.swordSlash._visible && this.swordTween.isPlaying()) {
          enemyEntity.playerDamage();
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
      this.sounds.playSword();
      this.swordSlash.anims.play("s-k-slash");
    };

    this.changeLevel = (tile) => {
      this.currentLevel = tile.properties.level;
    };
  }
}

export { PlayerObj };
