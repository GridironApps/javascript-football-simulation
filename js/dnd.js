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

//calculate score for each gap //TODO move this to it's own section when we add in passing

//initialize matchup scores
var gaps = ['E-', 'D-', 'C-', 'B-', 'A-', 'A+', 'B+', 'C+', 'D+', 'E+'];
var matchups = {};
for (var i = 0; i < gaps.length; i++) {
    matchups[gaps[i]] = {
        'off_players': [],
        'block_dice': 0,
        'o_push_dice': 0,
        'def_player': undefined,
        'shed_dice': 0,
        'd_push_dice': 0
    }
};

//loop through offense and update matchup variables
for (pos in offense) {
    if (offense[pos].job.hasOwnProperty('run_block')) {
        var gaps = offense[pos].job.run_block.gaps;
        var push = offense[pos].attributes.strength / gaps.length;
        var block = offense[pos].attributes.run_block / gaps.length;
        for (var i = 0; i < gaps.length; i++) {
            matchups[gaps[i]].off_players.push(pos);
            matchups[gaps[i]].block_dice += block;
            matchups[gaps[i]].o_push_dice += push;
        }
    }
}

//TODO add in distance or something where initial location matters

//loop through defense and add shed rating to gap score
for (pos in defense) {
    if (defense[pos].job.gap != 'free') {
        var gap = defense[pos].job.gap;
        matchups[gap].def_player = pos;
        matchups[gap].shed_dice += defense[pos].attributes.shed;
        matchups[gap].d_push_dice += defense[pos].attributes.strength;
    }
}

//simulate matchups
for (gap in matchups) {
    var block_score = matchups[gap].block_dice * Math.random();
    var shed_score = matchups[gap].shed_dice * Math.random();
    if (block_score >= shed_score) {
        //defender is blocked, assuming 1 defender per gap
        matchups[gap].blocked = true;

        //figure out how far gap is pushed, can be negative if defender overpowers blocker(s)
        var o_push_score = matchups[gap].o_push_dice * Math.random();
        var d_push_score = matchups[gap].d_push_dice * Math.random();
        matchups[gap].push_score = o_push_score - d_push_score;

    } else {
        //defender is unblocked
        matchups[gap].blocked = false;
        matchups[gap].push_score = -Infinity;
    }
}

//printing the matchups to the screen
pbp('The matchups look like this:');
var gaps = ['E-', 'D-', 'C-', 'B-', 'A-', 'A+', 'B+', 'C+', 'D+', 'E+'];
for (var i = 0; i < gaps.length; i++) {
    var gap = gaps[i];
    var m = matchups[gap];
    pbp('Gap ' + gap + ': ' + m.off_players + ' versus ' + m.def_player + ' resulting in a push of ' + m.push_score);
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
        var push_score = matchups[gaps[i]].push_score;
        if (push_score > gap_score) {
            gap = gaps[i];
            gap_score = push_score;
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