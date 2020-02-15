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

//input
var yardline = 20;

//setup landmarks
var ball;
var hash_left;
var hash_right;
var numbers_left;
var numbers_right;
var sideline_left;
var sideline_right;

//make x-coord left-right and y-coord up-down but we have to translate/rotate when we replay

//setup ball
ball.x = field.total_width / 2; //center the ball for now 
ball.y = yardline * YARD_TO_FOOT;
ball.length = 11 / 12;
ball.width = 7 / 12;
ball.left_edge = ball.x - ball.width / 2;
ball.right_edge = ball.x + ball.width / 2;
ball.back_edge = ball.y - ball.length;
ball.front_edge = ball.y;

//setup left hash mark
hash_left.x = field.total_width / 2 - field.hash_width / 2;
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

//setup offensive players
var players = o_formation.positions;
for (var pos in players) {

    var current_player = players[pos];

    //check if player already has a position defined
    if (current_player.x === 'undefined') {
        setX(current_player);
    }

    if (current_player.y === 'undefined') {
        current_player.y = getY(current_player);
    }
}

function setX(player) {
    var h = player.horizontal;
    var x;
    switch (h[0]) {
        case "align":
            x = alignX(h[1], h[2]);
            break;
        case "right-of":
            x = rightOf(h[1], h[2]);
            break;
        case "left-of":
            x = leftOf(h[1], h[2]);
            break;
        default:
        //do nothing for now
    }

    player.x = x;
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
            ref = players[ref];
    }
    return ref;
}

function alignX(ref, dist) {

    ref = getRef(ref);

    //check if player ref has x-coord
    if (ref.x === 'undefined') {
        //set the x-coordinate for undefined player
        setX(players[ref]);
    }

    return ref.x + dist;
}

function rightOf(ref, dist) {

    ref = getRef(ref);

    //check if player ref has x-coord
    if (ref.x === 'undefined') {
        //set the x-coordinate for undefined player
        setX(players[ref]);
    }

    return ref.x + dist;

}

function leftOf(ref, dist) {

    ref = getRef(ref);

    //check if player ref has x-coord
    if (ref.x === 'undefined') {
        //set the x-coordinate for undefined player
        setX(players[ref]);
    }

    return ref.x + dist;

}

function getY(player) {
    var v = player.vertical;
    switch (v[0]) {
        case "align":
            alignY(h[1], h[2]);
            break;
        case "behind":
            behind(h[1], h[2]);
            break;
        default:
        //do nothing for now
    }
}

function alignY(ref, dist) {

}

function behind(ref, dist) {

}