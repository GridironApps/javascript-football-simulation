class Player extends p2.Body {
    jersey; //2 digit number
    role; //QB, RB, etc.
    weight; //in pounds
    forty; //time to run the 40-yard dash in seconds

    constructor(jersey, role, weight, forty) {

        super({
            mass: weight * 0.453592 //convert lb to kg
        });

        //write attributes to object
        this.jersey = jersey;
        this.role = role; //position is not the best name for this??? ID or role may be better....
        this.weight = weight;
        this.forty = forty;

        // Add a circle shape to the body
        this.addShape(new p2.Circle({ radius: 1 }));
    }

    speed() {
        return 40 / this.forty; //speed in yd/s 
    }

    velocityTo(destination) { //destination should be a vec2

        //create shortcut for vec2 (http://glmatrix.net/docs/module-vec2.html)
        var v2 = p2.vec2;

        //get unit vector
        var diff = v2.subtract(v2.create(), destination, this.position);
        var unit_vector = v2.normalize(v2.create(), diff);

        //mutiply by speed to set velocity vector
        this.velocity = v2.scale(v2.create(), unit_vector, this.speed());

        return this.velocity;
    }

    makeSprite() {
        let shape = new PIXI.Graphics();
        shape.beginFill(0xFF9933);
        shape.drawCircle(this.position[0], this.position[1], 10);
        shape.endFill();

        return shape;
    }
}

/**
    //make world without gravity
    var world = new p2.World({
        gravity: [0, 0]
    });

    //make dot (particle) with a size of 1 unit at 0,0
    var dot = new p2.Body({
        mass: 1,
        position: [0, 0],
        //give particle velocity of 1 unit in x direction
        velocity: [1.13, 0],
        damping: 0
    });

    // Add a circle shape to the body
    dot.addShape(new p2.Circle({ radius: 1 }));

    //add dot to world
    world.addBody(dot);

    //setup runner or update function
    const FIXED_TIME_STEP = 1; // seconds
    var running;

    function update() {
        if (running) {
            world.step(FIXED_TIME_STEP);
            update();
        }
    }

    //Time how long it takes dot to reach 10 units in x direction
    var afterUpdate = world.on('postStep', function () {
        if (dot.position[0] >= 10) {

            console.log('Trial #' + i);
            console.log('Position: ' + dot.position[0]);
            console.log('Time: ' + (world.time + FIXED_TIME_STEP));
            console.log('Velocity: ' + dot.velocity[0]);
            console.log('');

            //reset dot position
            dot.position[0] = 0;

            //stop the simulatioh
            running = false;
        }
    });

    //repeat for 10 trials
    for (var i = 0; i < 10; i++) {
        //start the simulation
        running = true;
        update();
    }
*/