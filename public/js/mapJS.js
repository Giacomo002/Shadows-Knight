class MapObj {
  constructor(game, sounds) {
    this.game = game;

    this.map;
    this.player;

    this.sounds = sounds;

    this.tileset1;
    this.tileset2;
    this.tileset3;
    this.tileset4;
    this.tileset5;

    this.background;
    this.checkForPlayer;

    this.ground;
    this.stairs;
    this.walls;
    this.trappoleTerreno;
    this.openLevel1;
    this.openLevel2;
    this.porteLevel1;
    this.porteLevel2;
    this.decorazioniTerreno;
    this.decorazioniMuro;
    this.decorazioniMuro;
    this.structures;
    this.upperWalls;
    this.upperWalls2;

    this.mapInitialize = () => {
      this.map = this.game.make.tilemap({ key: "map" });

      this.tileset1 = this.map.addTilesetImage("fullTilemap", "tiles");
      this.tileset2 = this.map.addTilesetImage(
        "fullSpritesheet",
        "tilesSecond"
      );
      this.tileset3 = this.map.addTilesetImage(
        "background2",
        "tiles-background"
      );
      this.tileset4 = this.map.addTilesetImage(
        "background",
        "tiles-background1"
      );

      this.background = this.map.createLayer("background", this.tileset3);

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
      this.openLevel1 = this.map.createLayer("openLevel1", this.tileset2, 0, 0);
      this.openLevel2 = this.map.createLayer("openLevel2", this.tileset2, 0, 0);
      this.porteLevel1 = this.map.createLayer(
        "porteLevel1",
        this.tileset2,
        0,
        0
      );
      this.porteLevel2 = this.map.createLayer(
        "porteLevel2",
        this.tileset2,
        0,
        0
      );

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
      this.porteLevel1.setCollisionByProperty({ collides: true });
      this.porteLevel2.setCollisionByProperty({ collides: true });
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
        if (
          tileTrappole.index == 125 ||
          tileTrappole.index == 126 ||
          tileTrappole.index == 127 ||
          tileTrappole.index == 128
        ) {
          this.player.player.tint = 0xff3f00;
          setTimeout(() => {
            this.player.player.tint = 0xffffff;
          }, 160);
          this.sounds.playHit();
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
        if (
          tileMuro.index == 305 ||
          tileMuro.index == 304 ||
          tileMuro.index == 295 ||
          tileMuro.index == 296 ||
          tileMuro.index == 306 ||
          tileMuro.index == 297
        ) {
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

          tile.tint = 0xffffff;
        }
      );
    };
  }
}

export { MapObj };
