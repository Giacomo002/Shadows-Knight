function drawDebugViewRayCasting(
    graphics,
    obstacles,
    ray2,
    ray,
    player,
    intersections2,
    intersections
) {
    

    //OMBRE
    // graphics.fillStyle(0xffffff, 0.3);
    // graphics.fillPoints(intersections);

    //draw detection ray

    //clear obstacles
    for (let obstacle of obstacles.getChildren()) {
        player.tint = 0xffff00;
    }

    for (let intersection2 of intersections2) {
        //draw detection range radius
        graphics.strokeCircleShape({
            x: ray2.origin.x,
            y: ray2.origin.y,
            radius: ray2.detectionRange,
        });
        graphics.strokeLineShape({
            x1: ray2.origin.x,
            y1: ray2.origin.y,
            x2: intersection2.x,
            y2: intersection2.y,
        });

        // //fill hit object
        if (intersection2.object === player) {
            player.tint = 0x00ff00;
            // this.physics.moveTo(enemies, player.x, player.y, 100);
            console.log("ALERT 2");
        }
        // Draw segment
        if (intersection2.segment) {
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeLineShape(intersection2.segment);
            graphics.lineStyle(2, 0x00ff00);
        }
    }

    for (let intersection of intersections) {
        //draw detection range radius
        graphics.strokeCircleShape({
            x: ray.origin.x,
            y: ray.origin.y,
            radius: ray.detectionRange,
        });
        graphics.strokeLineShape({
            x1: ray.origin.x,
            y1: ray.origin.y,
            x2: intersection.x,
            y2: intersection.y,
        });

        // //fill hit object
        if (intersection.object === player) {
            player.tint = 0xff00ff;
            // this.physics.moveTo(enemies, player.x, player.y, 100);
            console.log("ALERT 1");
        }
        // Draw segment
        if (intersection.segment) {
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeLineShape(intersection.segment);
            graphics.lineStyle(2, 0x00ff00);
        }
    }
}

export { drawDebugViewRayCasting };
