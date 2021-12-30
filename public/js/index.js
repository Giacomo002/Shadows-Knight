var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#7AB8FF",
  physics: {
    default: 'arcade',
    arcade: {
      debug: true ,
      gravity: {
        y: 0
      }
    }
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
var enemies;
var velocityPlayer = 300;
var raycaster;
var ray;
var graphics;
var obstacles;
var intersections;
var dynamicMapping = true;

var game = new Phaser.Game(config);

function preload() {
  this.load.image("ground", "assets/images/test/platform.png");
  this.load.spritesheet("knight", "assets/images/player/playerRun.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  this.load.spritesheet(
    "skeleton",
    "assets/images/enemies/enemiesSkeletonRun.png",
    {
      frameWidth: 96,
      frameHeight: 96,
    }
  );
}

function create() {
  cursors = this.input.keyboard.createCursorKeys();

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

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(400, 568, "ground").setScale(2).refreshBody();

  //  Now let's create some ledges
  platforms.create(600, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(750, 220, "ground");

  //map obstacles with dynamic updating
  raycaster.mapGameObjects(platforms.getChildren(), true);

  //cast ray in all directions
  intersections = ray.castCircle();
  //draw rays
  graphics = this.add.graphics({
    lineStyle: { width: 1, color: 0x00ff00 },
    fillStyle: { color: 0xffffff, alpha: 0.3 },
  });

  player = this.physics.add.sprite(
    window.innerWidth / 2,
    window.innerHeight / 2,
    "knight"
  );

  enemies = this.physics.add.sprite(300, 400, "skeleton");

  ray.setOrigin(player.x, player.y);
  draw();
  //-----------------------------------------------------------------------------------------------------------------------

  player.setCollideWorldBounds(true);
  enemies.setCollideWorldBounds(true);

  // player.body.setSize(40, 80);
  // player.body.setOffset(12, 5);

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

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(enemies, platforms);
  this.physics.add.collider(player, enemies);


}

function update() {
  ray.setOrigin(player.x, player.y);
  //cast ray in all directions
  intersections = ray.castCircle();
  //redraw
  draw();

  //------------------------------------------------------------------------------------
  //Movimenti giocatore
  player.body.setVelocity(0);
  // enemies.setVelocityX(0);
  

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

  // enemyFollows();
}

function enemyFollows() {
  console.log("ciao");
}

//draw rays intersections
function draw() {
  graphics.clear();

  //OMBRE
  // graphics.fillStyle(0xffffff, 0.3);
  // graphics.fillPoints(intersections);

  //draw detection ray

  //clear obstacles
  for (let obstacle of platforms.getChildren()) {
    if (obstacle.isFilled) platforms.setFillStyle();
  }

  for (let intersection of intersections) {
    graphics.strokeLineShape({
      x1: ray.origin.x,
      y1: ray.origin.y,
      x2: intersection.x,
      y2: intersection.y,
    });

    // //fill hit object
    // if (intersection.object) {
    //   intersection.object.setFillStyle(0xff00ff);
    // }
    // //Draw segment
    // if (intersection.segment) {
    //   graphics.lineStyle(2, 0xffff00);
    //   graphics.strokeLineShape(intersection.segment);
    //   graphics.lineStyle(2, 0x00ff00);
    // }
  }
  //draw detection range radius
  graphics.strokeCircleShape({
    x: ray.origin.x,
    y: ray.origin.y,
    radius: ray.detectionRange,
  });
}
