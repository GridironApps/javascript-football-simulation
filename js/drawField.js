/**
 * drawField.js
 * used to display a field on the screen
 */

/**
 * Conversion constants
 */
const METER_TO_YARD = 1.09361;
const FOOT_TO_YARD = 1 / 3;
const FOOT_TO_PX = 4;
const YARD_TO_PX = FOOT_TO_PX * 3;
const METER_TO_PX = FOOT_TO_PX * 3.28084;

var _data;

//https://www.sitepoint.com/introduction-to-the-fetch-api/
fetch('data/pro_field.json').then(response => response.json()).then(json => drawField(json));

/**
 * Initialize replay using PIXI (http://pixijs.download/release/docs/index.html)
 */

function drawField(field) {

    //Create a PIXI renderer
    const renderer = new PIXI.Renderer({
        view: document.getElementById('field'),
        width: 360 * FOOT_TO_PX,
        height: 160 * FOOT_TO_PX,
        resolution: window.devicePixelRatio,
        autoDensity: true
    });

    //create container to store images
    var stage = new PIXI.Container();

    //draw a main field
    let rectangle = new PIXI.Graphics();
    rectangle.lineStyle(0 * field.border_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
    rectangle.beginFill(0x526F35);
    rectangle.drawRect(0, 0, field.total_length * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
    rectangle.endFill();
    stage.addChild(rectangle);

    //add lines for endzones
    var line = new PIXI.Graphics();
    line.lineStyle(field.goalline_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
    line.moveTo(field.endzone_depth * FOOT_TO_PX, 0);
    line.lineTo(field.endzone_depth * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
    stage.addChild(line);

    line = new PIXI.Graphics();
    line.lineStyle(field.goalline_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
    line.moveTo((field.total_length - field.endzone_depth) * FOOT_TO_PX, 0);
    line.lineTo((field.total_length - field.endzone_depth) * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
    stage.addChild(line);

    //add yardlines
    for (yd = 5; yd < 100; yd += 5) {
        line = new PIXI.Graphics();
        line.lineStyle(field.line_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
        line.moveTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, 0);
        line.lineTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
        stage.addChild(line);
    }

    //add hash marks on bottom
    for (yd = 1; yd < 100; yd += 1) {
        //top
        line = new PIXI.Graphics();
        line.lineStyle(field.line_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
        line.moveTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, 0);
        line.lineTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, field.dash_length * FOOT_TO_PX);
        stage.addChild(line);

        //top hash
        line = new PIXI.Graphics();
        line.lineStyle(field.line_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
        line.moveTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, (field.total_width - field.hash_width) / 2 * FOOT_TO_PX);
        line.lineTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, ((field.total_width - field.hash_width) / 2 - field.dash_length) * FOOT_TO_PX);
        stage.addChild(line);

        //bottom hash
        line = new PIXI.Graphics();
        line.lineStyle(field.line_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
        line.moveTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, (field.total_width + field.hash_width) / 2 * FOOT_TO_PX);
        line.lineTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, ((field.total_width + field.hash_width) / 2 + field.dash_length) * FOOT_TO_PX);
        stage.addChild(line);

        //bottom
        line = new PIXI.Graphics();
        line.lineStyle(field.line_thickness * FOOT_TO_PX, 0xFFFFFF, 1);
        line.moveTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, field.total_width * FOOT_TO_PX);
        line.lineTo((field.endzone_depth + yd * 3) * FOOT_TO_PX, (field.total_width - field.dash_length) * FOOT_TO_PX);
        stage.addChild(line);
    }

    //update screen
    renderer.render(stage);
}