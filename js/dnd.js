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
matchups = {
    'E-': {
        'off_players': [],
        'off_score': 0,
        'def_player': undefined,
        'def_score': 0
    },
    'D-': {
        'off_players': [],
        'off_score': 0,
        'def_player': undefined,
        'def_score': 0
    },
    'C-': {
        'off_players': [],
        'off_score': 0,
        'def_player': undefined,
        'def_score': 0
    },
    'B-': {
        'off_players': [],
        'off_score': 0,
        'def_player': undefined,
        'def_score': 0
    },
    'A-': {
        'off_players': [],
        'off_score': 0,
        'def_player': undefined,
        'def_score': 0
    },
    'A+': {
        'off_players': [],
        'off_score': 0,
        'def_player': undefined,
        'def_score': 0
    },
    'B+': {
        'off_players': [],
        'off_score': 0,
        'def_player': undefined,
        'def_score': 0
    },
    'C+': {
        'off_players': [],
        'off_score': 0,
        'def_player': undefined,
        'def_score': 0
    },
    'D+': {
        'off_players': [],
        'off_score': 0,
        'def_player': undefined,
        'def_score': 0
    },
    'E+': {
        'off_players': [],
        'off_score': 0,
        'def_player': undefined,
        'def_score': 0
    }
};

//loop through offense and add up run block scores
for (pos in offense) {
    if (offense[pos].job.hasOwnProperty('run_block')) {
        var gaps = offense[pos].job.run_block.gaps;
        var score = offense[pos].attributes.run_block / gaps.length;
        for (var i = 0; i < gaps.length; i++) {
            matchups[gaps[i]].off_players.push(pos);
            matchups[gaps[i]].off_score += score;
        }
    }
}

//TODO add in distance or something where initial location matters

//loop through defense and add shed rating to gap score
for (pos in defense) {
    if (defense[pos].job.gap != 'free') {
        var gap = defense[pos].job.gap;
        var score = defense[pos].attributes.shed;
        matchups[gap].def_player = pos;
        matchups[gap].def_score += score;
    }
}

//calculate a gap score ... roll off_score vs def_score randomly and calculate the difference (off-def)
for (gap in matchups) {
    var o_roll = matchups[gap].off_score * Math.random();
    var d_roll = matchups[gap].def_score * Math.random();
    matchups[gap].score = o_roll - d_roll;
}

//printing the matchups to the screen
pbp('The matchups look like this:');
var gaps = ['E-','D-','C-','B-','A-','A+','B+','C+','D+','E+'];
for(var i=0;i<gaps.length;i++){
    var gap = gaps[i];
    var m = matchups[gap];
    pbp('Gap ' + gap + ': ' + m.off_players + ' (' + m.off_score + ') versus ' + m.def_player + ' (' + m.def_score + ') resulting in a score of ' + m.score);
}

//have the runner read the gaps
var pos = offense['QB'].job.handoff.target;
if(offense[pos].job.hasOwnProperty('run')){
    var ball_carrier = offense[pos];
    var gaps = ball_carrier.job.run.target;
    
    pbp('The ' + pos + ' checks the following gaps: ' + gaps);
    var gap = undefined;
    var gap_score = -Infinity;
    for(var i=0;i<gaps.length;i++){
        var score = matchups[gaps[i]].score;
        if(score > gap_score){
            gap = gaps[i];
        }
    }

    //check to see if we have a blocked gap
    if(gap_score >= 0){
        //we have a gap that is blocked
        pbp('It looks like the ' + pos + ' is hitting the ' + gap + ' gap.');
    }else{
        //none of our target gaps are blocked, try to bounce it outside
        pbp("It looks like the " + pos + ' didn\'t like what they saw and are trying to bounce it outside.');
        gap = ball_carrier.job.run.bounce[0];
    }

}else{
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