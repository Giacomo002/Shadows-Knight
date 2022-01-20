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

let cursors;
let player;
let enemies;
let enemies2;
let enemy1;
let enemy2;
let platforms;
let velocityPlayer = 175;
let velocityEnemy = 100;
let graphics;
let obstacles;

let game = new Phaser.Game(config);

//* PRELOAD FUNCTION SECTION --------------------------------------------------------
function preload() {
  this.load.image("tiles", "asset/mappe/mappa1TEST/fullTilemap.png");
  this.load.tilemapTiledJSON(
    "map",
    "asset/mappe/mappa1TEST/mappaTestLevel1.json"
  );

  this.load.spritesheet(
    "knight-r",
    "asset/heroes/knight/knight_run_spritesheet.png",
    {
      frameWidth: 96,
      frameHeight: 96,
    }
  );
  this.load.spritesheet(
    "knight-i",
    "asset/heroes/knight/knight_idle_spritesheet.png",
    {
      frameWidth: 96,
      frameHeight: 96,
    }
  );

  this.load.spritesheet(
    "skeleton",
    "assets3/images/enemies/enemiesSkeletonRun.png",
    {
      frameWidth: 96,
      frameHeight: 96,
    }
  );
}

//* CREATE FUNCTION SECTION --------------------------------------------------------
function create() {
  const map = this.make.tilemap({ key: "map" });
  const tileset = map.addTilesetImage("dungeonTileset", "tiles");

  const esternoLayer = map.createLayer("esterno", tileset, 0, 0);
  const groundLayer = map.createLayer("ground", tileset, 0, 0);
  const muriLayer = map.createLayer("muri", tileset, 0, 0);
  const bandiereLayer = map.createLayer("bandiere", tileset, 0, 0);
  const oggettiLayer = map.createLayer("oggetti", tileset, 0, 0);

  const perimetroLayer = map.createLayer("perimetro", tileset, 0, 0);

  perimetroLayer.setCollisionByProperty({ collides: true });
  oggettiLayer.setCollisionByProperty({ collides: true });

  const playerSpawnPoint = map.findObject(
    "SpawnPoint",
    (obj) => obj.name === "Spawn Giocatore"
  );

  const firstenemySpawn = map.findObject(
    "SpawnPoint",
    (obj) => obj.name === "Spawn Nemici 1"
  );

  const secondEnemy = map.findObject(
    "SpawnPoint",
    (obj) => obj.name === "Spawn Nemici 2"
  );

  player = this.physics.add.sprite(
    playerSpawnPoint.x,
    playerSpawnPoint.y,
    "knight-i"
  );
  enemies = this.physics.add.sprite(
    firstenemySpawn.x,
    firstenemySpawn.y,
    "skeleton"
  );

  enemies2 = this.physics.add.sprite(766, 186, "skeleton");

  // player.setSize(40, 80);
  enemies.setSize(40, 80);
  enemies2.setSize(40, 80);

  obstacles = this.add.group();
  obstacles.add(player);
  obstacles.add(perimetroLayer);
  obstacles.add(muriLayer);

  //create raycaster

  //create ray

  enemy1 = new rayCasterEnemie(this, enemies, 160, 300, muriLayer, obstacles);
  enemy2 = new rayCasterEnemie(this, enemies2, 160, 300, muriLayer, obstacles);

  enemy1.initializeRays();
  enemy2.initializeRays();
  //cast ray in all directions
  //draw rays

  graphics = this.add.graphics({
    lineStyle: { width: 1, color: 0x00ff00 },
    fillStyle: { color: 0xffffff, alpha: 0.3 },
  });

  this.anims.create({
    key: "knight-run",
    frames: this.anims.generateFrameNumbers("knight-r", { start: 0, end: 5 }),
    frameRate: 11,
    repeat: -1,
  });
  this.anims.create({
    key: "knight-idle",
    frames: this.anims.generateFrameNumbers("knight-i", { start: 0, end: 5, }),
    frameRate: 11,
    repeat: -1,
  });

  player.body.setVelocity(0);
  player.anims.play("knight-idle");
  const struttureLayer = map.createLayer("strutture", tileset, 0, 0);

  cursors = this.input.keyboard.createCursorKeys();

  this.cameras.main.startFollow(player);

  this.physics.add.collider(player, perimetroLayer);
  this.physics.add.collider(enemies, perimetroLayer);
  this.physics.add.collider(enemies2, perimetroLayer);
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

  Movement(cursors, player, velocityPlayer, this);
  
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

  

  player.body.velocity.normalize().scale(velocityPlayer);
  enemies.body.velocity.normalize().scale(velocityEnemy);
  enemies2.body.velocity.normalize().scale(velocityEnemy);

  this.physics.collide(player, platforms);
  this.physics.collide(enemies, platforms);
  this.physics.collide(enemies2, platforms);
  this.physics.collide(player, enemies);
  this.physics.collide(player, enemies2);
}
