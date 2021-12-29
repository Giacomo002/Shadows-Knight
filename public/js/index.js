var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
  parent: "phaser-example",
  backgroundColor: "#0072bc",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var cursors;
var player;

var game = new Phaser.Game(config);

function preload() {
  this.load.spritesheet("knight", "assets/images/player/playerRun.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
}

function create() {
  cursors = this.input.keyboard.createCursorKeys();

    player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, "knight");

  player.setCollideWorldBounds(true);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("knight", { start: 0, end: 1 }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("knight", { start: 6, end: 7 }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
    key: "up",
    frames: this.anims.generateFrameNumbers("knight", { start: 4, end: 5 }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
    key: "down",
    frames: this.anims.generateFrameNumbers("knight", { start: 2, end: 3 }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
      key: "idle",
      frames: [{ key: "knight", frame: 8 }],
      frameRate: 4,
  });
}

function update() {
    player.setVelocity(0);
    
    //Movimenti giocatore

  if (cursors.left.isDown && cursors.up.isDown) {
      player.setVelocityX(-300);
      player.setVelocityY(-300);
    player.anims.play("up", true);
  } else if (cursors.right.isDown && cursors.up.isDown) {
      player.setVelocityX(300);
      player.setVelocityY(-300);
    player.anims.play("up", true);
  } else if (cursors.left.isDown && cursors.down.isDown) {
      player.setVelocityX(-300);
      player.setVelocityY(300);
    player.anims.play("down", true);
  } else if (cursors.right.isDown && cursors.down.isDown) {
      player.setVelocityX(300);
      player.setVelocityY(300);
    player.anims.play("down", true);
  } else if (cursors.left.isDown) {
    player.setVelocityX(-300);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(300);
    player.anims.play("right", true);
  }else if (cursors.up.isDown) {
    player.setVelocityY(-300);
    player.anims.play("up", true);
  } else if (cursors.down.isDown) {
    player.setVelocityY(300);
    player.anims.play("down", true);
  } else {
      player.setVelocityX(0);
      player.anims.play("idle");
  }
}
