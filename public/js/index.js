import { playerObj } from "./PlayerJS.js";
import { goblinObj } from "./EnemyJS.js";
import { drawDebugViewRayCasting } from "./functions.js";
import { rayCasterEnemie } from "./rayCasterFunctions.js";

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  backgroundColor: "#394355",
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
let player1;

let goblinGroup = [];
let slime;
let flyEye;

let tempGoblin;

let arrayGoblins;
let arraySlime;
let arrayFlyEys;

let enemies2;
let enemy1;
let enemy2;
let platforms;
let velocityEnemy = 100;
let graphics;
let obstaclesEnemys;
let trappoleTerreno;

let game = new Phaser.Game(config);

//* PRELOAD FUNCTION SECTION --------------------------------------------------------
function preload() {
  this.load.scenePlugin(
    "AnimatedTiles",
    "https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js",
    "animatedTiles",
    "animatedTiles"
  );

  this.load.tilemapTiledJSON("map", "asset/mappe/mappaGioco.json");
  this.load.image("tiles", "asset/tiles/fullTilemap.png");
  this.load.image("tilesSecond", "asset/tiles/fullSpritesheet.png");
  this.load.image("tiles-background", "asset/tiles/background2.png");
  this.load.image("tiles-background1", "asset/tiles/background.png");

  
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

  this.load.spritesheet("goblin-i", "asset/enemies/goblin/goblinIdle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  this.load.spritesheet("slime-i", "asset/enemies/slime/slimeIdle.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  this.load.spritesheet(
    "flyEye-i",
    "asset/enemies/flying creature/flyAnim.png",
    {
      frameWidth: 96,
      frameHeight: 96,
    }
  );
}

//* CREATE FUNCTION SECTION --------------------------------------------------------
function create() {
  cursors = this.input.keyboard.createCursorKeys();

  const map = this.make.tilemap({ key: "map" });

  const tileset1 = map.addTilesetImage("fullTilemap", "tiles");
  const tileset2 = map.addTilesetImage("fullSpritesheet", "tilesSecond");
  const tileset3 = map.addTilesetImage("background2", "tiles-background");
  const tileset4 = map.addTilesetImage("background", "tiles-background1");

  const background = map.createLayer("background", tileset3);
  const ground = map.createLayer("ground", [tileset1, tileset4]);
  const stairs = map.createLayer("stairs", tileset1);
  const walls = map.createLayer("walls", tileset1);
  trappoleTerreno = map.createDynamicLayer("trappoleTerreno", tileset2);
  const porteChiuse = map.createLayer("porteChiuse", tileset2, 0, 0);

  const decorazioniTerreno = map.createLayer("decorazioniTerreno", tileset1);
  const decorazioniMuro = map.createDynamicLayer("decorazioniMuro", [
    tileset1,
    tileset2,
  ]);

  const structures = map.createLayer("structures", tileset1);
  const upperWalls = map.createLayer("upperWalls", tileset1);
  const upperWalls2 = map.createLayer("upperWalls2", tileset1);

  upperWalls.setDepth(1);
  upperWalls.setDepth(1);
  upperWalls2.setDepth(1);
  background.setDepth(1);
  structures.setDepth(1);

  // const firstenemySpawn = map.findObject(
  //   "SpawnPoint",
  //   (obj) => obj.name === "Spawn Nemici 1"
  // );

  // const secondEnemy = map.findObject(
  //   "SpawnPoint",
  //   (obj) => obj.name === "Spawn Nemici 2"
  // );

  player1 = new playerObj(map, cursors, this);

  player1.playerInitialize();

  console.log(map.objects);

  arrayGoblins = map.objects[3].objects;

  arraySlime = map.objects[6].objects;

  arrayFlyEys = map.objects[4].objects;

  this.game.anims.create({
    key: "goblin-idle",
    frames: this.game.anims.generateFrameNumbers("goblin-i", {
      start: 0,
      end: 5,
    }),
    frameRate: 11,
    repeat: -1,
  });

  obstaclesEnemys = this.add.group();

  obstaclesEnemys.add(player1.player);
  obstaclesEnemys.add(background);
  obstaclesEnemys.add(walls);
  obstaclesEnemys.add(upperWalls);
  obstaclesEnemys.add(upperWalls2);

  for (let position of arrayGoblins) {
    tempGoblin = new goblinObj(position, obstaclesEnemys, this);
    tempGoblin.goblinInitialize();
    goblinGroup.push(tempGoblin);
  }

  for (let position of arraySlime) {
    slime = this.physics.add.sprite(position.x, position.y, "slime-i");
  }

  for (let position of arrayFlyEys) {
    flyEye = this.physics.add.sprite(position.x, position.y, "flyEye-i");
  }

  // enemies = this.physics.add.sprite(
  //   firstenemySpawn.x,
  //   firstenemySpawn.y,
  //   "skeleton"
  // );

  // enemies2 = this.physics.add.sprite(766, 186, "skeleton");

  // // player.setSize(40, 80);
  // enemies.setSize(40, 80);
  // enemies2.setSize(40, 80);

  // obstacles = this.add.group();
  // obstacles.add(player);
  // obstacles.add(perimetroLayer);
  // obstacles.add(muriLayer);

  //create raycaster

  //create ray

  // enemy1 = new rayCasterEnemie(this, enemies, 160, 300, muriLayer, obstacles);
  // enemy2 = new rayCasterEnemie(this, enemies2, 160, 300, muriLayer, obstacles);

  // enemy1.initializeRays();
  // enemy2.initializeRays();

  //cast ray in all directions
  //draw rays


  graphics = this.add.graphics({
    lineStyle: { width: 1, color: 0x00ff00 },
    fillStyle: { color: 0xffffff, alpha: 0.3 },
  });

  
  // drawDebugViewRayCasting();

  background.setCollisionByProperty({ collides: true });
  porteChiuse.setCollisionByProperty({ collides: true });
  decorazioniTerreno.setCollisionByProperty({ collides: true });

  this.animatedTiles.init(map);

  this.cameras.main.startFollow(player1.player);

  this.physics.add.collider(player1.player, background);
  this.physics.add.collider(player1.player, decorazioniTerreno);
  this.physics.add.overlap(player1.player, ground);
  // this.physics.add.collider(enemies, perimetroLayer);
  // this.physics.add.collider(enemies2, perimetroLayer);
}

//* UPDATE FUNCTION SECTION --------------------------------------------------------
function update() {
  // enemy1.updateRays();
  // enemy2.updateRays();

  // console.log(goblinGroup);

  var tileTrappole = trappoleTerreno.getTileAtWorldXY(
    player1.player.x,
    player1.player.y
  );
  var tileAttackPlayer = trappoleTerreno.getTileAtWorldXY(
    player1.player.x,
    player1.player.y
  );
  //------------------------------------------------------------------------------------
  //Movimenti giocatore
  player1.player.tint = 0xffff00;
  player1.player.body.setVelocity(0);
  // enemies.body.setVelocity(0);
  // enemies2.body.setVelocity(0);

  player1.movement();

  // for (let goblinEnemy of goblinGroup) {
  //   goblinEnemy.goblinRay.updateRays();
  //   goblinEnemy.goblinChasePlayer(player1.player);
  // }

  // for (let intersection of enemy1.intersectionsShortRange) {
  //   if (intersection.object === player) {
  //     this.physics.moveToObject(enemies, player, 100);
  //     console.log("ALERT 1 :" + intersection.object);
  //   }
  // }
  // for (let intersection of enemy2.intersectionsShortRange) {
  //   if (intersection.object === player) {
  //     this.physics.moveToObject(enemies2, player, 100);
  //     console.log("ALERT 2:" + intersection.object);
  //   }
  // }

  player1.player.body.velocity.normalize().scale(player1.velocityPlayer);

  if (tileTrappole != null) {
    // console.log(tile.index);
    if (
      tileTrappole.index == 125 ||
      tileTrappole.index == 126 ||
      tileTrappole.index == 127 ||
      tileTrappole.index == 128
    ) {
      player1.player.tint = 0xff00ff;
      // console.log("MORTO");
    }
  }
  if (tileAttackPlayer != null) {
    console.log(tileTrappole);
    if (
      tileTrappole.index == 125 ||
      tileTrappole.index == 126 ||
      tileTrappole.index == 127 ||
      tileTrappole.index == 128
    ) {
      player1.player.tint = 0xff00ff;
      // console.log("MORTO");
    }
  }

  // enemies.body.velocity.normalize().scale(velocityEnemy);
  // enemies2.body.velocity.normalize().scale(velocityEnemy);

  this.physics.collide(player1.player, platforms);
  // this.physics.collide(enemies, platforms);
  // this.physics.collide(enemies2, platforms);
  // this.physics.collide(player, enemies);
  // this.physics.collide(player, enemies2);
}
