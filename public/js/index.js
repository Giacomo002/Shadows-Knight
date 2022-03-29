import { PlayerObj } from "./PlayerJS.js";
import { GoblinObj } from "./GoblinJS.js";
import { FlyEyeObj } from "./FlyEyeJS.js";
import { SlimeObj } from "./SlimeJS.js";
import { MapObj } from "./mapJS.js";
import { SoundsObj } from "./musicJS.js";
import { ItemsObj } from "./itemsJs.js";
import { RayCastPlayer } from "./rayCasterFunctions.js";
import {} from "./plugin/phaser-raycaster.js";

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

let goblinGroupEntity = [];
let goblinGroupBody = [];

let flyEyeGroupEntity = [];
let flyEyeGroupBody = [];

let slimeGroupEntity = [];
let slimeGroupBody = [];

let tempGoblin;
let tempFlyEye;
let tempSlime;
let tempKey;

let arrayGoblins;
let arrayFlyEys;
let arraySlime;
let arrayKeysPos;

let sounds;

let game = new Phaser.Game(config);

//* PRELOAD FUNCTION SECTION --------------------------------------------------------
function preload() {
  // PLUGINS
  this.load.scenePlugin(
    "AnimatedTiles",
    "https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js",
    "animatedTiles",
    "animatedTiles"
  );

  //MAP AND TILESET
  this.load.tilemapTiledJSON("map", "asset/mappe/mappaGioco.json");
  this.load.image("tiles", "asset/tiles/fullTilemap.png");
  this.load.image("tilesSecond", "asset/tiles/fullSpritesheet.png");
  this.load.image("tiles-background", "asset/tiles/background2.png");
  this.load.image("tiles-background1", "asset/tiles/background.png");

  //ENEMY, WEAPONS, PLAYER
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
    "slime-pr",
    "asset/enemies/slime/slimeProjectiles.png",
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );
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

  //PROPS
  this.load.image("key", "asset/props_itens/key_silver.png");

  //UI
  this.load.image("invisibleMask", "asset/invisibleMask.png");
  this.load.image("mask", "asset/ui/mask.png");
  this.load.image("maskLose", "asset/ui/losePage.png");
  this.load.image("maskStart", "asset/ui/startPage.png");
  this.load.image("healthBarUi", "asset/ui/gameBar.png");
  this.load.image("scrolOpen", "asset/ui/ScrollOpen.png");
  this.load.image("keyDirection", "asset/ui/keyDirection.png");
  this.load.spritesheet("emotes-alert", "asset/ui/bubbleEmotesAlert.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  //AUDIO
  this.load.audio("soundtrack-sound", "sound/soundtrack.mp3");
  this.load.audio("hit-sound", "sound/hit.mp3");
  this.load.audio("projectiles-sound", "sound/projectiles.mp3");
  this.load.audio("sword-sound", "sound/sword.mp3");
  this.load.audio("lose-sound", "sound/lose.mp3");
}

