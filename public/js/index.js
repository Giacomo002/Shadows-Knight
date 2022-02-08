import { playerObj } from "./PlayerJS.js";
import { goblinObj } from "./EnemyJS.js";
import { drawDebugViewRayCasting } from "./functions.js";
import { rayCasterEnemie } from "./rayCasterFunctions.js";

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#394355",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  fps: {
    target: 60,
    forceSetTimeOut: false,
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

let arrayGoblinslevel1;
let arraySlime;
let arrayFlyEys;
let sword;

let enemies2;
let enemy1;
let enemy2;
let platforms;
let velocityEnemy = 100;
let graphics;
let obstaclesEnemys;
let trappoleTerreno;
let walls;
let background;
let checkForPlayer;
let levelChecker;

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
  this.load.image("attackPlayerTiles", "asset/tiles/attackPlayerTiles.png");
  this.load.image("levelportal", "asset/tiles/levelportal.png");
  this.load.image("sword-knight", "asset/heroes/knight/weapon_sword_11.png");
  this.load.spritesheet(
    "sword-slash",
    "asset/effects/slash_effect_anim_spritesheet96x96.png",
    {
      frameWidth: 96,
      frameHeight: 96,
    }
  );
  this.load.image(
    "sword-flip-knight",
    "asset/heroes/knight/weapon_sword_11-flip.png"
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
  this.input.mouse.disableContextMenu();

  const map = this.make.tilemap({ key: "map" });

  const tileset1 = map.addTilesetImage("fullTilemap", "tiles");
  const tileset2 = map.addTilesetImage("fullSpritesheet", "tilesSecond");
  const tileset3 = map.addTilesetImage("background2", "tiles-background");
  const tileset4 = map.addTilesetImage("background", "tiles-background1");
  const tileset5 = map.addTilesetImage(
    "attackPlayerTiles",
    "attackPlayerTiles"
  );
  const tileset6 = map.addTilesetImage("levelportal", "levelportal");

  background = map.createLayer("background", tileset3);
  checkForPlayer = map.createLayer("CheckForPlayer", tileset5);
  levelChecker = map.createLayer("levelChecker", tileset5);
  const ground = map.createLayer("ground", [tileset1, tileset4]);
  const stairs = map.createLayer("stairs", tileset1);
  walls = map.createLayer("walls", tileset1);
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

  this.input.setDefaultCursor("url(asset/ui/crosshair_180x80.png), pointer");

  player1 = new playerObj(map, cursors, this);

  player1.playerInitialize();

  // console.log(map.objects);

  arrayGoblinslevel1 = map.objects[3].objects;

  // arraySlime = map.objects[6].objects;

  // arrayFlyEys = map.objects[4].objects;

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

  for (let position of arrayGoblinslevel1) {
    tempGoblin = new goblinObj(position, obstaclesEnemys, this);
    tempGoblin.goblinInitialize();
    goblinGroup.push(tempGoblin);
    
  }

  this.input.on(
    "pointerdown",
    function (pointer) {
      if (pointer.leftButtonDown()) {
        if (pointer.getDuration() < 500) {
          player1.swordAttackAnimation();
        }
      }
    },
    this
  );



  background.setCollisionByProperty({ collides: true });
  porteChiuse.setCollisionByProperty({ collides: true });
  decorazioniTerreno.setCollisionByProperty({ collides: true });

  this.animatedTiles.init(map);

  this.cameras.main.startFollow(player1.player);

  this.physics.add.collider(player1.player, background);
  this.physics.add.collider(player1.player, decorazioniTerreno);
  this.physics.add.overlap(player1.player, ground);
  // this.physics.add.overlap(sprite, healthGroup, spriteHitHealth);
  // this.physics.add.collider(enemies, perimetroLayer);
  // this.physics.add.collider(enemies2, perimetroLayer);
}

//* UPDATE FUNCTION SECTION --------------------------------------------------------
function update() {
  var pointer = this.input.activePointer;
  

  var tileTrappole = trappoleTerreno.getTileAtWorldXY(
    player1.player.x,
    player1.player.y
  );

  var tileMuro = walls.getTileAtWorldXY(player1.player.x, player1.player.y);

  var tileAttackPlayer = checkForPlayer.getTileAtWorldXY(
    player1.player.x,
    player1.player.y
  );

  var tileLevel = levelChecker.getTileAtWorldXY(
    player1.player.x,
    player1.player.y
  );
  //------------------------------------------------------------------------------------
  //Movimenti giocatore
  // player1.player.tint = 0xffff00;
  player1.player.body.setVelocity(0);
  if (tileLevel) player1.changeLevel(tileLevel);
  // enemies.body.setVelocity(0);
  // enemies2.body.setVelocity(0);
  for (let goblinEnemy of goblinGroup) {
    goblinEnemy.goblinChasePlayer(
      tileAttackPlayer,
      checkForPlayer,
      player1.player
    );
    
  }


  //DANNO CON ATTACCO RILEVAMENTO DA FINIRE MA FUNZIONANTE
for (let goblinEnemy of goblinGroup) {
  var boundsA = goblinEnemy.goblin.getBounds();
  var boundsB = player1.swordSlash.getBounds();
  if(Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB)){
    console.log("colpito");
  }
}
  

  if (tileTrappole) {
    if (
      tileTrappole.index == 125 ||
      tileTrappole.index == 126 ||
      tileTrappole.index == 127 ||
      tileTrappole.index == 128
    ) {
      // player1.player.tint = 0xff00ff;
    }
  }

  if (tileMuro) {
    if (
      tileMuro.index == 305 ||
      tileMuro.index == 304 ||
      tileMuro.index == 295 ||
      tileMuro.index == 296 ||
      tileMuro.index == 306 ||
      tileMuro.index == 297
    ) {
      player1.player.setSize(40, 96);
      player1.player.setOffset(35, 0);
      player1.movement(0);
      if (player1.player.scaleX == -1) {
        player1.player.setOffset(70, 0);
      } else {
        player1.player.setOffset(35, 0);
      } 
    }
  } else {
    player1.movement(25);
    player1.player.setSize(40, 65);
    if (player1.player.scaleX == -1) {
      player1.player.setOffset(70, 25);
    } else {
      player1.player.setOffset(35, 25);
    }
  }

  

  player1.player.body.velocity.normalize().scale(player1.velocityPlayer);
  // enemies.body.velocity.normalize().scale(velocityEnemy);
  // enemies2.body.velocity.normalize().scale(velocityEnemy);

  this.physics.collide(player1.player, background);
  // this.physics.collide(enemies, platforms);
  // this.physics.collide(enemies2, platforms);
  // this.physics.collide(player, enemies);
  // this.physics.collide(player, enemies2);
}
