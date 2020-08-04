//simulate the current running play
pbp('The ball is snapped.');

//figure out if the play is a run or a pass
var run_or_pass = undefined;
if (offense['QB'].job.hasOwnProperty('handoff')) {
    pbp('It looks like a handoff to the ' + offense['QB'].job.handoff.direction);
    run_or_pass = 'run';
}

//roll for defensive reads //TODO don't read for certain defensive jobs e.g. blitz
var bad_read = [];
for (pos in defense) {
    var delay = (Math.random() * 100) - defense[pos].attributes.read;
    if (delay <= 0) {
        defense[pos].delay = 0;
    } else {
        defense[pos].delay = delay / 100;
        bad_read.push(pos);
    }
}
if (bad_read.length > 0) {
    pbp('The following defenders had a hard time reading the play: ' + bad_read.join(', '));
}

//===
//RUN PLAY: calculate score for each gap //TODO move this to it's own section when we add in passing
//===

//initialize matchup list
var gaps = ['E-', 'D-', 'C-', 'B-', 'A-', 'A+', 'B+', 'C+', 'D+', 'E+']; //FIXME, this might be better used when initializing the play
var gap_locations = [-13, -7, -5, -3, -1, 1, 3, 5, 7, 13];
var matchups = {};
for (var i = 0; i < gaps.length; i++) {
    matchups[gaps[i]] = {
        'off_players': [],
        'block_dice': 0,
        'o_push_force': 0,
        'o_weight': 0,
        'def_players': [],
        'shed_dice': 0,
        'd_push_force': 0,
        'd_weight': 0,
        'gap_location': [gap_locations[i], 0],
        'block_location': [gap_locations[i], -Infinity]
    }
};

//loop through offense and update matchup players and dice
for (pos in offense) {
    if (offense[pos].job.hasOwnProperty('run_block')) {
        var gaps = offense[pos].job.run_block.gaps;
        var atts = offense[pos].attributes;
        for (var i = 0; i < gaps.length; i++) {
            matchups[gaps[i]].off_players.push(pos);
            matchups[gaps[i]].block_dice += atts.run_block / gaps.length;
            matchups[gaps[i]].o_push_force += atts.squat / gaps.length;
            matchups[gaps[i]].o_weight += atts.weight / gaps.length;
        }
    }
}

//loop through defense and update matchup player(s) and dice
for (pos in defense) {
    if (defense[pos].job.gap != 'free') {
        var gap = defense[pos].job.gap; //assuming each defender get's 1 gap
        var atts = defense[pos].attributes;
        matchups[gap].def_players.push(pos);
        matchups[gap].shed_dice += atts.shed;
        matchups[gap].d_push_force += atts.squat;
        matchups[gap].d_weight += atts.weight;
    }
}

//loop through matchups and calculate location of initial block attempt
for (gap in matchups) {
    var m = matchups[gap]; //the current matchup

    //figure out how long it will take defender to reach gap, FIXME assuming 1 defender per gap
    //TODO update this to use L2 distance, using L1 for now to simplify (L2 is euclidian, L1 is taxi cab)
    var defender = defense[m.def_players[0]];
    var time_delay = defender.delay;
    var dx_def = Math.abs(m.gap_location[0] - defender.location[0]) + 0.5; //adding half a body width to help offense initialize block
    var dy_def = Math.abs(m.gap_location[1] - defender.location[1]);
    var speed_def = defender.attributes.speed;
    var time_dx_def = dx_def * speed_def / 40;
    m.time = (dx_def + dy_def) * speed_def / 40;

    //loop through potential blockers and figure out where they intersect the defender
    var blockers = m.off_players;
    for (var i = 0; i < blockers.length; i++) {
        var blocker = offense[blockers[i]];
        var dx_off = Math.abs(m.gap_location[0] - blocker.location[0]) - 0.5; //removing half a body width to help offense initialize block
        var dy_off = Math.abs(m.gap_location[1] - blocker.location[1]);
        var time_dx_off = dx_off * blocker.attributes.speed / 40;

        var y_total = dy_def + dy_off;
        var dist_to_block = (40 / (speed_def + blocker.attributes.speed)) * (time_delay + time_dx_def - time_dx_off + y_total * speed_def / 40);

        if (dist_to_block >= 0) {
            //defender is blocked

            //only choose the best block location
            //FIXME O-line included in block will probably cause block to be further back than FB 
            var y_block = dist_to_block - dy_off;
            if (y_block >= m.block_location[1]) {
                m.block_location[1] = y_block;
                m.time = (dx_off + dist_to_block) * blocker.attributes.speed / 40; //TODO check if there was a faster time at the same distance
            }
        }
    }
    //cap collision distance, shouldn't be behind defender
    m.block_location[1] = Math.min(m.block_location[1], defender.location[1]);
}

//calculate how long the runner takes to hit the target hole so we know how long to simulate the blocking matchups
var pos = offense['QB'].job.handoff.target;
var time_to_hole = Infinity;
if (offense[pos].job.hasOwnProperty('run')) {
    var ball_carrier = offense[pos];
    var gaps = ball_carrier.job.run.target;
    var x = 0;
    var y = 0;
    for (var i = 0; i < gaps.length; i++) {
        x += matchups[gaps[i]].gap_location[0];
        y += matchups[gaps[i]].gap_location[1];
    }
    x = x / gaps.length;
    y = y / gaps.length;
    var dist_to_target = dist(ball_carrier.location, [x, y]);
    time_to_hole = dist_to_target * ball_carrier.attributes.speed / 40
}

