var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#7AB8FF",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
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
};

var cursors;
var player;
var velocityPlayer = 300;
var raycaster;
var ray;
var graphics;
var obstacles;
var intersections;
var toggleBtn;
var dynamicMapping = true;

var game = new Phaser.Game(config);

function preload() {
  this.load.spritesheet("knight", "assets/images/player/playerRun.png", {
    frameWidth: 96,
    frameHeight: 96,
  });
}

function create() {
  cursors = this.input.keyboard.createCursorKeys();

  player = this.physics.add.sprite(
    window.innerWidth / 2,
    window.innerHeight / 2,
    "knight"
  );
  
  //-----------------------------------------------------------------------------------------------------------------------

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

  //map obstacles with dynamic updating
  raycaster.mapGameObjects(obstacles.getChildren(), true);

  //cast ray in all directions
  intersections = ray.castCircle();

  //draw rays
  graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 }, fillStyle: { color: 0xffffff, alpha: 0.3 } });
  draw();

  ray.setOrigin(player.x, player.y);

  //add toggle button
  toggleBtn = this.add.text(10, 10, 'Dynamic mapping: on', { fontSize: '20px', fill: '#fff', align: 'center' });
  toggleBtn.setInteractive({ useHandCursor: true });
  toggleBtn.on('pointerover', function () { toggleBtn.setStyle({ fill: '#f00' }); });
  toggleBtn.on('pointerout', function () { toggleBtn.setStyle({ fill: '#fff' }); });
  toggleBtn.on('pointerup', function () {
    toggleMapping();
  }, this);
//-----------------------------------------------------------------------------------------------------------------------


  player.setCollideWorldBounds(true);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("knight", { start: 0, end: 1 }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("knight", { start: 6, end: 7 }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
    key: "up",
    frames: this.anims.generateFrameNumbers("knight", { start: 4, end: 5 }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
    key: "down",
    frames: this.anims.generateFrameNumbers("knight", { start: 2, end: 3 }),
    frameRate: 4,
    repeat: -1,
  });
  this.anims.create({
    key: "idle",
    frames: [{ key: "knight", frame: 8 }],
    frameRate: 4,
  });

  
}

function update() {

  //animate obstacles
  for (let obstacle of obstacles.getChildren()) {
    obstacle.rotation += 0.01
  }
  //cast ray in all directions
  intersections = ray.castCircle();
  //redraw
  draw();
 
  ray.setOrigin(player.x, player.y);
//------------------------------------------------------------------------------------
  //Movimenti giocatore
  player.setVelocity(0);
 
  if (cursors.left.isDown && cursors.up.isDown) {
      player.setVelocityX(-velocityPlayer);
      player.setVelocityY(-velocityPlayer);
    player.anims.play("up", true);
  } else if (cursors.right.isDown && cursors.up.isDown) {
      player.setVelocityX(velocityPlayer);
      player.setVelocityY(-velocityPlayer);
    player.anims.play("up", true);
  } else if (cursors.left.isDown && cursors.down.isDown) {
      player.setVelocityX(-velocityPlayer);
      player.setVelocityY(velocityPlayer);
    player.anims.play("down", true);
  } else if (cursors.right.isDown && cursors.down.isDown) {
      player.setVelocityX(velocityPlayer);
      player.setVelocityY(velocityPlayer);
    player.anims.play("down", true);
  } else if (cursors.left.isDown) {
      player.setVelocityX(-velocityPlayer);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
      player.setVelocityX(velocityPlayer);
    player.anims.play("right", true);
  } else if (cursors.up.isDown) {
      player.setVelocityY(-velocityPlayer);
    player.anims.play("up", true);
  } else if (cursors.down.isDown) {
      player.setVelocityY(velocityPlayer);
    player.anims.play("down", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("idle");
  }
}

//create obstacles
function createObstacles(scene) {
  //create rectangle obstacle
  let obstacle = scene.add.rectangle(100, 100, 75, 75)
    .setStrokeStyle(1, 0xff0000);
  obstacles.add(obstacle, true);

  //create line obstacle
  obstacle = scene.add.line(400, 100, 0, 0, 200, 50)
    .setStrokeStyle(1, 0xff0000);
  obstacles.add(obstacle);

  //create circle obstacle
  obstacle = scene.add.circle(650, 100, 50)
    .setOrigin(1, 0.5)
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
}

//draw rays intersections
function draw() {
  graphics.clear();
  graphics.fillStyle(0xffffff, 0.3);
  graphics.fillPoints(intersections);
  for (let intersection of intersections) {
    graphics.strokeLineShape({
      x1: ray.origin.x,
      y1: ray.origin.y,
      x2: intersection.x,
      y2: intersection.y
    });
  }
  graphics.fillStyle(0xff00ff);
  graphics.fillPoint(ray.origin.x, ray.origin.y, 3);
}

//toggle dynamic mapping
function toggleMapping() {
  dynamicMapping = !dynamicMapping;

  if (dynamicMapping)
    toggleBtn.setText('Dynamic mapping: on');
  else
    toggleBtn.setText('Dynamic mapping: off');

  for (let obstacle of obstacles.getChildren()) {
    //get map
    let map = obstacle.data.get('raycasterMap')
    //toggle map update
    map.dynamic = dynamicMapping;
  }
}