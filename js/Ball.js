class Ball {
    constructor(scene, x, y) {
        this.scene = scene;

        //create ball sprite at given location
        var sprite = scene.physics.add.image(x, y, 'football').setDisplaySize(1.5 * 10 / 3 / 3 * this.scene.px_per_yd, 1.5 * 7 / 3 / 3 * this.scene.px_per_yd);

        //create pointer to physics body
        this.body = sprite.body;

        //set a few physics options for the ball
        this.body.setCollideWorldBounds(true)
            .setMass(1 / 32.2);
    }

    // instantaniously move the ball to the given coordinate location
    instantMoveTo(x, y) {
        this.body.reset(x, y);
    }

    // move the ball to the given coordinate location with given force(?) TODO: update third variable name
    moveTo(x, y, velocity) {
        var deltaX = x - this.body.x;
        var deltaY = y - this.body.y;
        var totalDist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        //alert("deltaX: " + this.body.x + " - " + x + " = " + deltaX + "\ndeltaY: " + this.body.y + " - " + y + " = " + deltaY);
        this.body.setVelocity(deltaX / totalDist * velocity, deltaY / totalDist * velocity);
    }
}