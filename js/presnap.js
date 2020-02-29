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

//setup landmarks
var ball = {};
var hash_left = {};
var hash_right = {};
var numbers_left = {};
var numbers_right = {};
var sideline_left = {};
var sideline_right = {};

//make x-coord left-right and y-coord up-down but we have to translate/rotate when we replay

//setup ball
ball.x = field.total_width / 2; //center the ball for now 
ball.y = yardline * YARD_TO_FOOT;
ball.length = 11 / 12;
ball.width = 7 / 12;
ball.left_edge = ball.x - ball.width / 2;
ball.right_edge = ball.x + ball.width / 2;
ball.back_edge = ball.y;// - ball.length;
ball.front_edge = ball.y;

//setup left hash mark
hash_left.x = field.total_width / 2 - field.hash_width / 2; //FIXME this should be the center of the hash
hash_left.y = ball.y;
hash_left.back_edge = hash_left.y;
hash_left.front_edge = hash_left.y;
hash_left.left_edge = hash_left.x - field.hash_length;
hash_left.right_edge = hash_left.x;

//setup right hash mark
hash_right.x = field.total_width / 2 + field.hash_width / 2;
hash_right.y = ball.y;
hash_right.back_edge = hash_right.y;
hash_right.front_edge = hash_right.y;
hash_right.left_edge = hash_right.x;
hash_right.right_edge = hash_right.x + field.hash_length;

//setup numbers to the left
numbers_left.x = field.number_top;
numbers_left.y = ball.y;
numbers_left.back_edge = numbers_left.y;
numbers_left.front_edge = numbers_left.y;
numbers_left.left_edge = numbers_left.x - field.number_width;
numbers_left.right_edge = numbers_left.x;

//setup numbers to the right
numbers_right.x = field.total_width - field.number_top;
numbers_right.y = ball.y;
numbers_right.back_edge = numbers_right.y;
numbers_right.front_edge = numbers_right.y;
numbers_right.left_edge = numbers_right.x;
numbers_right.right_edge = numbers_right.x + field.number_width;

//setup left sideline
sideline_left.y = ball.y;
sideline_left.x = 0;
sideline_left.back_edge = sideline_left.y;
sideline_left.front_edge = sideline_left.y;
sideline_left.left_edge = undefined; //want to make sure we can trigger an error here
sideline_left.right_edge = sideline_left.x;

//setup right sideline
sideline_right.y = ball.y;
sideline_right.x = field.total_width;
sideline_right.back_edge = sideline_right.y;
sideline_right.front_edge = sideline_right.y;
sideline_right.left_edge = sideline_right.x;
sideline_right.right_edge = undefined; //want to make sure we can trigger an error here

//setup offensive player objects
var offense = {};
for (var pos in o_formation.positions) {
    var current_player = o_formation.positions[pos];

    offense[pos] = new Player(current_player.horizontal, current_player.vertical);
}

//initialize position of each player in the offense
var o_players = [];
for (var pos in offense) {

    var current_player = offense[pos];

    //check if player already has a position defined
    if (typeof (current_player.x) === 'undefined') {
        setX(current_player);
    }

    if (typeof (current_player.y) === 'undefined') {
        setY(current_player);
    }

    o_players.push(pos);
}

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

/**
 * 
 * Utility functions
 */


function setX(player) {
    var h = player.h_align;
    var x;
    switch (h[0]) {
        case "align":
            x = alignX(h[1], h[2]);
            break;
        case "right-of":
            x = rightOf(h[1], h[2], player);
            break;
        case "left-of":
            x = leftOf(h[1], h[2], player);
            break;
        case "apex":
            x = apex(h[1], h[2]);
        default:
        //do nothing for now
    }

    player.x = x;
}

function setY(player) {
    var v = player.v_align;
    switch (v[0]) {
        case "align":
            y = alignY(v[1], v[2]);
            break;
        case "behind":
            y = behind(v[1], v[2], player);
            break;
        default:
        //do nothing for now
    }

    player.y = y;
}

function getRef(ref) {
    //figure out which reference we are using
    switch (ref) {
        case 'ball':
            ref = ball;
            break;
        case 'hash-left':
            ref = hash_left;
            break;
        case 'hash-right':
            ref = hash_right;
            break;
        case 'numbers-left':
            ref = numbers_left;
            break;
        case 'numbers-right':
            ref = numbers_right;
            break;
        case 'sideline-left':
            ref = sideline_left;
            break;
        case 'sideline-right':
            ref = sideline_right;
            break;
        default:
            //assume its a player
            ref = offense[ref];

            //check if player ref has x set
            if (typeof (ref.x) === 'undefined') {
                //set the y-coordinate for undefined player
                setX(ref);
            }

            //check if player ref has y set
            if (typeof (ref.y) === 'undefined') {
                //set the y-coordinate for undefined player
                setY(ref);
            }
    }

    return ref;
}

function alignX(ref, dist) {

    ref = getRef(ref);

    return ref.x + dist;
}

function rightOf(ref, dist, player) {

    ref = getRef(ref);

    return ref.right_edge + player.radius + dist;
}

function leftOf(ref, dist, player) {

    ref = getRef(ref);

    return ref.left_edge - player.radius + dist;
}

function apex(ref1, ref2) {

    ref1 = getRef(ref1);
    ref2 = getRef(ref2);

    return (ref1.x + ref2.x) / 2;
}

function alignY(ref, dist) {

    ref = getRef(ref);

    return ref.y + dist;
}

function behind(ref, dist, player) {

    ref = getRef(ref);

    return ref.back_edge - player.radius + dist;
}

function shadeLeft(ref, dist, player){

}

function shadeRight(ref, dist, player){
    
}