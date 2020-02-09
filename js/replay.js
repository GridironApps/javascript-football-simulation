/**
 * drawField.js
 * used to display a field on the screen
 */

/**
 * Conversion constants
 */
const FOOT_TO_YARD = 1 / 3;
const YARD_TO_FOOT = 3;
const FOOT_TO_PX = 4;
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
drawField(field, stage);

//add the ball to the stage

//add the players to the stage

//update the location of the ball and the players
renderer.render(stage);

/**
 * 
 * Main Functions
 */

function drawField(field, stage) {

    //draw a main field
    let rectangle = new PIXI.Graphics();
    rectangle.lineStyle(0 * field.border_thickness * FOOT_TO_PX, 0xFFFFFF, 1); //currently not showing border
    rectangle.beginFill(0x526F35);
    rectangle.drawRect(0, 0, field.total_length * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
    rectangle.endFill();
    stage.addChild(rectangle);

    //add lines for endzones
    for (yd = 0; yd <= 100; yd += 100) {
        let line = new PIXI.Graphics();
        line.lineStyle(field.goalline_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
        line.moveTo((field.endzone_depth + yd * YARD_TO_FOOT) * FOOT_TO_PX, 0);
        line.lineTo((field.endzone_depth + yd * YARD_TO_FOOT) * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
        stage.addChild(line);
    }

    //add yardlines
    for (yd = 5; yd <= 95; yd += 5) {
        let line = new PIXI.Graphics();
        line.lineStyle(field.line_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
        line.moveTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, 0);
        line.lineTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
        stage.addChild(line);
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