
var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#7AB8FF",
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
  //Abilitare Phaser-raycaster plugin
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
var platforms;
var velocityPlayer = 300;
var raycaster;
var ray;
var ray2;
var graphics;
var obstacles;
var intersections;
var intersections2;
var rangeEnemies = 400;

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
  //create raycaster
  raycaster = this.raycasterPlugin.createRaycaster();
  //create ray
  ray = raycaster.createRay({
    origin: {
      x: 400,
      y: 300,
    },
    //set detection range
    detectionRange: rangeEnemies,
  });

  ray2 = raycaster.createRay({
    origin: {
      x: 400,
      y: 300,
    }
  });

  player = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, "knight");
  enemies = this.physics.add.sprite(300, 400, "skeleton");

  obstacles = this.add.group();
  obstacles.add(this.physics.add.staticImage(300, 778, "ground").setScale(2).refreshBody());
  obstacles.add(this.physics.add.staticImage(600, 400, "ground"));
  obstacles.add(this.physics.add.staticImage(50, 250, "ground"));
  obstacles.add(this.physics.add.staticImage(750, 220, "ground"));
  obstacles.add(player);
  //map obstacles with dynamic updating
  raycaster.mapGameObjects(obstacles.getChildren(), true);
  //cast ray in all directions
  intersections = ray.castCircle();
  intersections2 = ray2.castCircle();
  //draw rays
  graphics = this.add.graphics({
    lineStyle: { width: 1, color: 0x00ff00 },
    fillStyle: { color: 0xffffff, alpha: 0.3 },
  });

  platforms = this.physics.add.staticGroup();

  platforms.add(this.physics.add.staticImage(300, 778, "ground").setScale(2).refreshBody());
  platforms.add(this.physics.add.staticImage(600, 400, "ground"));
  platforms.add(this.physics.add.staticImage(50, 250, "ground"));
  platforms.add(this.physics.add.staticImage(750, 220, "ground"));

  player.setCollideWorldBounds(true);
  enemies.setCollideWorldBounds(true);

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

  cursors = this.input.keyboard.createCursorKeys();

  ray.setOrigin(enemies.x, enemies.y);
  ray2.setOrigin(enemies.x, enemies.y);
  draw();

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(enemies, platforms);
}

function update() {
  
  ray.setOrigin(enemies.x, enemies.y);
  ray2.setOrigin(enemies.x, enemies.y);
  //cast ray in all directions
  intersections = ray.castCircle();
  intersections2 = ray2.castCircle();
  //redraw
  draw();

  //------------------------------------------------------------------------------------
  //Movimenti giocatore
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  enemies.body.velocity.x = 0;
  enemies.body.velocity.y = 0;
  for (let intersection of intersections) {
    if (intersection.object === player) {
      this.physics.moveToObject(enemies, player, 100);
      // console.log("ALERT");
    }
  }
  
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
    player.anims.play("idle");
  }

  this.physics.collide(player, platforms);
  this.physics.collide(enemies, platforms);
  this.physics.collide(player, enemies);
}



//draw rays intersections
function draw() {
  graphics.clear();

  //OMBRE
  graphics.fillStyle(0xffffff, 0.3);
  graphics.fillPoints(intersections);

  //draw detection ray

  //clear obstacles
  for (let obstacle of obstacles.getChildren()) {
     player.tint = 0xffff00;
  }
  for (let intersection2 of intersections2) {
    //draw detection range radius
    graphics.strokeCircleShape({
      x: ray2.origin.x,
      y: ray2.origin.y,
      radius: ray.detectionRange,
    });
    graphics.strokeLineShape({
      x1: ray2.origin.x,
      y1: ray2.origin.y,
      x2: intersection2.x,
      y2: intersection2.y,
    });

    // //fill hit object
    if (intersection2.object === player) {
      player.tint = 0x00ff00;
      // this.physics.moveTo(enemies, player.x, player.y, 100);
      // console.log("ALERT");
    }
    // Draw segment
    if (intersection2.segment) {
      graphics.lineStyle(2, 0xffff00);
      graphics.strokeLineShape(intersection2.segment);
      graphics.lineStyle(2, 0x00ff00);
    }
  }
  for (let intersection of intersections) {
    //draw detection range radius
    graphics.strokeCircleShape({
      x: ray.origin.x,
      y: ray.origin.y,
      radius: ray.detectionRange,
    });
    graphics.strokeLineShape({
      x1: ray.origin.x,
      y1: ray.origin.y,
      x2: intersection.x,
      y2: intersection.y,
    });

    // //fill hit object
    if (intersection.object === player) {
      player.tint = 0xff00ff;
      // this.physics.moveTo(enemies, player.x, player.y, 100);
      // console.log("ALERT");
    }
    // Draw segment
    if (intersection.segment) {
      graphics.lineStyle(2, 0xffff00);
      graphics.strokeLineShape(intersection.segment);
      graphics.lineStyle(2, 0x00ff00);
    }
  }

  
  
}
