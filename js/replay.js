/**
 * replay.js
 * used to display the result of the simulation
 */

/**
 * Temp variables...these will eventually be passed in
 */

const METER_TO_YARD = 1.09361;
const FOOT_TO_YARD = 1 / 3;

var player = new Player(32, 'RB', 200, 4.50);

var replay_data = {
    sprite: player.makeSprite(),
    x: [10,20,30,40,47,55,55],
    y: [20,20,20,20,27,35,45],
    t: [0,1,2,3,4,5,6]
}

/**
 * Conversion constants
 */
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

//add the player to the screen
replay_data.sprite.x = replay_data.x.shift() * YARD_TO_PX;
replay_data.sprite.y = replay_data.y.shift() * YARD_TO_PX;
stage.addChild(replay_data.sprite);

/**
 * Drawing Loop
 */

//update function
function update() {
    var x = replay_data.x.shift();
    var y = replay_data.y.shift();
    if (typeof x !== 'undefined') {
        replay_data.sprite.x = x * YARD_TO_PX;
    }
    if (typeof y !== 'undefined') {
        replay_data.sprite.y = y * YARD_TO_PX;
    }
    renderer.render(stage);
}

//using the smoothie script to take our 10 FPS simulation and run it at normal 60 FPS (https://github.com/kittykatattack/smoothie)
var smoothie = new Smoothie({
    engine: PIXI,
    renderer: renderer,
    root: stage,
    fps: 1,
    update: update.bind(this)
});

//run the animation
smoothie.start();