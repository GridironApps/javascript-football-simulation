class Player {
    constructor(scene, x, y, jersey_number) {
        this.scene = scene;

        //create player at desired location with specified jersey number
        let text = scene.add.text(x, y, jersey_number, { font: '6px Arial', fill: '#ffffff' });
        this.sprite = scene.matter.add.gameObject(text, { shape: { type: 'circle', radius: 6 } })
            .setAngle(90)
            .setMass(200); //90 kg which is roughly 200 lb

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
        const forceX = 0.270;
        const forceY = forceX/2;
        let force_vector = {x: 0, y: 0};

        // Apply horizontal acceleration when left or right are applied
        if (keys.left.isDown) {
            force_vector.x = -forceX;
        } else if (keys.right.isDown) {
            force_vector.x = forceX;
        } else {
            force_vector.x = 0;
        }

        // Apply vertical acceleration when up or down are applied
        if (keys.down.isDown) {
            force_vector.y = forceY; //remember that y is down positive
        } else if (keys.up.isDown) {
            force_vector.y = -forceY;
        } else {
            force_vector.y = 0;
        }

        sprite.applyForce(force_vector);
    }
}