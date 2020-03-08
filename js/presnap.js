/**
 * pre-snap phase module
 * This phase of the game sim is responsible for getting the right players and setting up the initial coordinates of the offensive and defensive formations
 *  
 * inputs
 * -field data
 * -ball location (current yardline, assume centered for now) TODO allow ball to move between the hashes
 * -offensive personnel and formation data
 * -defensive personnel and formation data
 * 
 * outputs
 * -offensive players with inital coordinates (left-to-right field)
 * -defensive players wth initial coordinates
 * -ball coordinates
 * 
 */

//constants
const FOOT_TO_YARD = 1 / 3;
const YARD_TO_FOOT = 3;
const INCH_TO_FOOT = 1 / 12;

//input
var yardline = 20;

//setup objects
var landmarks = new Landmarks(field); //can add a spot parameter if needed
var ball = new Ball(landmarks.spot.x, landmarks.spot.y);
var offense = new Offense(o_formation, landmarks, ball);

/*
//lets start by sorting players left to right based on center point, if there is a tie sort front to back
o_players.sort(function (a, b) {
    if (offense[a].x < offense[b].x) {
        return -1;
    } else if (offense[a].x > offense[b].x) {
        return 1;
    } else if (offense[a].y > offense[b].y) {
        //a.x == b.x
        return -1;
    } else if (offense[a].y < offense[b].y) {
        //a.x == b.x
        return 1;
    } else {
        //a.x == b.x && a.y == b.y
        return 0;
    }
});

//figure out index of LT, C, and RT
for (var i = 0; i < o_players.length; i++) {
    
    //figure out index of LT
    if (o_players[i] === 'LT') {
        var index_LT = i;
    }

    if (o_players[i] === 'C'){
        var index_C = i;
    }

    if(o_players[i] === 'RT'){
        var index_RT = i;
        break;
    }
}

//find attached and detached on the left
//set the end man on the line of scrimmage to the LT, can update later if we find another guy
var min_detached_distance = 6; //feet ... FIXME this should be in the preference file
emlos_left = o_players[index_LT];
var ends_left = [];
var wideouts_left = [];

//check each player to the left to see if they are close enough to be an end
for (j = index_LT - 1; j >= 0; j--) {
    if (offense[o_players[j]].right_edge >= offense[emlos_left].left_edge - min_detached_distance) {
        //player is considered attached
        ends_left.unshift(o_players[j]);

        //check to see if they are on the line of scrimmage
        if (offense[o_players[j]].front_edge > offense['C'].y) {
            emlos_left = o_players[j];
        }
    } else {

        //remainder of players will be wideouts_left
        wideouts_left = o_players.slice(0, j + 1);
        break;
    }
}
console.log("wr left: " + wideouts_left.join(','));
console.log("ends left: " + ends_left.join(','));
console.log("EMLOS left: " + emlos_left);

//find attached and detached on the right
//set the end man on the line of scrimmage to the RT, can update later if we find another guy
emlos_right = o_players[index_RT];
var ends_right = [];
var wideouts_right = [];

//check each player to the left to see if they are close enough to be an end
for (j = index_RT + 1; j < o_players.length; j++) {
    if (offense[o_players[j]].left_edge <= offense[emlos_right].right_edge + min_detached_distance) {
        //player is considered attached
        ends_right.push(o_players[j]);

        //check to see if they are on the line of scrimmage
        if (offense[o_players[j]].front_edge > offense['C'].y) {
            emlos_right = o_players[j];
        }
    } else {

        //remainder of players will be wideouts_left
        wideouts_right = o_players.slice(j, o_players.length);
        break;
    }
}
console.log("EMLOS right: " + emlos_right);
console.log("ends right: " + ends_right.join(','));
console.log("wr right: " + wideouts_right.join(','));

var ineligible = ['QB', 'LT', 'LG', 'C', 'RG', 'RT'];
//backs left of center
var backs_left = [];
var backs_center = [];
for (j = index_LT + 1; j < index_C; j++) {
    if (ineligible.indexOf(o_players[j]) < 0) {
        //check to see if player completely to the left
        if(offense[o_players[j]].right_edge <= offense['C'].left_edge){
            backs_left.push(o_players[j]);
       }else{
            backs_center.push(o_players[j]);            
        }
    }
}

//backs right of center
var backs_right = [];
for (j = index_C + 1; j < index_RT; j++) {
    if (ineligible.indexOf(o_players[j]) < 0) {
        //check to see if player completely to the right
        if(offense[o_players[j]].left_edge >= offense['C'].right_edge){
            backs_right.push(o_players[j]);
        }else{
            backs_center.push(o_players[j]);            
        }
    }
}
console.log("backs left: " + backs_left.join(','));
console.log("backs center: " + backs_center.join(','));
console.log("backs right : " + backs_right.join(','));
*/