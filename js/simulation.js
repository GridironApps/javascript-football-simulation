//make world without gravity
var world = new p2.World({
    gravity: [0, 0]
});

//initialize time step for world.step()
const FIXED_TIME_STEP = 0.1; // seconds

//initialize player
var players = [
    new Player(32, 'RB', 200, 4.50, [10, 10], ['GO:5,0', 'GO:5,5', 'GO:20,5']), //purposley giving players different number of waypoints
    new Player(88, 'WR', 180, 4.40, [10, 40], ['GO:20,0', 'GO:18,-2'])
];

//add player to world
players.forEach(function(player){
    world.addBody(player);
});

//initialize replay data storage
var replay_data = [];
for (var i = 0; i < players.length; i++) {
    replay_data.push(
        {
            sprite: players[i].makeSprite(),
            x: [players[i].position[0]],
            y: [players[i].position[1]],
            t: [world.time]
        }
    )
}

//need to completely change how this update works
function sim() {

    //assume we are finished
    finished = true;

    //loop through each player and set their velocity
    for (var i = 0; i < players.length; i++) {
        var player = players[i];

        //update goal assuming one still exists
        if (typeof player.current_goal !== 'undefined') {
            //check to see if player has reached goal
            if (p2.vec2.distance(player.position, player.current_goal) < (player.speed() * FIXED_TIME_STEP) / 2) {
                //get next waypoint
                player.current_goal = player.goals.shift();
            }
        }

        //update velocity
        if (typeof player.current_goal !== 'undefined') {
            //update player velocity to reach waypoint
            player.velocity = player.velocityTo(player.current_goal);

            //indicate we need to keep looping
            finished = false;
        } else {
            //players without a goal just stand there
            player.velocity = vec2(0, 0);
        }
    }

    //step through simulation once all players have an updated velocity
    world.step(FIXED_TIME_STEP);

    //store current player position
    for (var i = 0; i < replay_data.length; i++) {
        replay_data[i].x.push(players[i].position[0]);
        replay_data[i].y.push(players[i].position[1]);
        replay_data[i].t.push(world.time);
    }

    //check to see if we need to keep updating
    if (!finished) {
        sim();
    }
}

//start simulation
var finished = false;
sim();