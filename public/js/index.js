import { Movement } from "./PlayerJS.js";
import { drawDebugViewRayCasting } from "./functions.js";
import { rayCasterEnemie } from "./rayCasterFunctions.js";

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
var enemies2;
var enemy1;
var enemy2;
var platforms;
var velocityPlayer = 175;
var velocityEnemy = 100;
var graphics;
var obstacles;

var game = new Phaser.Game(config);

//* PRELOAD FUNCTION SECTION --------------------------------------------------------
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

//* CREATE FUNCTION SECTION --------------------------------------------------------
function create() {
  const map = this.make.tilemap({ key: "map" });
  const tileset = map.addTilesetImage("TestMap", "tiles");

  const belowLayer = map.createLayer("ground", tileset, 0, 0);
  const topLayer = map.createLayer("wall", tileset, 0, 0);

  belowLayer.setCollisionByProperty({ collides: true });

  const playerSpawnPoint = map.findObject(
    "Objects",
    (obj) => obj.name === "Player Spawn"
  );

  const enemySpawnPoint = map.findObject(
    "Objects",
    (obj) => obj.name === "Enemy Spawn"
  );

  const secondEnemy = map.findObject(
    "Objects",
    (obj) => obj.name === "Second Enemy"
  );

  player = this.physics.add.sprite(
    playerSpawnPoint.x,
    playerSpawnPoint.y,
    "knight"
  );
  enemies = this.physics.add.sprite(
    enemySpawnPoint.x,
    enemySpawnPoint.y,
    "skeleton"
  );

  enemies2 = this.physics.add.sprite(766, 186, "skeleton");

  player.setSize(40, 80);
  enemies.setSize(40, 80);
  enemies2.setSize(40, 80);

  obstacles = this.add.group();
  obstacles.add(player);
  obstacles.add(topLayer);

  //create raycaster

  //create ray

  enemy1 = new rayCasterEnemie(this, enemies, 160, 300, topLayer, obstacles);
  enemy2 = new rayCasterEnemie(this, enemies2, 160, 300, topLayer, obstacles);

  enemy1.initializeRays();
  enemy2.initializeRays();
  //cast ray in all directions
  //draw rays
  graphics = this.add.graphics({
    lineStyle: { width: 1, color: 0x00ff00 },
    fillStyle: { color: 0xffffff, alpha: 0.3 },
  });

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


  this.physics.add.collider(player, belowLayer);
  this.physics.add.collider(enemies, belowLayer);
  this.physics.add.collider(enemies2, belowLayer);
}

//* UPDATE FUNCTION SECTION --------------------------------------------------------
function update() {
  enemy1.updateRays();
  enemy2.updateRays();
  
  //------------------------------------------------------------------------------------
  //Movimenti giocatore
  player.body.setVelocity(0);
  enemies.body.setVelocity(0);
  enemies2.body.setVelocity(0);

  for (let intersection of enemy1.intersectionsShortRange) {
    if (intersection.object === player) {
      this.physics.moveToObject(enemies, player, 100);
      console.log("ALERT 1 :" + intersection.object);
    }
  }
  for (let intersection of enemy2.intersectionsShortRange) {
    if (intersection.object === player) {
      this.physics.moveToObject(enemies2, player, 100);
      console.log("ALERT 2:" + intersection.object);
    }
  }

  Movement(cursors, player, velocityPlayer, this);

  player.body.velocity.normalize().scale(velocityPlayer);
  enemies.body.velocity.normalize().scale(velocityEnemy);
  enemies2.body.velocity.normalize().scale(velocityEnemy);

  this.physics.collide(player, platforms);
  this.physics.collide(enemies, platforms);
  this.physics.collide(enemies2, platforms);
  this.physics.collide(player, enemies);
  this.physics.collide(player, enemies2);
}
