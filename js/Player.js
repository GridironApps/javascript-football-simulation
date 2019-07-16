class Player extends p2.Body {
    jersey; //2 digit number
    role; //QB, RB, etc.
    weight; //in pounds
    forty; //time to run the 40-yard dash in seconds
    starting_position;
    goals = []; //series of goals to complete...for now it's just a bunch of waypoints

    constructor(jersey, role, weight, forty, starting_position, script) {

        super({
            mass: weight * 0.453592 //convert lb to kg
        });

        //write attributes to object
        this.jersey = jersey;
        this.role = role; //position is not the best name for this??? ID or role may be better....
        this.weight = weight;
        this.forty = forty;
        this.starting_position = starting_position;

        //update position
        this.position = vec2(starting_position[0],starting_position[1]);

        // Add a circle shape to the body
        this.addShape(new p2.Circle({ radius: 0.8 }));

        //parse script into a series of waypoints....eventually goals
        for(var i=0;i<script.length;i++){
            var goal = script[i].split(':');
            var cmd = goal[0];

            if(cmd == "GO"){
                var xy = goal[1].split(',');
                var x = parseFloat(xy[0]);
                var y = parseFloat(xy[1]);
            }
            
            this.goals.push([
                this.starting_position[0] + x,
                this.starting_position[1] + y
            ]);
        }
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