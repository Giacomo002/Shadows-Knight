import { playerObj } from "./PlayerJS.js";
import { GoblinObj } from "./EnemyJS.js";
// import { Mrpas } from "./mrpas.js";
import { mapObj } from "./map.js";

var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#394355",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
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
};

let cursors;
let player1;
let map1;
let imgcursor;
let graphic;

let goblinGroupEntity = [];
let goblinGroupBody = [];

let tempGoblin;

let arrayGoblinslevel1;
let enemyCount;
let text;
let r1;
let r2;
let overlapC = false;

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
  this.load.spritesheet("goblin-rL", "asset/enemies/goblin/goblinRunL.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  this.load.spritesheet("goblin-rR", "asset/enemies/goblin/goblinrRunR.png", {
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
  this.load.spritesheet(
    "hit-e",
    "asset/effects/hit_effect_anim_spritesheet.png",
    {
      frameWidth: 48,
      frameHeight: 48,
    }
  );
  this.load.spritesheet(
    "dead-e",
    "asset/effects/enemy_afterdead_explosion_anim_spritesheet.png",
    {
      frameWidth: 96,
      frameHeight: 96,
    }
  );

  this.load.image("invisibleMask", "asset/invisibleMask.png");
  this.load.image("healthBarUi", "asset/ui/health_ui16.png");
  this.load.image("mask", "asset/ui/mask.png");
  this.load.image(
    "arrowTest",
    "asset/effects/longarrow.png"
  );
}

//* CREATE FUNCTION SECTION --------------------------------------------------------
function create() {
  cursors = this.input.keyboard.createCursorKeys();
  this.input.mouse.disableContextMenu();

  map1 = new mapObj(this);

  map1.mapInitialize();

  imgcursor = this.input.setDefaultCursor(
    "url(asset/ui/crosshair_180x80.png), pointer"
  );

  player1 = new playerObj(cursors, this, map1);

  player1.playerInitialize(goblinGroupBody);

  map1.getPlayer(player1);

  arrayGoblinslevel1 = map1.map.objects[3].objects;

  //-----------------------------------------
  //ENEMIES GOBLIN
  for (let position of arrayGoblinslevel1) {
    tempGoblin = new GoblinObj(position, this, map1, player1);
    tempGoblin.goblinInitialize();
    goblinGroupEntity.push(tempGoblin);
    goblinGroupBody.push(tempGoblin.goblin);
  }

  // arraySlime = map.objects[6].objects;

  // arrayFlyEys = map.objects[4].objects;

  this.input.on(
    "pointerdown",
    function (pointer) {
      if (pointer.leftButtonDown()) {
        if (pointer.getDuration() < 500) {
          player1.swordAttack();
        }
      }
    },
    this
  );

  // r1 = this.add.circle(600, 200, 240);

  // r1.setStrokeStyle(2, 0x00ff00).setDepth(1);

  // r1.x = player1.player.x;
  // r1.y = player1.player.y;

  // r2 = this.add.circle(600, 200, 120);

  // r2.setStrokeStyle(2, 0x00ff00).setDepth(1);

  // r2.x = player1.player.x;
  // r2.y = player1.player.y;

  this.animatedTiles.init(map1.map);

  this.cameras.main.startFollow(player1.player);

  // text = this.add
  //   .text(100, 100, "", { font: "40px Courier", fill: "#00ff00" })
  //   .setScrollFactor(0, 0);
  // enemyCount = this.add
  //   .text(100, 130, "", { font: "40px Courier", fill: "#00ff00" })
  //   .setScrollFactor(0, 0);
  graphic = this.add.graphics({ lineStyle: { color: 0x00ffff } });

  this.physics.add.collider(goblinGroupBody, goblinGroupBody);
}

//* UPDATE FUNCTION SECTION --------------------------------------------------------
function update() {
  var pointer = this.input.activePointer;

  // r1.x = player1.player.x;
  // r1.y = player1.player.y;

  // r2.x = player1.player.x;
  // r2.y = player1.player.y;

  var tileLevel = map1.levelChecker.getTileAtWorldXY(
    player1.player.x,
    player1.player.y
  );
  //------------------------------------------------------------------------------------
  //Movimenti giocatore
  player1.player.tint = 0xffffff;
  player1.player.body.setVelocity(0);

  map1.trapsDamage();

  // map1.walls.tint = 0xffff00;

  player1.movement(40);

  if (player1.player.scaleX == -1) {
    player1.player.setOffset(70, 40);
  } else {
    player1.player.setOffset(35, 40);
  }
  player1.player.body.velocity.normalize().scale(player1.velocityPlayer);

  if (tileLevel) player1.changeLevel(tileLevel);

  let eCt = 0;

  for (let goblinEnemy of goblinGroupEntity) {
    if (goblinEnemy.alive) {
      if (
        this.cameras.main.worldView.contains(
          goblinEnemy.goblin.x,
          goblinEnemy.goblin.y
        )
      ) {
        goblinEnemy.goblin.setActive(true);
        goblinEnemy.goblin.setVisible(true);
        // goblinEnemy.goblin.tint = 0x00ffff;

        if (
          Phaser.Math.Distance.BetweenPoints(
            player1.player,
            goblinEnemy.goblin
          ) < 240
        ) {
          eCt += 1;
          goblinEnemy.goblinChasePlayer(player1.player);
          if (
            Phaser.Math.Distance.BetweenPoints(
              player1.player,
              goblinEnemy.goblin
            ) < 120
          ) {
            player1.attackDamageSystem(goblinEnemy);
          }
        } else if (goblinEnemy.goblin.getHealth() > 0) {
          goblinEnemy.goblin.body.setVelocity(0);
          goblinEnemy.goblin.anims.play("goblin-idle");
        }
      } else {
        goblinEnemy.goblin.setActive(false);
        goblinEnemy.goblin.setVisible(false);
        // goblinEnemy.goblin.tint = 0xffffff;
      }
    }
  }

  player1.healthBarUpdate();

  var touching = !player1.player.body.touching.none;
  var wasTouching = !player1.player.body.wasTouching.none;

  if (touching && !wasTouching) player1.player.emit("overlapstart");
  player1.swordSlash.tint = 0xffffff;

  // text
  //   .setText(
  //     // "Speed: " +
  //     //   player1.player.body.speed +
  //     " Life: " + player1.player.getHealth()
  //   )
  //   .setDepth(1);
  // enemyCount.setText("Enemy: " + eCt).setDepth(1);

  this.physics.collide(player1.player, map1.background);
  this.physics.collide(player1.player, map1.walls);
}
