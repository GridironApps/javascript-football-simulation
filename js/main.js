//setup global variable to store data ... eventually this will be handled differently
var data = {
    o_players: {},
    o_play: {},
    d_players: {},
    d_play: {}
}

//function to load data
function loadData(input, param) {
    let file = input.files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        json = JSON.parse(reader.result);
        data[param] = json;

        if (param === 'd_play') {
            //load play name
            $('#defense_play_name').text(json.name);
            $('#defense_play_diagram').attr('src', json.diagram);
        }

        if (param === 'o_play') {
            //load play name
            $('#offense_play_name').text(json.name);
            $('#offense_play_diagram').attr('src', json.diagram);
        }

        //if we have all data, simulate the play
        if (_.isEmpty(data.o_players) || _.isEmpty(data.o_play) || _.isEmpty(data.d_players) || _.isEmpty(data.d_play)) {

        } else {
            let result = simulatePlay();

            //write scores to page
            //$('#defense_score').text(result.defense.score.toFixed(1));
            //$('#offense_score').text(result.offense.score.toFixed(1));

            //write log data to pbp
            $('#log').html(result.log.join('<br/>') + '<br/>Additional information available in the console.')
        }

    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}

function formatOffense(players, play) {
    //initialize variable to be returned
    let offense = _.cloneDeep(play.assignments); //using Lodash to clone without reference

    //assign player attributes to offensive play positions //TODO in the future we could use this to also map play-position to personell-position  
    for (const POS in offense) {
        for (const ATT in players[POS]) {
            offense[POS][ATT] = players[POS][ATT];
        }
    }

    //add starting location for offense //FIXME player tags must match
    const HORIZONTAL = [-22, -19, -16, -13, -11, -9, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 13, 16, 19, 22];
    const VERTICAL = [-0.5, -1, -4, -8, -12];

    //calculate approximate starting location of offensive player
    for (row = 0; row < 5; row++) {
        for (col = 0; col < 27; col++) {
            var pos = play.formation[row][col].trim();
            if (pos !== "") {
                offense[pos].x = HORIZONTAL[col];
                offense[pos].y = VERTICAL[row];
            }
        }
    }

    return offense;
}

function formatDefense(players, play) {
    //initialize variable that will be returned
    let defense = _.cloneDeep(play.assignments); //using Lodash to clone without reference

    for (const POS in defense) {
        for (const ATT in players[POS]) {
            defense[POS][ATT] = players[POS][ATT];
        }
    }

    const RUSH_ZONE_X = {
        "E-": -16,
        "D-": -7,
        "C-": -5,
        "B-": -3,
        "A-": -1,
        "A+": 1,
        "B+": 3,
        "C+": 5,
        "D+": 7,
        "E+": 16
    }; //shortest horizontal yardage from the center to each zone

    //initialize position of each defender based on run and pass jobs //TODO this should exist before we call simRun or simPass
    for (const POS in defense) {

        //get rushing resposibilities
        let rush_zones = [];
        if (defense[POS].run_left.job == 'fit-zones') {
            rush_zones = defense[POS].run_left.rush_zones;
        } else if (defense[POS].run_left.job == 'pursue') {
            rush_zones = ["E-", "D-", "C-", "B-", "A-"];
        }
        if (defense[POS].run_right.job == 'fit-zones') {
            rush_zones = rush_zones.concat(defense[POS].run_right.rush_zones);
        } else if (defense[POS].run_right.job == 'pursue') {
            rush_zones = rush_zones.concat(["A+", "B+", "C+", "D+", "E+"]);
        }

        //get number of unique zones
        unique_rush_zones = rush_zones.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });

        //look at number of unique responsibilities to generate initial vertical depth
        if (unique_rush_zones.length == 1) {
            defense[POS].y = 0.5;
        } else if (unique_rush_zones.length == 2) {
            //check if zones are next to one another
            let z1 = unique_rush_zones[0];
            let z2 = unique_rush_zones[1];
            if (Math.abs(RUSH_ZONE_X[z1] - RUSH_ZONE_X[z2]) == 2) {
                //zones match or are adjacent //FIXME D & E zones won't register here
                defense[POS].y = 0.5;
            } else if (
                (z1 == 'E-' && z2 == 'D-') ||
                (z1 == 'D-' && z2 == 'E-') ||
                (z1 == 'E+' && z2 == 'D+') ||
                (z1 == 'D+' && z2 == 'E+')
            ) {
                defense[POS].y = 1;
            } else {
                defense[POS].y = 4;
            }
        } else {
            defense[POS].y = 4;
        }

        //TODO update y-pos using pass resposibilities

        //averaging all rush_zone locations to set initial x-position //FIXME the E zones will pull the defender outside a bit much
        let x = 0;
        for (const ZONE of rush_zones) {
            x += RUSH_ZONE_X[ZONE];
        }
        defense[POS].x = x / rush_zones.length;

        //TODO update x-pos using pass responsibiilties

        //TODO align based on TIME to each responsibility ... can add a run/pass cheat based on time (or distance) ... cheat pass by 0.1 seconds or 1 yd
    }

    return defense;
}

function simulatePlay() {
    let offense = formatOffense(data.o_players, data.o_play);
    let defense = formatDefense(data.d_players, data.d_play);

    let result;
    switch (data.o_play.type) {
        case 'run':
            result = simulateRun(offense, defense);
            break;
        case 'pass':
            result = simulatePass(offense, defense);
            break;
        default:
            result = 'Invalid play type';
    }

    console.log(result);
    return result;
}