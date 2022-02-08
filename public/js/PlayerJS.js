function playerObj(map, cursors, game) {
  this.game = game;
  this.cursors = cursors;
  this.map = map;

  this.player;
  this.sword;
  this.swordAnimation;
  this.currentLevel = 0;
  this.attack = false;
  this.inAttack = false;
  this.swordTween;
  this.swordSlash;
  this.oldSwordposition;
  this.swordRotValue;

  this.playerSpawnPoint;
  this.velocityPlayer = 300;

  

  this.playerInitialize = () => {
    this.playerSpawnPoint = this.map.findObject(
      "SpawnGiocatore",
      (obj) => obj.name === "Spawn Giocatore"
    );

    this.player = this.game.physics.add.sprite(
      this.playerSpawnPoint.x,
      this.playerSpawnPoint.y,
      "knight-i"
    );

    this.player.setSize(40, 65);
    this.player.setOffset(35, 25);

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

    this.sword = this.game.physics.add.sprite(
      this.player.x,
      this.player.y,
      "sword-knight"
    );

    this.sword.setOrigin(-0.2, 0.5);

    this.swordSlash = this.game.physics.add.sprite(
      this.sword.x,
      this.sword.y,
      "sword-slash"
    );

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

    this.swordTween = this.game.tweens.add({
      targets: this.sword,
      duration: 100,
      rotation: 0,
      yoyo: false,
    });

     this.swordSlash.on("animationcomplete", () => {
       this.swordSlash.visible = false;
     });

    this.player.body.setVelocity(0);
    this.player.anims.play("knight-idle");
  };

  this.changeDirection = () => {
    if (this.player.body.velocity.x < 0) {
      this.player.scaleX = -1;
      this.sword.scaleX = -1;
    } else {
      this.player.scaleX = 1;
      this.sword.scaleX = 1;
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

    if (this.swordTween.isPlaying()) {
      console.log("ciao");
    }

    if (!this.swordTween.isPlaying()) {
      if (this.sword.rotation < -1.69 || this.sword.rotation > 1.69) {
        this.player.scaleX = -1;
        // this.sword.scaleX = -1;
        this.sword.setTexture("sword-flip-knight");
        this.sword.rotation = Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          this.game.input.mousePointer.x + this.game.cameras.main.scrollX,
          this.game.input.mousePointer.y + this.game.cameras.main.scrollY
        );
        this.swordSlash.rotation = Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          this.game.input.mousePointer.x + this.game.cameras.main.scrollX,
          this.game.input.mousePointer.y + this.game.cameras.main.scrollY
        );
      } else if (this.sword.rotation > -1.69 || this.sword.rotation < 1.69) {
        this.player.scaleX = 1;
        // this.sword.scaleX = 1;
        this.sword.setTexture("sword-knight");
        this.sword.rotation = Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          this.game.input.mousePointer.x + this.game.cameras.main.scrollX,
          this.game.input.mousePointer.y + this.game.cameras.main.scrollY
        );
        this.swordSlash.rotation = Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          this.game.input.mousePointer.x + this.game.cameras.main.scrollX,
          this.game.input.mousePointer.y + this.game.cameras.main.scrollY
        );
      }

      // if (this.sword.rotation < -1.69 || this.sword.rotation > 1.69) {
      //   this.sword.tint = 0xffff00;
      // } else if (this.sword.rotation > -1.69 || this.sword.rotation < 1.69) {
      //   this.sword.tint = 0xff00ff;
      // }

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

  this.animationStopped = () => {
    this.swordSlash.visible = false;
  };

  this.swordAttackAnimation = () => {
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

export { playerObj };