//simulate matchups
for (gap in matchups) {

    var blocked = false;
    var block_roll_mod = 'normal';
    var shed_block = false;

    //see if blocker arrived in time
    if (matchups[gap].block_location[1] != -Infinity) {

        //see if the blocker(s) are able to initialize a block
        if (matchups[gap].block_dice < roll(100)) {
            block_roll_mod = 'disadvantaged';

            //roll again, they are basically just in the way at this point
            if (matchups[gap].block_dice >= roll(100)) {
                blocked = true;
            }
        } else {
            blocked = true;
        }
    } else {
        //TODO check for a TFL ... reuse 1D code for collision
    }

    if (blocked) {
        //check to see if the defender is able to shed the block
        var hold_block_score = roll(matchups[gap].block_dice, block_roll_mod);
        var shed_score = roll(matchups[gap].shed_dice);

        if (hold_block_score < shed_score) {
            shed_block = true;
        }
    }

    if (shed_block) {
        //defender has been delayed
        matchups[gap].push_yards = 0; //TODO figure out a better representation
    } else if (blocked) {
        //figure out how far gap is pushed, can be negative if defender overpowers blocker(s)
        var drive_block_score = roll(matchups[gap].block_dice, block_roll_mod) / 100; //FIXME this is always a bonus to the blocker...might set a threshold where it hurts them due to bad blocking technique, say 50
        var o_push_force = matchups[gap].o_push_force * (1 + drive_block_score); //offense can win through technique

        var d_push_force = matchups[gap].d_push_force;

        var net_force = o_push_force - d_push_force;
        var dt = Math.max(time_to_hole - matchups[gap].time, 0);
        var total_weight = matchups[gap].o_weight + matchups[gap].d_weight;

        matchups[gap].push_yards = 0.5 * net_force * (32.2 / total_weight) * dt * dt;
    } else {
        matchups[gap].push_yards = 0;
    }


}

//printing the matchups to the screen
var gaps = ['E-', 'D-', 'C-', 'B-', 'A-', 'A+', 'B+', 'C+', 'D+', 'E+']; //FIXME, this might be better used when initializing the play
pbp('The matchups look like this:');
for (var i = 0; i < gaps.length; i++) {
    var gap = gaps[i];
    var m = matchups[gap];
    pbp('Gap ' + gap + ': ' + m.off_players + ' met ' + m.def_players + ' ' + m.block_location[1].toFixed(1) + ' yards downfield and the pile was pushed ' + m.push_yards.toFixed(1) + ' yards');
}

//have the runner read the gaps
var pos = offense['QB'].job.handoff.target;
if (offense[pos].job.hasOwnProperty('run')) {
    var ball_carrier = offense[pos];
    var gaps = ball_carrier.job.run.target;

    pbp('The ' + pos + ' checks the following gaps: ' + gaps);
    var gap = undefined;
    var gap_score = -Infinity;
    for (var i = 0; i < gaps.length; i++) {
        var temp_score = matchups[gaps[i]].block_location[1] + matchups[gaps[i]].push_yards;
        if (temp_score > gap_score) {
            gap = gaps[i];
            gap_score = temp_score;
        }
    }

    //check to see if we have a blocked gap
    if (gap_score >= 0) {
        //we have a gap that is blocked
        pbp('The ' + pos + ' hits the ' + gap + ' gap.');
    } else {
        //none of our target gaps are blocked, try to bounce it outside
        pbp("It looks like the " + pos + ' didn\'t like what they saw and are trying to bounce it outside.');
        gap = ball_carrier.job.run.bounce[0];
    }

} else {
    pbp('There seems to be a mixup in the backfield.');
}

/*
//get location of default gap
var gap_location = [1, 0];
//calculate distance of ball_carrier to gap
var runner_dist = dist(offense[o_play.ball_carrier].location, gap_location);
//calculate time of ball_carrier to gap
var runner_time = runner_dist * 4.5 / 40; //4.5 is the 40-yd time of the running back ... FIXME this should be pulled in from somewhere
//calculate distance and time for each defender to reach target gap
for (pos in defense) {
    defense[pos].distance_to_gap = dist(defense[pos].location,defense[pos].gap);
    defense[pos].distance_to_hole = defense[pos].distance_to_gap + dist(defense[pos].gap, gap_location);
    defense[pos].time_to_hole = defense[pos].delay + defense[pos].distance_to_hole * defense[pos].speed / 40;
}
//get distance to hole for blockers
for (pos in offense){
    offense[pos].distance_to_hole = dist(offense[pos].location, gap_location);
}
//figure out blockers ... this would likely be pre-snap and therefore based on distance (not time)
//using a "block the guy assigned to this gap scheme, Big on Big"


//get array of defenders that could get to the hole before the runner
var defenders = [];
for(pos in defense){
    if(defense[pos].time_to_hole < runner_time){
        defenders.push(pos);
    }
}

//each offensive player has alignment and task

//(defense) personnel -> formation + play

//get defensive players

//each defensive player has alignment, run-to task, run-away task, pass task
 */

//write to pbp section function
function pbp(text) {
    $('#pbp').append($('<p></p>').text(text));
}

//distance function
function dist(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
}

//roll function
function roll(dice, modifier) {
    var r = dice * Math.random();

    if (modifier == 'advantage') {
        r = Math.max(r, roll(dice));
    }

    if (modifier == 'disadvantage') {
        r = Math.min(r, roll(dice));
    }

    return r;
}