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
        data[param] = JSON.parse(reader.result);
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}

function formatOffense(players, play) {
    //initialize variable to be returned
    let offense = _.cloneDeep(play.assignments); //using Lodash to clone without reference

    //assign player attributes to offensive play positions //TODO in the future we could use this to also map play-position to personell-position  
    for (const pos in offense) {
        offense[pos].run_dice = players[pos].run_dice;
        offense[pos].pass_dice = players[pos].pass_dice;
    }

    return offense;
}

function formatDefense(players, play) {
    //initialize variable that will be returned
    let defense = _.cloneDeep(play.assignments); //using Lodash to clone without reference

    for (const pos in defense) {
        defense[pos].run_dice = players[pos].run_dice;
        defense[pos].pass_dice = players[pos].pass_dice;
    }

    return defense;
}

function simulatePlay() {
    let offense = formatOffense(data.o_players,data.o_play);
    let defense = formatDefense(data.d_players,data.d_play);

    let result;
    switch(data.o_play.type){
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
}