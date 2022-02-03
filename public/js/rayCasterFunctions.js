function rayCasterEnemie(
    game,
    guest,
    shortRange,
    longRange,
    // collisionMapLayer,
    collisionObject,
) {
    this.guest = guest;
    this.originX = guest.x;
    this.originY = guest.y;
    this.shortRange = shortRange;
    this.longRange = longRange;

    this.raycaster = game.raycasterPlugin.createRaycaster();
    // this.collisionMapLayer = collisionMapLayer;
    this.collisionObject = collisionObject;

    this.rayShortRange;
    this.rayLongRange;
    
    this.intersectionsShortRange;
    this.intersectionsLongRange;

    this.initializeRays = function () {

        // this.raycaster.mapGameObjects(this.collisionMapLayer, false, {
        //   collisionTiles: [5, 6, 8, 12, 13], //array of tile types which collide with rays
        // });

        this.raycaster.mapGameObjects(this.collisionObject.getChildren(), true);

        this.rayShortRange = this.raycaster.createRay({
          origin: {
            x: this.originX,
            y: this.originY,
          },
          //set detection range
          detectionRange: this.shortRange,
        });

        this.rayLongRange = this.raycaster.createRay({
          origin: {
            x: this.originX,
            y: this.originY,
          },
          //set detection range
          detectionRange: this.longRange,
        });

        this.intersectionsShortRange = this.rayShortRange.castCircle();
        this.intersectionsLongRange = this.rayLongRange.castCircle();

        this.rayShortRange.setOrigin(this.guest.x, this.guest.y);
        this.rayLongRange.setOrigin(this.guest.x, this.guest.y);
    };
    
    this.updateRays = function () {
        this.rayShortRange.setOrigin(this.guest.x, this.guest.y);
        this.rayLongRange.setOrigin(this.guest.x, this.guest.y);

        this.intersectionsShortRange = this.rayShortRange.castCircle();
        this.intersectionsLongRange = this.rayLongRange.castCircle();
    }
}

export { rayCasterEnemie };
