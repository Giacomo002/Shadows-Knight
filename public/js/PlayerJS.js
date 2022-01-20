function Movement(cursors, player, velocityPlayer, game) {
  if (cursors.left.isDown && cursors.up.isDown) {
    player.setVelocityX(-velocityPlayer);
      player.setVelocityY(-velocityPlayer);
      
    if (player.body.velocity.x < 0) {
      player.scaleX = -1;
    } else {
      player.scaleX = 1;
    }
      player.body.setOffset(96, 0);
      
    player.anims.play("knight-run", true);
  } else if (cursors.right.isDown && cursors.up.isDown) {
    player.setVelocityX(velocityPlayer);
    player.setVelocityY(-velocityPlayer);
    if (player.body.velocity.x < 0) {
      player.scaleX = -1;
    } else {
      player.scaleX = 1;
    }
    player.body.setOffset(0, 0);
    player.anims.play("knight-run", true);
  } else if (cursors.left.isDown && cursors.down.isDown) {
    player.setVelocityX(-velocityPlayer);
    player.setVelocityY(velocityPlayer);
    if (player.body.velocity.x < 0) {
      player.scaleX = -1;
    } else {
      player.scaleX = 1;
    }
    player.body.setOffset(96, 0);
    player.anims.play("knight-run", true);
  } else if (cursors.right.isDown && cursors.down.isDown) {
    player.setVelocityX(velocityPlayer);
    player.setVelocityY(velocityPlayer);
    if (player.body.velocity.x < 0) {
      player.scaleX = -1;
    } else {
      player.scaleX = 1;
    }
    player.body.setOffset(0, 0);
    player.anims.play("knight-run", true);
  } else if (cursors.left.isDown) {
    player.setVelocityX(-velocityPlayer);
    if (player.body.velocity.x < 0) {
      player.scaleX = -1;
    } else {
      player.scaleX = 1;
    }
    player.body.setOffset(96, 0);
    player.anims.play("knight-run", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(velocityPlayer);
    if (player.body.velocity.x < 0) {
      player.scaleX = -1;
    } else {
      player.scaleX = 1;
    }
    player.body.setOffset(0, 0);
    player.anims.play("knight-run", true);
  } else if (cursors.up.isDown) {
    player.setVelocityY(-velocityPlayer);
    if (player.body.velocity.x < 0) {
      player.scaleX = -1;
    } else {
      player.scaleX = 1;
    }
    player.body.setOffset(0, 0);
    player.anims.play("knight-run", true);
  } else if (cursors.down.isDown) {
    player.setVelocityY(velocityPlayer);
    if (player.body.velocity.x < 0) {
      player.scaleX = -1;
    } else {
      player.scaleX = 1;
    }
    player.body.setOffset(0, 0);
    player.anims.play("knight-run", true);
  } else {
    player.body.setVelocity(0);
    // player.body.setOffset(0, 0);
    player.anims.play("knight-idle", true);
  }
  console.log(player.body.velocity);
}

export { Movement };
