function Movement(cursors, player, velocityPlayer, game) {

    if (cursors.left.isDown && cursors.up.isDown) {
        player.setVelocityX(-velocityPlayer);
        player.setVelocityY(-velocityPlayer);
        player.anims.play("player-up", true);
    } else if (cursors.right.isDown && cursors.up.isDown) {
        player.setVelocityX(velocityPlayer);
        player.setVelocityY(-velocityPlayer);
        player.anims.play("player-up", true);
    } else if (cursors.left.isDown && cursors.down.isDown) {
        player.setVelocityX(-velocityPlayer);
        player.setVelocityY(velocityPlayer);
        player.anims.play("player-left", true);
    } else if (cursors.right.isDown && cursors.down.isDown) {
        player.setVelocityX(velocityPlayer);
        player.setVelocityY(velocityPlayer);
        player.anims.play("player-right", true);
    } else if (cursors.left.isDown) {
        player.setVelocityX(-velocityPlayer);
        player.anims.play("player-left", true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(velocityPlayer);
        player.anims.play("player-right", true);
    } else if (cursors.up.isDown) {
        player.setVelocityY(-velocityPlayer);
        player.anims.play("player-up", true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(velocityPlayer);
        player.anims.play("player-down", true);
    } else {
        player.anims.play("player-idle");
    }

}


export { Movement };