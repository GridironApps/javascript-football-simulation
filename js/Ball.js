class Ball {
    constructor(scene, x, y) {
        this.scene = scene;

        //create ball sprite at given location
        var sprite = scene.physics.add.image(x, y, 'football').setDisplaySize(1.5*10/3/3*this.scene.px_per_yd,1.5*7/3/3*this.scene.px_per_yd);

        //create pointer to physics body
        this.body = sprite.body;

        //set a few physics options for the ball
        this.body.setCollideWorldBounds(true)
            .setMass(1/32.2);
    }
}