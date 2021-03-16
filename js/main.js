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
        for(const ATT in players[POS]){
            offense[POS][ATT] = players[POS][ATT];
        }
    }

    return offense;
}

function formatDefense(players, play) {
    //initialize variable that will be returned
    let defense = _.cloneDeep(play.assignments); //using Lodash to clone without reference

    for (const POS in defense) {
        for(const ATT in players[POS]){
            defense[POS][ATT] = players[POS][ATT];
        }
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
            result = 'Invalid play.type';
    }

    console.log(result);
    return result;
}