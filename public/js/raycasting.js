let config = {
    type: Phaser.Auto,
    width: 800,
    height: 600,
    backgroundColor: 'black',
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    loader: {
        baseURL: 'https://labs.phaser.io',
        crossOrigin: 'anonymous'
    },
    //enable Phaser-raycaster plugin
    plugins: {
        scene: [
            {
                key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
            }
        ]
    }
}

new Phaser.Game(config);

var raycaster;
var ray;
var graphics;
var obstacles;

//preload
function preload() {

}

//create
function create() {
    //create raycaster
    raycaster = this.raycasterPlugin.createRaycaster();

    //create ray
    ray = raycaster.createRay({
        origin: {
            x: 400,
            y: 300
        }
    });

    //create obstacles
    obstacles = this.add.group();
    createObstacles(this);

    //map obstacles
    raycaster.mapGameObjects(obstacles.getChildren());

    //cast ray
    let intersection = ray.cast();

    //draw ray
    graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 }, fillStyle: { color: 0xff00ff } });
    let line = new Phaser.Geom.Line(ray.origin.x, ray.origin.y, intersection.x, intersection.y);
    graphics.fillPoint(ray.origin.x, ray.origin.y, 3)
    graphics.strokeLineShape(line);

    //fill hit object
    if (intersection.object) {
        if (intersection.object.type === 'Image')
            intersection.object.setTint(0xff00ff);
        else
            intersection.object.setFillStyle(0xff00ff);
    }

    //draw hit segment
    if (intersection.segment) {
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeLineShape(intersection.segment)
    }
}

//update
function update() {
    //rotate ray
    ray.setAngle(ray.angle + 0.01);
    //cast ray
    let intersection = ray.cast();

    graphics.clear();
    //draw ray
    let line = new Phaser.Geom.Line(ray.origin.x, ray.origin.y, intersection.x, intersection.y);
    graphics.fillPoint(ray.origin.x, ray.origin.y, 3)
    graphics.strokeLineShape(line);

    //clear obstacles
    for (let obstacle of obstacles.getChildren()) {
        if (obstacle.type === 'Image' && obstacle.isTinted)
            obstacle.clearTint();
        else if (obstacle.isFilled)
            obstacle.setFillStyle()
    }

    //fill hit object
    if (intersection.object) {
        if (intersection.object.type === 'Image')
            intersection.object.setTint(0xff00ff);
        else
            intersection.object.setFillStyle(0xff00ff);
    }

    //draw hit segment
    if (intersection.segment) {
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeLineShape(intersection.segment)
    }
}

//create obstacles
function createObstacles(scene) {
    //create rectangle obstacle
    let obstacle = scene.add.rectangle(100, 200, 75, 75)
        .setStrokeStyle(1, 0xff0000);
    obstacles.add(obstacle, true);

    //create line obstacle
    obstacle = scene.add.line(400, 100, 0, 0, 200, 50)
        .setStrokeStyle(1, 0xff0000);
    obstacles.add(obstacle);

    //create circle obstacle
    obstacle = scene.add.circle(650, 100, 50)
        .setStrokeStyle(1, 0xff0000);
    obstacles.add(obstacle);

    //create polygon obstacle
    obstacle = scene.add.polygon(650, 500, [0, 0, 50, 50, 100, 0, 100, 75, 50, 100, 0, 50])
        .setStrokeStyle(1, 0xff0000);
    obstacles.add(obstacle);

    //create overlapping obstacles
    for (let i = 0; i < 5; i++) {
        obstacle = scene.add.rectangle(350 + 30 * i, 550 - 30 * i, 50, 50)
            .setStrokeStyle(1, 0xff0000);
        obstacles.add(obstacle, true);
    }

    //create image obstacle
    obstacle = scene.add.image(100, 500, 'crate');
    obstacles.add(obstacle, true);
}