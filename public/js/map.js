class mapObj {
  constructor(game, player) {
    this.game = game;

    this.map;
    this.player = player;

    this.tileset1;
    this.tileset2;
    this.tileset3;
    this.tileset4;
    this.tileset5;
    this.tileset6;

    this.background;
    this.checkForPlayer;
    this.levelChecker;
    this.ground;
    this.stairs;
    this.walls;
    this.trappoleTerreno;
    this.porteChiuse;
    this.decorazioniTerreno;
    this.decorazioniMuro;
    this.decorazioniMuro;
    this.structures;
    this.upperWalls;
    this.upperWalls2;

    this.mapInitialize = () => {
      this.map = this.game.make.tilemap({ key: "map" });

      this.tileset1 = this.map.addTilesetImage("fullTilemap", "tiles");
      this.tileset2 = this.map.addTilesetImage("fullSpritesheet", "tilesSecond");
      this.tileset3 = this.map.addTilesetImage("background2", "tiles-background");
      this.tileset4 = this.map.addTilesetImage("background", "tiles-background1");
      this.tileset5 = this.map.addTilesetImage(
        "attackPlayerTiles",
        "attackPlayerTiles"
      );
      this.tileset6 = this.map.addTilesetImage("levelportal", "levelportal");

      this.background = this.map.createLayer("background", this.tileset3);
      // this.checkForPlayer = this.map.createLayer("CheckForPlayer", this.tileset5);
      this.levelChecker = this.map.createLayer("levelChecker", this.tileset5);
      this.ground = this.map.createLayer("ground", [
        this.tileset1,
        this.tileset4,
      ]);
      this.stairs = this.map.createLayer("stairs", this.tileset1);
      this.walls = this.map.createLayer("walls", this.tileset1);
      this.trappoleTerreno = this.map.createDynamicLayer(
        "trappoleTerreno",
        this.tileset2
      );
      this.porteChiuse = this.map.createLayer("porteChiuse", this.tileset2, 0, 0);

      this.decorazioniTerreno = this.map.createLayer(
        "decorazioniTerreno",
        this.tileset1
      );
      this.decorazioniMuro = this.map.createDynamicLayer("decorazioniMuro", [
        this.tileset1,
        this.tileset2,
      ]);

      this.structures = this.map.createLayer("structures", this.tileset1);
      this.upperWalls = this.map.createLayer("upperWalls", this.tileset1);
      this.upperWalls2 = this.map.createLayer("upperWalls2", this.tileset1);

      this.upperWalls.setDepth(1);
      this.upperWalls.setDepth(1);
      this.upperWalls2.setDepth(1);
      this.background.setDepth(1);
      this.structures.setDepth(1);

      this.background.setCollisionByProperty({ collides: true });
      this.porteChiuse.setCollisionByProperty({ collides: true });
      this.decorazioniTerreno.setCollisionByProperty({ collides: true });
      this.walls.setCollisionByProperty({ collides: true });
    };

    this.getPlayer = (player) => {
      this.player = player;
    };

    this.viewSetToNoVisible = (layer, bounds) => {
      for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
        for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
          if (y < 0 || y >= this.map.height || x < 0 || x >= this.map.width) {
            continue;
          }

          const tile = layer.getTileAt(x, y);
          if (!tile) {
            continue;
          }

          //    tile.alpha = 1;
          tile.tint = 0x404040;
        }
      }
    };

    this.trapsDamage = () => {

      var tileTrappole = this.trappoleTerreno.getTileAtWorldXY(
        this.player.player.x,
        this.player.player.y
      );

      if (tileTrappole) {
        if (tileTrappole.index == 125 ||
          tileTrappole.index == 126 ||
          tileTrappole.index == 127 ||
          tileTrappole.index == 128) {
          
          this.player.player.tint = 0xff3f00;
          this.player.player.damage(0.5);
          
        }
      }
    };

    this.dynamicWallHitbox = () => {

      var tileMuro = this.walls.getTileAtWorldXY(
        this.player.player.x,
        this.player.player.y
      );

      if (tileMuro) {
        if (tileMuro.index == 305 ||
          tileMuro.index == 304 ||
          tileMuro.index == 295 ||
          tileMuro.index == 296 ||
          tileMuro.index == 306 ||
          tileMuro.index == 297) {
          this.player.player.setSize(40, 96);
          this.player.player.setOffset(35, 0);
          this.player.movement(0);
          if (this.player.player.scaleX == -1) {
            this.player.player.setOffset(70, 0);
          } else {
            this.player.player.setOffset(35, 0);
          }
        }
      } else {
        this.player.movement(25);
        this.player.player.setSize(40, 65);
        if (this.player.player.scaleX == -1) {
          this.player.player.setOffset(70, 25);
        } else {
          this.player.player.setOffset(35, 25);
        }
      }
    };

    this.viewSetToVisible = (fov, layer, px, py) => {
      fov.compute(
        px,
        py,
        7,
        (x, y) => {
          const tile = layer.getTileAt(x, y);
          if (!tile) {
            return false;
          }
          return tile.tint === 0xffffff;
        },
        (x, y) => {
          const tile = layer.getTileAt(x, y);
          if (!tile) {
            return;
          }
          // const d = Phaser.Math.Distance.Between(py, px, y, x);
          // const alpha = Math.min(2 - d / 6, 1);
          tile.tint = 0xffffff;
          // tile.alpha = alpha;
        }
      );
    };
  }
}

export { mapObj };

// map1.background.getTileAt(x, y);
// map1.checkForPlayer.getTileAt(x, y);
// map1.levelChecker.getTileAt(x, y);
// map1.stairs.getTileAt(x, y);
// map1.walls.getTileAt(x, y);
// map1.trappoleTerreno.getTileAt(x, y);
// map1.porteChiuse.getTileAt(x, y);
// map1.decorazioniTerreno.getTileAt(x, y);
// map1.decorazioniMuro.getTileAt(x, y);

// map1.structures.getTileAt(x, y);
// map1.upperWalls.getTileAt(x, y);
// map1.upperWalls2.getTileAt(x, y);
