class Player {
    constructor(scene, id, weight, power, speed, x, y) {
        this.scene = scene;

        //create a dot to put player on, easier to see
        var dot = scene.add.image(0,0,'red-dot').setDisplaySize(1*scene.px_per_yd, 1*scene.px_per_yd);

        //create player with given text id
        var text = scene.add.text(0, 0, id, { font: '7px Arial', fill: '#ffffff' })
            .setOrigin(0.5, 0.5);

        //create a container at desired location for player
        var container = scene.add.container(x,y);

        //put text in container
        container.add(dot);
        container.add(text);

        //enable physics on container
        scene.physics.world.enable(container);

        //create pointer to physics body
        this.body = container.body;

        //give the body a circle collision boundary
        this.body.setCircle(4)
            .setCollideWorldBounds(true)
            .setMass(weight/32.2)
            .setMaxVelocity(12.3*this.scene.px_per_yd,12.3*this.scene.px_per_yd);
    }

    sprint() {
        const body = this.body;
        body.setAcceleration(54.9,0); //549 N
    }

    slow() {
        const body = this.body;
        console.log(body.velocity.x);
        if (body.velocity.x > 1.5 * this.scene.px_per_yd) {
            body.setVelocityX(body.velocity.x * 0.88);
        } else {
            body.stop();
        }
    }
}