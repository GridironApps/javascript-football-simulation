/*
    Very crude simulation that is basically DnD style dice rolling
*/
var gap = {
    'A-strong': [1,0],
    'B-strong': [3,0],
    'C-strong': [5,0],
    'D-strong': [7,0],
    'contain-strong': [9,0],
    'A-weak': [-1,0],
    'B-weak': [-3,0],
    'C-weak': [-5,0],
    'D-weak': [-7,0],
    'contain-weak': [-9,0]
}

var d_formation = [
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', 'FS', '__', '__', '__', '__', '__', '__', '__', 'SS', '__', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', 'WB', '__', '__', '__', 'MB', '__', '__', '__', 'SB', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', 'C1', '__', '__', '__', '__', '__', '__', 'RE', '__', '__', '__', 'NT', '__', '__', '__', 'DT', '__', '__', '__', 'LE', '__', '__', '__', '__', 'C2', '__']
];

var o_formation = [
    ['__', 'W1', '__', '__', '__', '__', '__', '__', '__', 'LT', '__', 'LG', '__', 'OC', '__', 'RG', '__', 'RT', '__', 'TE', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', 'QB', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', 'W2', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', 'FB', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', 'RB', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__']
];

var o_play = {
    'type': 'handoff', //handoff, pitch, draw, pass, play_action, screen?
    'ball_carrier': 'RB', //RB, FB, QB
    'gap': ['A-right'] //first one listed is the default adjacent are options based on the RBs read
};

//make an array of defensive players
defense = {
    'RE': {
        'gap': 'C-weak',
        'read': 50,
        'speed': 4.6
    },
    'NT': {
        'gap': 'A-weak',
        'read': 50,
        'speed': 5.2
    },
    'DT': {
        'gap': 'B-strong',
        'read': 50,
        'speed': 5.0
    },
    'LE': {
        'gap': 'D-strong',
        'read': 50,
        'speed': 4.8
    },
    'WB': {
        'gap': 'B-weak',
        'read': 50,
        'speed': 4.5
    },
    'MB': {
        'gap': 'A-strong',
        'read': 50,
        'speed': 4.6
    },
    'SB': {
        'gap': 'C-strong',
        'read': 50,
        'speed': 4.6
    },
    'C1': {
        'gap': 'man',
        'read': 50,
        'speed': 4.3
    },
    'FS': {
        'gap': 'contain-weak',
        'read': 50,
        'speed': 4.4
    },
    'SS': {
        'gap': 'contain-strong',
        'read': 50,
        'speed': 4.5
    },
    'C2': {
        'gap': 'man',
        'read': 50,
        'speed': 4.4
    }
}

//calculate approximate defender locations
var horizontal = [-22, -19, -16, -13, -11, -9, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 13, 16, 19, 22];
var d_vertical = [12, 8, 4, 1, 0.5];
var o_vertical = [-0.5, -1, -4, -8, -12];

for (row = 4; row > -1; row--) {
    for (col = 0; col < 27; col++) {
        var pos = d_formation[row][col];
        if (pos !== '__') {
            var h = horizontal[col];
            var v = d_vertical[row];
            defense[pos].location = [h, v];
        }
    }
}

//calculate approximate location of offensive player
var offense = {};
for (row = 0; row < 5; row++) {
    for (col = 0; col < 27; col++) {
        var pos = o_formation[row][col];
        if (pos !== '__') {
            var h = horizontal[col];
            var v = o_vertical[row];
            offense[pos] = {};
            offense[pos].location = [h, v];
        }
    }
}

//replace gap with location for defense
for(pos in defense){
    var g = defense[pos].gap;
    if(typeof(gap[g]) !== 'undefined'){
        defense[pos].gap = gap[g];
    }else{
        defense[pos].gap = defense[pos].location;
    }
}

//simulate the current running play
console.log('The ball is snapped.');
//tell the viewer what the play might be
console.log('It looks like a handoff to the right.');
//do defensive reads
var bad_read = [];
for (pos in defense) {
    var delay = (Math.random() * 100) - defense[pos].read;
    if (delay <= 0) {
        defense[pos].delay = 0;
    } else {
        defense[pos].delay = delay/100;
        bad_read.push(pos);
    }
}
if (bad_read.length > 0) {
    console.log('The following defenders had a hard time reading the play: ' + bad_read.join(', '));
}
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

//distance function
function dist(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
}