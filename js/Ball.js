class Ball {
    constructor(scene, x, y) {
        this.scene = scene;

        //create ball sprite at given location
        var sprite = scene.physics.add.image(x, y, 'football');

        //create pointer to physics body
        this.body = sprite.body;

        //give the body a circle collision boundary
        this.body.setCircle(2)
            .setCollideWorldBounds(true)
            .setMass(1/32.2);
    }
}