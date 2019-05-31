class Asteroid extends Phaser.Physics.Arcade.Sprite{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'asteroidB');

        this.play('rotateB');

        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, 0);
        this.body.onWorldBounds = true;
        this.setVelocity(100, -200);
    }
}