//make world without gravity
var world = new p2.World({
    gravity: [0, 0]
});

//initialize time step for world.step()
const FIXED_TIME_STEP = 0.1; // seconds

//initialize player
var player = new Player(32, 'RB', 200, 4.50, [10,15], ['GO:10,0','GO:20,10']);

//add player to world
world.addBody(player);

//initialize replay data storage
var replay_data = {
    sprite: player.makeSprite(),
    x: [player.position[0]],
    y: [player.position[1]],
    t: [world.time]
}

//loop through waypoints (player.goals for now)
var waypoints = player.goals;
var destination;
for (var i = 0; i < waypoints.length; i++) {

    //get next waypoint
    destination = waypoints[i];

    //check to see if at waypoint
    while (p2.vec2.distance(player.position, destination) >= (player.speed() * FIXED_TIME_STEP)/2) { //FIXME if the constant is too low the player will overshoot and cause the script to get stuck...possible fixes are player slows down, run at dt = 0.01, don't allow player to go backwards

        //update player velocity to reach waypoint
        player.velocity = player.velocityTo(destination);

        //step through simulation once
        world.step(FIXED_TIME_STEP);

        //store current player position
        replay_data.x.push(player.position[0]);
        replay_data.y.push(player.position[1]);
        replay_data.t.push(world.time);
    }
}