/**
 * drawField.js
 * used to display a field on the screen
 */

/**
 * Conversion constants
 */
const FOOT_TO_PX = 5;
const YARD_TO_PX = FOOT_TO_PX * FOOT_TO_YARD;

/**
 * Initialize replay using PIXI (http://pixijs.download/release/docs/index.html)
 */

//Create a PIXI renderer
const renderer = new PIXI.Renderer({
    view: document.getElementById('field'),
    width: field.total_length * FOOT_TO_PX,
    height: field.total_width * FOOT_TO_PX,
    resolution: window.devicePixelRatio,
    autoDensity: true
});

//create container to store field, players, and ball
var stage = new PIXI.Container();

//start by drawing the field to the stage
drawField(field, stage); //TODO might an advantage to drawing the field to one layer and everything else to another layer on top of it

//add the ball to the stage
let ellipse = new PIXI.Graphics(); //using https://github.com/kittykatattack/learningPixi#ellipses
ellipse.beginFill(0x8B4513);
ellipse.drawEllipse(
    (ball.y + field.endzone_depth) * FOOT_TO_PX,
    ball.x * FOOT_TO_PX,
    ball.length * FOOT_TO_PX,
    ball.width * FOOT_TO_PX
); //flip x and y since we rotate our sim sideways
ellipse.endFill();
stage.addChild(ellipse);

//add the players to the stage
for (var pos in offense) {
    let circle = new PIXI.Graphics(); //using https://github.com/kittykatattack/learningPixi#circles
    circle.beginFill(0x000000);
    circle.drawCircle(
        (field.endzone_depth + offense[pos].y) * FOOT_TO_PX,
        offense[pos].x * FOOT_TO_PX,
        offense[pos].radius * FOOT_TO_PX);
    circle.endFill();
    stage.addChild(circle);
}

//update the location of the ball and the players
renderer.render(stage);

/**
 * 
 * Main Functions
 */

function drawField(field, stage) {

    //draw a main field
    let rectangle = new PIXI.Graphics(); //using https://github.com/kittykatattack/learningPixi#rectangles
    rectangle.lineStyle(0 * field.border_thickness * FOOT_TO_PX, 0xFFFFFF, 1); //currently not showing border
    rectangle.beginFill(0x526F35);
    rectangle.drawRect(0, 0, field.total_length * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
    rectangle.endFill();
    stage.addChild(rectangle);

    //add lines for endzones
    for (yd = 0; yd <= 100; yd += 100) {
        let line = new PIXI.Graphics(); //using https://github.com/kittykatattack/learningPixi#lines
        line.lineStyle(field.goalline_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
        line.moveTo((field.endzone_depth + yd * YARD_TO_FOOT) * FOOT_TO_PX, 0);
        line.lineTo((field.endzone_depth + yd * YARD_TO_FOOT) * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
        stage.addChild(line);
    }

    //creating a map from internal yardage to yardage displayed on the field
    let yard_markers = {
        10: '1 0', //the spacing between numbers is used to pad around the yardlines
        20: '2 0',
        30: '3 0',
        40: '4 0',
        50: '5 0',
        60: '4 0',
        70: '3 0',
        80: '2 0',
        90: '1 0'
    };

    //add yardlines and numbers
    for (yd = 5; yd <= 95; yd += 5) {

        //calculate common x-coordinate
        let x = field.endzone_depth + yd * 3;

        //draw yardline 
        let line = new PIXI.Graphics();
        line.lineStyle(field.line_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
        line.moveTo(x * FOOT_TO_PX, 0);
        line.lineTo(x * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
        stage.addChild(line);

        //numbers are every 10 yards
        if (yd % 10 == 0) {
            //add top sideline numbers (using https://github.com/kittykatattack/learningPixi#text)
            var text = new PIXI.Text(yard_markers[yd]);
            //text.width isn't as important as text.height from an alignment standpoint. If we use both, numbers look squished.
            text.height = field.number_height * FOOT_TO_PX;
            text.style = { fill: "white", fontFamily: "Arial" };
            text.anchor.set(0.5, 0); //moving anchor to center-top
            text.position.set(x * FOOT_TO_PX, field.number_top * FOOT_TO_PX);
            text.rotation = Math.PI; //turn numbers upside down
            stage.addChild(text);

            //add bottom sideline numbers
            text = new PIXI.Text(yard_markers[yd]); //FIXME had to create a second text class instead of being able to re-use
            text.height = field.number_height * FOOT_TO_PX;
            text.style = { fill: "white", fontFamily: "Arial" };
            text.anchor.set(0.5, 0); //moving anchor to center-top
            text.position.set(x * FOOT_TO_PX, (field.total_width - field.number_top) * FOOT_TO_PX);
            stage.addChild(text);
        }

    }

    //add hash marks on bottom
    for (yd = 1; yd < 100; yd += 1) {
        //check if we are on a yardline
        if (yd % 5 == 0) {
            continue;
        }

        //establish current yardline x coordinate
        let x = (field.endzone_depth + yd * 3);

        //initialize line drawing object
        let line = new PIXI.Graphics();
        line.lineStyle(field.line_thickness * FOOT_TO_PX, 0xFFFFFF, 1);

        //draw top sideline hash
        line.moveTo(x * FOOT_TO_PX, 0);
        line.lineTo(x * FOOT_TO_PX, field.hash_length * FOOT_TO_PX);
        stage.addChild(line);

        //draw top midfield hash
        line.moveTo(x * FOOT_TO_PX, (field.total_width - field.hash_width) / 2 * FOOT_TO_PX);
        line.lineTo(x * FOOT_TO_PX, ((field.total_width - field.hash_width) / 2 - field.hash_length) * FOOT_TO_PX);
        stage.addChild(line);

        //draw bottom midefield hash
        line.moveTo(x * FOOT_TO_PX, (field.total_width + field.hash_width) / 2 * FOOT_TO_PX);
        line.lineTo(x * FOOT_TO_PX, ((field.total_width + field.hash_width) / 2 + field.hash_length) * FOOT_TO_PX);
        stage.addChild(line);

        //draw bottom sideline hash
        line.moveTo(x * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
        line.lineTo(x * FOOT_TO_PX, (field.total_width - field.hash_length) * FOOT_TO_PX);
        stage.addChild(line);
    }
}