//* CREATE FUNCTION SECTION --------------------------------------------------------
function create() {
  //Inizializzo oggetto suoni
  sounds = new SoundsObj(this);
  sounds.soundInitialize();

  cursors = this.input.keyboard.createCursorKeys();
  this.input.mouse.disableContextMenu();

  //Inizializzo oggetto mappa
  map1 = new MapObj(this, sounds);
  map1.mapInitialize();

  // Imposto il cursore di gioco
  this.input.setDefaultCursor("url(asset/ui/crosshair_180x80.png), pointer");

  //Inizializzo oggetto giocatore
  player1 = new PlayerObj(cursors, this, map1, sounds, game);
  player1.playerInitialize(goblinGroupBody);
  map1.getPlayer(player1);

  //-----------------------------------------
  //ENEMIES GOBLIN
  arrayGoblins = map1.map.objects[4].objects;
  for (let position of arrayGoblins) {
    tempGoblin = new GoblinObj(position, this, map1, player1, sounds);
    tempGoblin.goblinInitialize();
    goblinGroupEntity.push(tempGoblin);
    goblinGroupBody.push(tempGoblin.goblin);
  }
  //-----------------------------------------
  //ENEMIES FlyEye
  arrayFlyEys = map1.map.objects[2].objects;
  for (let position of arrayFlyEys) {
    tempFlyEye = new FlyEyeObj(position, this, map1, player1, sounds);
    tempFlyEye.flyEyeInitialize();
    flyEyeGroupEntity.push(tempFlyEye);
    flyEyeGroupBody.push(tempFlyEye.flyEye);
  }
  //-----------------------------------------
  //ENEMIES Slime
  arraySlime = map1.map.objects[3].objects;
  for (let position of arraySlime) {
    tempSlime = new SlimeObj(position, this, map1, player1, sounds);
    tempSlime.slimeInitialize();
    slimeGroupEntity.push(tempSlime);
    slimeGroupBody.push(tempSlime.slime);
  }
  //-----------------------------------------
  //ITEMS KEYS
  arrayKeysPos = map1.map.objects[6].objects;
  this.keyCounter = 0;
  this.level1 = false;
  this.level2 = false;
  for (let position of arrayKeysPos) {
    tempKey = new ItemsObj(this, map1, player1, position);
    tempKey.itemsKeyInitialize();
  }

  //Definisco raycaster del giocatore e lo inizializzo
  player1.playerRay = new RayCastPlayer(
    this,
    player1,
    map1.background,
    goblinGroupBody,
    slimeGroupBody,
    flyEyeGroupBody
  );
  player1.playerRay.rayInitialize();

  // Evento tasto sinistro parte funzione di attacco del giocatore
  this.input.on(
    "pointerdown",
    function (pointer) {
      if (pointer.leftButtonDown()) {
        if (pointer.getDuration() < 500) {
          
          player1.swordAttack();
          if (player1.maskStart.alpha == 1) {
            player1.maskStart.alpha = 0;
          }
        }
      }
    },
    this
  );

  // Attivo plugin animzione mappa
  this.animatedTiles.init(map1.map);
  // Camera che mantiene l'obbiettivo sul giocatore
  this.cameras.main.startFollow(player1.player);
  // Attivo collisioni tra nemici
  this.physics.add.collider(goblinGroupBody, goblinGroupBody);
  this.physics.add.collider(slimeGroupBody, slimeGroupBody);
  this.physics.add.collider(flyEyeGroupBody, flyEyeGroupBody);

  this.physics.add.collider(goblinGroupBody, slimeGroupBody);
  this.physics.add.collider(goblinGroupBody, flyEyeGroupBody);

  this.physics.add.collider(slimeGroupBody, goblinGroupBody);
  this.physics.add.collider(slimeGroupBody, flyEyeGroupBody);

  this.physics.add.collider(flyEyeGroupBody, goblinGroupBody);
  this.physics.add.collider(flyEyeGroupBody, slimeGroupBody);

  this.level1CollideSlime = this.physics.add.collider(
    slimeGroupBody,
    map1.porteLevel1
  );
  this.level2CollideSlime = this.physics.add.collider(
    slimeGroupBody,
    map1.porteLevel2
  );
   this.level1CollideFlyEye = this.physics.add.collider(
     flyEyeGroupBody,
     map1.porteLevel1
   );
   this.level2CollideFlyEye = this.physics.add.collider(
     flyEyeGroupBody,
     map1.porteLevel2
   );
   this.level1CollideGoblin = this.physics.add.collider(
     goblinGroupBody,
     map1.porteLevel1
   );
   this.level2CollideGoblin = this.physics.add.collider(
     goblinGroupBody,
     map1.porteLevel2
   );
}

