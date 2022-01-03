import { Movement } from './PlayerJS.js';

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  parent: "game-container",
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
var velocityPlayer = 175;
var velocityEnemy = 100;
var raycaster;
var ray;
var ray2;
var graphics;
var obstacles;
var intersections;
var intersections2;
var rangeEnemies = 160;
var rangeEnemies2 = 300;


var game = new Phaser.Game(config);

function preload() {
  this.load.image("tiles", "assets/images/test/testMap.png");
  this.load.tilemapTiledJSON("map", "assets/images/test/testMap3.json");

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
  
  const map = this.make.tilemap({ key: "map" });
  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage("TestMap", "tiles");

  const belowLayer = map.createLayer("ground", tileset, 0, 0);
  const topLayer = map.createLayer("wall", tileset, 0, 0);

  
 

  belowLayer.setCollisionByProperty({ collides: true });
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
    },
    //set detection range
    detectionRange: rangeEnemies2,
  });

  const playerSpawnPoint = map.findObject("Objects", obj => obj.name === "Player Spawn");
  const enemySpawnPoint = map.findObject("Objects", obj => obj.name === "Enemy Spawn");

  player = this.physics.add.sprite(playerSpawnPoint.x, playerSpawnPoint.y, "knight");
  enemies = this.physics.add.sprite(enemySpawnPoint.x, enemySpawnPoint.y, "skeleton");

  player.setSize(40, 80);
  enemies.setSize(40, 80);

  obstacles = this.add.group();
  obstacles.add(player);
  obstacles.add(topLayer);

  raycaster.mapGameObjects(topLayer, false, {
    collisionTiles: [5, 6, 8, 12, 13] //array of tile types which collide with rays
  });

  raycaster.mapGameObjects(obstacles.getChildren(), true);

  //cast ray in all directions
  intersections = ray.castCircle();
  intersections2 = ray2.castCircle();
  //draw rays
  graphics = this.add.graphics({
    lineStyle: { width: 1, color: 0x00ff00 },
    fillStyle: { color: 0xffffff, alpha: 0.3 },
  });

  // player.setCollideWorldBounds(true);
  // enemies.setCollideWorldBounds(true);

  this.anims.create({
    key: "player-left",
    frames: this.anims.generateFrameNumbers("knight", { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "player-right",
    frames: this.anims.generateFrameNumbers("knight", { start: 6, end: 7 }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
    key: "player-up",
    frames: this.anims.generateFrameNumbers("knight", { start: 4, end: 5 }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
    key: "player-down",
    frames: this.anims.generateFrameNumbers("knight", { start: 2, end: 3 }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
    key: "player-idle",
    frames: [{ key: "knight", frame: 8 }],
    frameRate: 4,
  });

  cursors = this.input.keyboard.createCursorKeys();
  
  this.cameras.main.startFollow(player);

  ray.setOrigin(enemies.x, enemies.y);
  ray2.setOrigin(enemies.x, enemies.y);
  draw();

  
  

  this.physics.add.collider(player, belowLayer);
  this.physics.add.collider(enemies, belowLayer);
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
  player.body.setVelocity(0);
  enemies.body.setVelocity(0);

  for (let intersection of intersections) {
    if (intersection.object === player) {
      this.physics.moveToObject(enemies, player, 100);
      console.log("ALERT 1 :" + intersection.object);
    }
  }

  Movement(cursors, player, velocityPlayer, this);

  player.body.velocity.normalize().scale(velocityPlayer);
  enemies.body.velocity.normalize().scale(velocityEnemy);

  this.physics.collide(player, platforms);
  this.physics.collide(enemies, platforms);
  this.physics.collide(player, enemies);
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
    player.tint = 0xffff00;
  }

  for (let intersection2 of intersections2) {
    //draw detection range radius
    graphics.strokeCircleShape({
      x: ray2.origin.x,
      y: ray2.origin.y,
      radius: ray2.detectionRange,
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
      console.log("ALERT 2");
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
      console.log("ALERT 1");
    }
    // Draw segment
    if (intersection.segment) {
      graphics.lineStyle(2, 0xffff00);
      graphics.strokeLineShape(intersection.segment);
      graphics.lineStyle(2, 0x00ff00);
    }
  }

}
