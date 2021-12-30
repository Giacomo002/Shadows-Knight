var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#7AB8FF",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  //enable Phaser-raycaster plugin
  plugins: {
    scene: [
      {
        key: "PhaserRaycaster",
        plugin: PhaserRaycaster,
        mapping: "raycasterPlugin",
      },
    ],
  },
};

var cursors;
var player;
var velocityPlayer = 300;
var raycaster;
var ray;
var graphics;
var obstacles;
var intersections;
var toggleBtn;
var dynamicMapping = true;

var game = new Phaser.Game(config);

function preload() {
  this.load.spritesheet("knight", "assets/images/player/playerRun.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
}

function create() {
  cursors = this.input.keyboard.createCursorKeys();

  player = this.physics.add.sprite(
    window.innerWidth / 2,
    window.innerHeight / 2,
    "knight"
  );

  //-----------------------------------------------------------------------------------------------------------------------

  //create raycaster
  raycaster = this.raycasterPlugin.createRaycaster();

  //create ray
  ray = raycaster.createRay({
    origin: {
      x: 400,
      y: 300,
    },
    //set detection range
    detectionRange: 200,
  });

  //create obstacles
  obstacles = this.physics.add.staticGroup();
  createObstacles(this);

  //map obstacles with dynamic updating
  raycaster.mapGameObjects(obstacles.getChildren(), true);

  //cast ray in all directions
  intersections = ray.castCircle();
  //draw rays
  graphics = this.add.graphics({
    lineStyle: { width: 1, color: 0x00ff00 },
    fillStyle: { color: 0xffffff, alpha: 0.3 },
  });
  draw();

  ray.setOrigin(player.x, player.y);

  //-----------------------------------------------------------------------------------------------------------------------

  player.setCollideWorldBounds(true);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("knight", { start: 0, end: 1 }),
    frameRate: 10,
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

  this.physics.add.collider(player, obstacles);
}

function update() {
  ray.setOrigin(player.x, player.y);
  //cast ray in all directions
  intersections = ray.castCircle();
  //redraw
  draw();

  //------------------------------------------------------------------------------------
  //Movimenti giocatore
  player.setVelocity(0);

  if (cursors.left.isDown && cursors.up.isDown) {
    player.setVelocityX(-velocityPlayer);
    player.setVelocityY(-velocityPlayer);
    player.anims.play("up", true);
  } else if (cursors.right.isDown && cursors.up.isDown) {
    player.setVelocityX(velocityPlayer);
    player.setVelocityY(-velocityPlayer);
    player.anims.play("up", true);
  } else if (cursors.left.isDown && cursors.down.isDown) {
    player.setVelocityX(-velocityPlayer);
    player.setVelocityY(velocityPlayer);
    player.anims.play("left", true);
  } else if (cursors.right.isDown && cursors.down.isDown) {
    player.setVelocityX(velocityPlayer);
    player.setVelocityY(velocityPlayer);
    player.anims.play("right", true);
  } else if (cursors.left.isDown) {
    player.setVelocityX(-velocityPlayer);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(velocityPlayer);
    player.anims.play("right", true);
  } else if (cursors.up.isDown) {
    player.setVelocityY(-velocityPlayer);
    player.anims.play("up", true);
  } else if (cursors.down.isDown) {
    player.setVelocityY(velocityPlayer);
    player.anims.play("down", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("idle");
  }
}

//create obstacles
function createObstacles(scene) {
  //create rectangle obstacle
  let obstacle = scene.add
    .rectangle(100, 100, 75, 75)
    .setStrokeStyle(1, 0xff0000);
  obstacles.add(obstacle, true);

  //create line obstacle
  obstacle = scene.add
    .line(400, 100, 0, 0, 200, 50)
    .setStrokeStyle(1, 0xff0000);
  obstacles.add(obstacle);

  //create circle obstacle
  obstacle = scene.add
    .circle(650, 100, 50)
    .setOrigin(1, 0.5)
    .setStrokeStyle(1, 0xff0000);
  obstacles.add(obstacle);

  //create polygon obstacle
  obstacle = scene.add
    .polygon(650, 500, [0, 0, 50, 50, 100, 0, 100, 75, 50, 100, 0, 50])
    .setStrokeStyle(1, 0xff0000);
  obstacles.add(obstacle);

  //create overlapping obstacles
  for (let i = 0; i < 5; i++) {
    obstacle = scene.add
      .rectangle(350 + 30 * i, 550 - 30 * i, 50, 50)
      .setStrokeStyle(1, 0xff0000);
    obstacles.add(obstacle, true);
  }
}

//draw rays intersections
function draw() {
  graphics.clear();

  //OMBRE
  // graphics.fillStyle(0xffffff, 0.3);
  // graphics.fillPoints(intersections);

  //draw detection ray

  //clear obstacles
  for (let obstacle of obstacles.getChildren()) {
    if (obstacle.isFilled) obstacle.setFillStyle();
  }

  for (let intersection of intersections) {
    graphics.strokeLineShape({
      x1: ray.origin.x,
      y1: ray.origin.y,
      x2: intersection.x,
      y2: intersection.y,
    });

    //fill hit object
    if (intersection.object) {
      intersection.object.setFillStyle(0xff00ff);
    }
    //Draw segment
    if (intersection.segment) {
      graphics.lineStyle(2, 0xffff00);
      graphics.strokeLineShape(intersection.segment);
      graphics.lineStyle(2, 0x00ff00);
    }
  }
  //draw detection range radius
  graphics.strokeCircleShape({
    x: ray.origin.x,
    y: ray.origin.y,
    radius: ray.detectionRange,
  });
}