//* UPDATE FUNCTION SECTION --------------------------------------------------------
function update() {
  //  Aggiorno posizione area circolare per volo nemici
  player1.flyEyeArea.x = player1.player.x;
  player1.flyEyeArea.y = player1.player.y;

  player1.player.body.setVelocity(0);
  // Danno giocatore sulle trappole
  map1.trapsDamage();
  //Movimenti giocatore
  player1.movement(40);
  if (player1.player.scaleX == -1) {
    player1.player.setOffset(70, 40);
  } else {
    player1.player.setOffset(35, 40);
  }
  player1.player.body.velocity.normalize().scale(player1.velocityPlayer);

  // * ENEMIES CYCLE ON UPDATE
  if (player1.playerRay.updateRays()) {
    //! GLOBIN----------CHASE
    for (let goblinEnemy of goblinGroupEntity) {
      goblinEnemy.goblin.tint = 0xffffff;
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
          if (!goblinEnemy.isAttaccking) {
            player1.bubbleEmotes(goblinEnemy.goblin);
          }
          goblinEnemy.isAttaccking = true;
          goblinEnemy.goblinChasePlayer(player1.player, 30);
          if (
            Phaser.Math.Distance.BetweenPoints(
              player1.player,
              goblinEnemy.goblin
            ) < player1.swordAttackRange
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
        goblinEnemy.isAttaccking = false;
        goblinEnemy.goblin.body.setVelocity(0);
        goblinEnemy.goblin.anims.play("goblin-idle", true);
      }
    }
    //! FLYEYE----------CHASE
    for (let flyEyeEnemy of flyEyeGroupEntity) {
      flyEyeEnemy.flyEye.tint = 0xffffff;
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
        flyEyeEnemy.timerFlyEyeChangePos.paused = true;
      }
      if (
        Phaser.Math.Distance.BetweenPoints(player1.player, flyEyeEnemy.flyEye) <
        flyEyeEnemy.rangeChasePlayer
      ) {
        if (
          Phaser.Math.Distance.BetweenPoints(
            player1.player,
            flyEyeEnemy.flyEye
          ) < flyEyeEnemy.radiusPath
        ) {
          if (flyEyeEnemy.setNewDefault) {
            flyEyeEnemy.flyEyeChangePosition();
            flyEyeEnemy.setNewDefault = false;
          }
          if (flyEyeEnemy.flyEye.alpha > 0) {
            flyEyeEnemy.timerFlyEyeChangePos.paused = false;
          } else {
            flyEyeEnemy.timerFlyEyeChangePos.paused = true;
          }
          flyEyeEnemy.moveSpriteOnCircle();

          if (
            Phaser.Math.Distance.BetweenPoints(
              player1.player,
              flyEyeEnemy.flyEye
            ) < player1.swordAttackRange
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
          flyEyeEnemy.setNewDefault = true;
          flyEyeEnemy.timerFlyEyeChangePos.paused = true;
          flyEyeEnemy.flyEyeChasePlayer(player1.player, 0);
        }

        flyEyeEnemy.trapsDamage();
      } else if (flyEyeEnemy.flyEye.getHealth() > 0) {
        flyEyeEnemy.flyEye.body.setVelocity(0);
        flyEyeEnemy.flyEye.anims.play("flyEye-idleR", true);
      }
    }
    //! SLIME----------CHASE
    for (let slimeEnemy of slimeGroupEntity) {
      slimeEnemy.slime.tint = 0xffffff;
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
        slimeEnemy.canIfire = false;
      }

      if (
        Phaser.Math.Distance.BetweenPoints(player1.player, slimeEnemy.slime) <
        350
      ) {
        if (slimeEnemy.alive) {
          slimeEnemy.canIfire = true;
        }

        if (
          Phaser.Math.Distance.BetweenPoints(player1.player, slimeEnemy.slime) <
          200
        ) {
          if (!slimeEnemy.isAttaccking) {
            player1.bubbleEmotes(slimeEnemy.slime);
          }
          slimeEnemy.isAttaccking = true;
          slimeEnemy.slimeChasePlayer(player1.player, 30);
          if (
            Phaser.Math.Distance.BetweenPoints(
              player1.player,
              slimeEnemy.slime
            ) < player1.swordAttackRange
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
        slimeEnemy.isAttaccking = false;
        slimeEnemy.slime.body.setVelocity(0);
        slimeEnemy.slime.anims.play("slime-idle", true);
        slimeEnemy.canIfire = false;
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
        flyEyeEnemy.timerFlyEyeChangePos.paused = true;
      }
    }
    //! SLIME----------RENDER
    for (let slimeEnemy of slimeGroupEntity) {
      slimeEnemy.canIfire = false;
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

  // Aggiorno UI giocatore
  player1.healthBarUpdate();


  // Aggiorno collisioni giocatore
  this.physics.collide(player1.player, map1.background);
  this.physics.collide(player1.player, map1.walls);
}

