class Player {
    constructor(scene, x, y, jersey_number) {
        this.scene = scene;

        //create player at desired location with specified jersey number
        let text = scene.add.text(x, y, jersey_number, { font: '6px Arial', fill: '#ffffff' });
        this.sprite = scene.matter.add.gameObject(text, { shape: { type: 'circle', radius: 6} })
            .setAngle(90)
            .setMass(207/32.2); //usain bolt weight in lb divided by gravity

        // Track the arrow keys & WASD
        const {LEFT, RIGHT, UP, DOWN} = Phaser.Input.Keyboard.KeyCodes;
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN
        });
    }

    update() {
        const keys = this.keys;
        const sprite = this.sprite;
        const forceX = 1/1500; // lbf * px/yd * s/step * s/step
        const forceY = forceX/2;
        let force_vector = {x: 0, y: 0};

        // Apply horizontal acceleration when left or right are applied
        if (keys.left.isDown) {
            force_vector.x = -forceX;
            //sprite.setVelocityX(-10/60*this.scene.in2px); //concidence that in2px is 6 an px per meter is 6
        } else if (keys.right.isDown) {
            force_vector.x = forceX;
            //sprite.setVelocityX(10/60*this.scene.in2px);
        } else {
            force_vector.x = 0;
            //sprite.setVelocityX(0);
        }

        // Apply vertical acceleration when up or down are applied
        if (keys.down.isDown) {
            force_vector.y = forceY; //remember that y is down positive
            //sprite.setVelocityY(6.5);
        } else if (keys.up.isDown) {
            force_vector.y = -forceY;
            //sprite.setVelocityY(-6.5);
        } else {
            force_vector.y = 0;
            //sprite.setVelocityY(0);
        }

        sprite.applyForce(force_vector);

        //bound velocities
        let max_speed = 10 * this.scene.px_per_yd / 60;
        let vx = sprite.body.velocity.x;
        if(vx > max_speed){
            sprite.setVelocityX(max_speed);
        } else if(vx < -1* max_speed){
            sprite.setVelocityX(-1 * max_speed);
        }

        let vy = sprite.body.velocity.y;
        if(vy > max_speed){
            sprite.setVelocityY(max_speed);
        } else if(vy < -1* max_speed){
            sprite.setVelocityY(-1 * max_speed);
        }
    }
}