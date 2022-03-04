class RayCastPlayer {
  constructor(game, player, collisionLayer, goblinsBodyArray, slimeBodyArray, flyEyeArray) {
    this.game = game;
    this.player = player.player;
    this.raycaster = this.game.raycasterPlugin.createRaycaster();

    this.collisionMapLayer = collisionLayer;
    this.goblinsArray = goblinsBodyArray;
    this.slimeArray = slimeBodyArray;
    this.flyEyeArray = flyEyeArray;

    //Ray variables
    this.ray;
    this.graphics;
    this.maskGraphics;
    this.mask;
    this.fow;
    this.intersections;

    //Create field of view
    this.createFOV = (scene) => {
      this.maskGraphics = scene.add.graphics({
        fillStyle: { color: 0xffffff, alpha: 0 },
      });
      this.mask = new Phaser.Display.Masks.GeometryMask(
        scene,
        this.maskGraphics
      );
      this.mask.setInvertAlpha();
      this.fow = scene.add
        .graphics({ fillStyle: { color: 0x000000, alpha: 0.6 } })
        .setDepth(29);
      this.fow.setMask(this.mask);
      this.fow.fillRect(0, 0, 800, 600);
    };
    this.rayInitialize = () => {
      // Create ray
      this.ray = this.raycaster.createRay({
        origin: {
          x: this.player.x,
          y: this.player.y,
        },
        detectionRange: 300,
      });

      this.raycaster.mapGameObjects(this.collisionMapLayer, false, {
        collisionTiles: [326], //array of tile types which collide with rays
      });

      this.raycaster.mapGameObjects(
        Phaser.Utils.Array.GetAll(this.goblinsArray),
        true
      );
      this.raycaster.mapGameObjects(
        Phaser.Utils.Array.GetAll(this.slimeArray),
        true
      );
      this.raycaster.mapGameObjects(
        Phaser.Utils.Array.GetAll(this.flyEyeArray),
        true
      );

      this.intersections = this.ray.castCircle();

      this.graphics = this.game.add.graphics({
        lineStyle: { width: 1, color: 0x00ff00},
        fillStyle: { color: 0xffffff, alpha: 0.3 },
      });

      //create field of view
      this.createFOV(this.game);

      this.fow.setDepth(1);
      this.graphics.setDepth(3);
      this.graphics.alpha = 0.2;
    };

    //draw rays intersections
    this.draw = () => {
      //clear ray visualisation
      this.graphics.clear();

      //clear field of view mask
      this.maskGraphics.clear();
      //draw fov mask
      this.maskGraphics.fillPoints(this.intersections);
    
      var checkSprite = false;

      //draw rays
      this.graphics.lineStyle(1, 0x00ff00);
      for (let intersection of this.intersections) {
       
        if (intersection.object != null && intersection.object.body != null) {
          // console.log(intersection.object);
          checkSprite = true;
        }
          this.graphics.strokeLineShape({
            x1: this.ray.origin.x,
            y1: this.ray.origin.y,
            x2: intersection.x,
            y2: intersection.y,
          });
      }

      this.graphics.fillStyle(0x00ffff);

      //draw ray origin
      this.graphics.fillPoint(this.ray.origin.x, this.ray.origin.y, 3);

      return checkSprite;
    };

    this.updateRays = () => {
      //Set positiion
      this.ray.setOrigin(this.player.x, this.player.y);
      //Cast ray in all directions
      this.intersections = this.ray.castCircle();
      //Redraw
      return this.draw();
    };
  }
}

export { RayCastPlayer };
