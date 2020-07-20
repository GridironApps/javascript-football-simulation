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

//setup objects
var landmarks = new Landmarks(field); //can add a spot parameter if needed
var ball = new Ball(landmarks.spot.x, landmarks.spot.y);
var offense = new Offense(o_formation, landmarks, ball);
var defense = new Defense(d_formation, landmarks, ball, offense);