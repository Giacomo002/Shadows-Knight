import { PlayerObj } from "./PlayerJS.js";
import { GoblinObj } from "./GoblinJS.js";
import { FlyEyeObj } from "./FlyEyeJS.js";
import { SlimeObj } from "./SlimeJS.js";
import { MapObj } from "./map.js";
import { RayCastPlayer } from "./rayCasterFunctions.js";
import {} from "./phaser-raycaster.js";

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
let map1;
let imgcursor;
let graphic;

let goblinGroupEntity = [];
let goblinGroupBody = [];

let flyEyeGroupEntity = [];
let flyEyeGroupBody = [];

let slimeGroupEntity = [];
let slimeGroupBody = [];

let tempGoblin;
let tempFlyEye;
let tempSlime;

let arrayGoblins;
let arrayFlyEys;
let arraySlime;

let enemyCount;
let text;
let r1;
let r2;
let r3;

let game = new Phaser.Game(config);

//* PRELOAD FUNCTION SECTION --------------------------------------------------------
function preload() {
  this.load.scenePlugin(
    "AnimatedTiles",
    "https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js",
    "animatedTiles",
    "animatedTiles"
  );

  this.load.plugin(
    "rexrandomplaceplugin",
    "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexrandomplaceplugin.min.js",
    true
  );

  this.load.tilemapTiledJSON("map", "asset/mappe/mappaGioco.json");
  this.load.image("tiles", "asset/tiles/fullTilemap.png");
  this.load.image("tilesSecond", "asset/tiles/fullSpritesheet.png");
  this.load.image("tiles-background", "asset/tiles/background2.png");
  this.load.image("tiles-background1", "asset/tiles/background.png");
  this.load.image("attackPlayerTiles", "asset/tiles/attackPlayerTiles.png");
  this.load.image("levelportal", "asset/tiles/levelportal.png");
  this.load.image("sword-knight", "asset/heroes/knight/weapon_sword_11.png");
  this.load.image("sword-goblin", "asset/enemies/goblin/goblin_knife.png");
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
  this.load.spritesheet("slime-rR", "asset/enemies/slime/slimeRunR.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
  this.load.spritesheet("slime-rL", "asset/enemies/slime/slimeRunL.png", {
    frameWidth: 96,
    frameHeight: 96,
  });

  this.load.spritesheet(
    "flyEye-iL",
    "asset/enemies/flying creature/flyAnimL.png",
    {
      frameWidth: 96,
      frameHeight: 96,
    }
  );
  this.load.spritesheet(
    "flyEye-iR",
    "asset/enemies/flying creature/flyAnimR.png",
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
  this.load.image("arrowTest", "asset/effects/longarrow.png");
}

//* CREATE FUNCTION SECTION --------------------------------------------------------
function create() {
  cursors = this.input.keyboard.createCursorKeys();
  this.input.mouse.disableContextMenu();

  map1 = new MapObj(this);

  map1.mapInitialize();

  imgcursor = this.input.setDefaultCursor(
    "url(asset/ui/crosshair_180x80.png), pointer"
  );

  player1 = new PlayerObj(cursors, this, map1);

  player1.playerInitialize(goblinGroupBody);

  map1.getPlayer(player1);

  console.log(map1.map);

  arrayGoblins = map1.map.objects[5].objects;

  //-----------------------------------------
  //ENEMIES GOBLIN
  for (let position of arrayGoblins) {
    tempGoblin = new GoblinObj(position, this, map1, player1);
    tempGoblin.goblinInitialize();
    goblinGroupEntity.push(tempGoblin);
    goblinGroupBody.push(tempGoblin.goblin);
  }

  arrayFlyEys = map1.map.objects[3].objects;

  //-----------------------------------------
  //ENEMIES FlyEye
  for (let position of arrayFlyEys) {
    tempFlyEye = new FlyEyeObj(position, this, map1, player1);
    tempFlyEye.flyEyeInitialize();
    flyEyeGroupEntity.push(tempFlyEye);
    flyEyeGroupBody.push(tempFlyEye.flyEye);
  }

  arraySlime = map1.map.objects[4].objects;

  //-----------------------------------------
  //ENEMIES Slime
  for (let position of arraySlime) {
    tempSlime = new SlimeObj(position, this, map1, player1);
    tempSlime.slimeInitialize();
    slimeGroupEntity.push(tempSlime);
    slimeGroupBody.push(tempSlime.slime);
  }

  //Define ray vision player
  player1.playerRay = new RayCastPlayer(
    this,
    player1,
    map1.background,
    goblinGroupBody,
    slimeGroupBody,
    flyEyeGroupBody
  );

  player1.playerRay.rayInitialize();

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

  r1 = this.add.circle(600, 200, 300);

  r1.setStrokeStyle(2, 0x00ff00).setDepth(1);

  r1.x = player1.player.x;
  r1.y = player1.player.y;

  r2 = this.add.circle(600, 200, 102);

  r2.setStrokeStyle(2, 0xff3f00).setDepth(1);

  r2.x = player1.player.x;
  r2.y = player1.player.y;

  r3 = this.add.circle(600, 200, 250);

  r3.setStrokeStyle(2, 0x00ffff).setDepth(1);

  // r3.setDepth(1);

  r3.x = player1.player.x;
  r3.y = player1.player.y;

  this.animatedTiles.init(map1.map);

  this.cameras.main.startFollow(player1.player);

  text = this.add
    .text(100, 100, "", { font: "40px Courier", fill: "#00ff00" })
    .setScrollFactor(0, 0);
  enemyCount = this.add
    .text(100, 130, "", { font: "40px Courier", fill: "#00ff00" })
    .setScrollFactor(0, 0);
  graphic = this.add.graphics({ lineStyle: { color: 0x00ffff } });

  this.physics.add.collider(goblinGroupBody, goblinGroupBody);
}

//* UPDATE FUNCTION SECTION --------------------------------------------------------
function update() {
  var pointer = this.input.activePointer;

  r1.x = player1.player.x;
  r1.y = player1.player.y;

  r2.x = player1.player.x;
  r2.y = player1.player.y;

  r3.x = player1.player.x;
  r3.y = player1.player.y;

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

  // * ENEMIES CYCLE ON UPDATE
  if (player1.playerRay.updateRays()) {
    //! GLOBIN----------CHASE
    for (let goblinEnemy of goblinGroupEntity) {
      goblinEnemy.goblin.tint = 0xffffff;
      if (goblinEnemy.alive) {
        goblinEnemy.goblin.setActive(true);
        goblinEnemy.goblin.setVisible(true);
      }
      // goblinEnemy.goblin.tint = 0x00ffff;
      if (
        Phaser.Math.Distance.BetweenPoints(player1.player, goblinEnemy.goblin) <
        300
      ) {
        if (
          Phaser.Math.Distance.BetweenPoints(
            player1.player,
            goblinEnemy.goblin
          ) < 200
        ) {
          goblinEnemy.goblinChasePlayer(player1.player, 30);
          if (
            Phaser.Math.Distance.BetweenPoints(
              player1.player,
              goblinEnemy.goblin
            ) < 102
          ) {
            if (goblinEnemy.alive) {
              player1.attackDamageSystem(goblinEnemy);
            }

            if (
              Phaser.Math.Distance.BetweenPoints(
                player1.player,
                goblinEnemy.goblin
              ) < 70 &&
              goblinEnemy.alive
            ) {
              player1.playerGetdamaged = true;
            } else {
              player1.playerGetdamaged = false;
            }
          }
        } else {
          goblinEnemy.goblinChasePlayer(player1.player, 0);
        }

        goblinEnemy.trapsDamage();
      } else if (goblinEnemy.alive) {
        goblinEnemy.goblin.body.setVelocity(0);
        goblinEnemy.goblin.anims.play("goblin-idle", true);
        // player1.timerGetdamged.paused = true;
      }
    }
    //! FLYEYE----------CHASE
    for (let flyEyeEnemy of flyEyeGroupEntity) {
      flyEyeEnemy.flyEye.tint = 0xffffff;
      if (flyEyeEnemy.alive) {
        flyEyeEnemy.flyEye.setActive(true);
        flyEyeEnemy.flyEye.setVisible(true);
        // goblinEnemy.goblin.tint = 0x00ffff;
      }
      if (
        Phaser.Math.Distance.BetweenPoints(player1.player, flyEyeEnemy.flyEye) <
        300
      ) {
        if (
          Phaser.Math.Distance.BetweenPoints(
            player1.player,
            flyEyeEnemy.flyEye
          ) < 200
        ) {
          // flyEyeEnemy.moveSpriteOnCircle();
          if (
            Phaser.Math.Distance.BetweenPoints(
              player1.player,
              flyEyeEnemy.flyEye
            ) < 102
          ) {
            if (flyEyeEnemy.alive) {
              player1.attackDamageSystem(flyEyeEnemy);
            }

            if (
              Phaser.Math.Distance.BetweenPoints(
                player1.player,
                flyEyeEnemy.flyEye
              ) < 70 &&
              flyEyeEnemy.alive
            ) {
              player1.playerGetdamaged = true;
            } else {
              player1.playerGetdamaged = false;
            }
          }
        } else {
          flyEyeEnemy.flyEyeChasePlayer(player1.player, 0);
        }

        flyEyeEnemy.trapsDamage();
      } else if (flyEyeEnemy.flyEye.getHealth() > 0) {
        flyEyeEnemy.flyEye.body.setVelocity(0);
        flyEyeEnemy.flyEye.anims.play("flyEye-idleR", true);
        // player1.timerGetdamged.paused = true;
      }
    }
    //! SLIME----------CHASE
    for (let slimeEnemy of slimeGroupEntity) {
      slimeEnemy.slime.tint = 0xffffff;
      if (slimeEnemy.alive) {
        slimeEnemy.slime.setActive(true);
        slimeEnemy.slime.setVisible(true);
      }
      // goblinEnemy.goblin.tint = 0x00ffff;

      if (
        Phaser.Math.Distance.BetweenPoints(player1.player, slimeEnemy.slime) <
        300
      ) {
        if (
          Phaser.Math.Distance.BetweenPoints(player1.player, slimeEnemy.slime) <
          200
        ) {
          slimeEnemy.slimeChasePlayer(player1.player, 30);
          if (
            Phaser.Math.Distance.BetweenPoints(
              player1.player,
              slimeEnemy.slime
            ) < 102
          ) {
            if (slimeEnemy.alive) {
              player1.attackDamageSystem(slimeEnemy);
            }

            if (
              Phaser.Math.Distance.BetweenPoints(
                player1.player,
                slimeEnemy.slime
              ) < 70 &&
              slimeEnemy.alive
            ) {
              player1.playerGetdamaged = true;
            } else {
              player1.playerGetdamaged = false;
            }
          }
        } else {
          slimeEnemy.slimeChasePlayer(player1.player, 0);
        }

        slimeEnemy.trapsDamage();
      } else if (slimeEnemy.slime.getHealth() > 0) {
        slimeEnemy.slime.body.setVelocity(0);
        slimeEnemy.slime.anims.play("slime-idle", true);
        // player1.timerGetdamged.paused = true;
      }
    }
  } else {
    //! GLOBIN ----------RENDER
    for (let goblinEnemy of goblinGroupEntity) {
      if (
        this.cameras.main.worldView.contains(
          goblinEnemy.goblin.x,
          goblinEnemy.goblin.y
        )
      ) {
        if (goblinEnemy.alive) {
          goblinEnemy.goblin.setActive(true);
          goblinEnemy.goblin.setVisible(true);
        }
      } else {
        goblinEnemy.goblin.setActive(false);
        goblinEnemy.goblin.setVisible(false);
      }
    }
    //! FLYEYE----------RENDER
    for (let flyEyeEnemy of flyEyeGroupEntity) {
      if (
        this.cameras.main.worldView.contains(
          flyEyeEnemy.flyEye.x,
          flyEyeEnemy.flyEye.y
        )
      ) {
        if (flyEyeEnemy.alive) {
          flyEyeEnemy.flyEye.setActive(true);
          flyEyeEnemy.flyEye.setVisible(true);
        }
      } else {
        flyEyeEnemy.flyEye.setActive(false);
        flyEyeEnemy.flyEye.setVisible(false);
      }
    }
    //! SLIME----------RENDER
    for (let slimeEnemy of slimeGroupEntity) {
      if (
        this.cameras.main.worldView.contains(
          slimeEnemy.slime.x,
          slimeEnemy.slime.y
        )
      ) {
        if (slimeEnemy.alive) {
          slimeEnemy.slime.setActive(true);
          slimeEnemy.slime.setVisible(true);
        }
      } else {
        slimeEnemy.slime.setActive(false);
        slimeEnemy.slime.setVisible(false);
      }
    }
  }

  player1.healthBarUpdate();

  var touching = !player1.player.body.touching.none;
  var wasTouching = !player1.player.body.wasTouching.none;

  if (touching && !wasTouching) player1.player.emit("overlapstart");
  player1.swordSlash.tint = 0xffffff;

  text
    .setText(
      // "Speed: " +
      //   player1.player.body.speed +
      " Life: " + player1.player.getHealth()
    )
    .setDepth(1);
  enemyCount
    .setText(
      "timer: " +
        player1.timerGetdamged.getProgress().toString().substr(0, 4) +
        " Damaged: " +
        player1.playerGetdamaged
    )
    .setDepth(1);

  this.physics.collide(player1.player, map1.background);
  this.physics.collide(player1.player, map1.walls);
}
