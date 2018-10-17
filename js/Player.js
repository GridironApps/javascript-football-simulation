class Player {
    constructor(scene, x, y, mass, jersey_number) {
        this.scene = scene;

        //create player at desired location with specified jersey number
        let text = scene.add.text(x, y, jersey_number, { font: '6px Arial', fill: '#ffffff' });
        this.sprite = scene.matter.add.gameObject(text, { shape: { type: 'circle', radius: 6 } })
            .setAngle(90)
            .setMass(mass) //kg
            .setFriction(0, 0, 0); //kinetic, air, static friction values (all bounded between 0 and 1)
    }

    sprint() {
        const sprite = this.sprite;
        let force_vector = { x: 549, y: 0 }; //N
        sprite.applyForce(force_vector);

        //bound velocities
        let max_speed = 12.3 * this.scene.px_per_yd * 1 / 60;
        let vx = sprite.body.velocity.x;
        if (vx > max_speed) {
            sprite.setVelocityX(max_speed);
        } else if (vx < -1 * max_speed) {
            sprite.setVelocityX(-1 * max_speed);
        }

        let vy = sprite.body.velocity.y;
        if (vy > max_speed) {
            sprite.setVelocityY(max_speed);
        } else if (vy < -1 * max_speed) {
            sprite.setVelocityY(-1 * max_speed);
        }
    }

    slow() {
        const sprite = this.sprite;
        console.log(sprite.body.velocity.x);
        if (sprite.body.velocity.x > 1.5 * this.scene.px_per_yd * 1 / 60) {
            sprite.setVelocityX(sprite.body.velocity.x * .98);
        } else {
            sprite.setVelocityX(0);
        }
    }
}