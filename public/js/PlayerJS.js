function playerObj(map, cursors, game) {
  this.game = game;
  this.cursors = cursors;
  this.map = map;

  this.player;
  this.currentLevel = 0;

  this.playerSpawnPoint;
  this.velocityPlayer = 200;

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

    this.player.body.setVelocity(0);
    this.player.anims.play("knight-idle");
  };

  this.changeDirection = () => {
    if (this.player.body.velocity.x < 0) {
      this.player.scaleX = -1;
    } else {
      this.player.scaleX = 1;
    }
  };

  this.movement = (offsetY) => {
    if (this.cursors.left.isDown && this.cursors.up.isDown) {
      this.player.setVelocityX(-this.velocityPlayer);
      this.player.setVelocityY(-this.velocityPlayer);

      this.changeDirection();

      this.player.body.setOffset(70, offsetY);

      this.player.anims.play("knight-run", true);
    } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
      this.player.setVelocityX(this.velocityPlayer);
      this.player.setVelocityY(-this.velocityPlayer);

      this.changeDirection();

      this.player.setOffset(35, offsetY);
      this.player.anims.play("knight-run", true);
    } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
      this.player.setVelocityX(-this.velocityPlayer);
      this.player.setVelocityY(this.velocityPlayer);

      this.changeDirection();

      this.player.body.setOffset(70, offsetY);
      this.player.anims.play("knight-run", true);
    } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
      this.player.setVelocityX(this.velocityPlayer);
      this.player.setVelocityY(this.velocityPlayer);

      this.changeDirection();

      this.player.setOffset(35, offsetY);
      this.player.anims.play("knight-run", true);
    } else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.velocityPlayer);

      this.changeDirection();

      this.player.setOffset(70, offsetY);
      this.player.anims.play("knight-run", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.velocityPlayer);

      this.changeDirection();

      this.player.setOffset(35, offsetY);
      this.player.anims.play("knight-run", true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-this.velocityPlayer);

      this.changeDirection();

      this.player.setOffset(35, offsetY);
      this.player.anims.play("knight-run", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.velocityPlayer);

      this.changeDirection();

      this.player.setOffset(35, offsetY);
      this.player.anims.play("knight-run", true);
    } else {
      this.player.body.setVelocity(0);
      this.player.anims.play("knight-idle", true);
    }
  };

  this.changeLevel = (tile) => {
    this.currentLevel = tile.properties.level;
  }
}

export { playerObj };
