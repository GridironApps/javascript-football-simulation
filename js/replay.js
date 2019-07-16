/**
 * replay.js
 * used to display the result of the simulation
 */

/**
 * Conversion constants
 */
const METER_TO_YARD = 1.09361;
const FOOT_TO_YARD = 1 / 3;
const FOOT_TO_PX = 4;
const YARD_TO_PX = FOOT_TO_PX * 3;
const METER_TO_PX = FOOT_TO_PX * 3.28084;

/**
 * Initialize replay using PIXI (http://pixijs.download/release/docs/index.html)
 */

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

//Add field background
var texture = PIXI.Texture.from('assets/football-field.jpg');
var img = new PIXI.Sprite(texture);
img.x = 0;
img.y = 0;
img.height = renderer.screen.height;
img.width = renderer.screen.width;
stage.addChild(img);

//add the player sprites to the screen
for(var i=0;i<replay_data.length;i++){
    replay_data[i].sprite.x = replay_data[i].x.shift() * YARD_TO_PX;
    replay_data[i].sprite.y = replay_data[i].y.shift() * YARD_TO_PX;
    stage.addChild(replay_data[i].sprite);
}

/**
 * Drawing Loop
 */

//update function
function update() {
    //loop through and update position of each sprite
    for(var i=0;i<replay_data.length;i++){
        var x = replay_data[i].x.shift();
        var y = replay_data[i].y.shift();
        if (typeof x !== 'undefined') {
            replay_data[i].sprite.x = x * YARD_TO_PX;
        }
        if (typeof y !== 'undefined') {
            replay_data[i].sprite.y = y * YARD_TO_PX;
        }
    }

    //update screen
    renderer.render(stage);
}

//using the smoothie script to take our 10 FPS simulation and run it at normal 60 FPS (https://github.com/kittykatattack/smoothie)
var smoothie = new Smoothie({
    engine: PIXI,
    renderer: renderer,
    root: stage,
    fps: 10,
    update: update.bind(this)
});

//run the animation
smoothie.start();