class RayCastPlayer {
  constructor(
    game,
    player,
    collisionLayer,
    goblinsBodyArray,
    slimeBodyArray,
    flyEyeArray
  ) {
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

    this.rayInitialize = () => {
      this.ray = this.raycaster.createRay({
        origin: {
          x: this.player.x,
          y: this.player.y,
        },
        detectionRange: 300,
      });

      this.raycaster.mapGameObjects(this.collisionMapLayer, false, {
        collisionTiles: [326],
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
    };

    //draw rays intersections
    this.draw = () => {
      var checkSprite = false;

      //draw rays
      for (let intersection of this.intersections) {
        if (intersection.object != null && intersection.object.body != null) {
          checkSprite = true;
        }
      }
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
