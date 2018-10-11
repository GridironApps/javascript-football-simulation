const in2px = 6; //6 inches per pixel at default zoom

// set the configuration of the game
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 720,
  height: 320,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: 'matter',
    matter: {
        gravity: {
            y: 0
        },
        debug: true
    }
  }
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);

var hb;
var lb;


//load assets
function preload(){
  //load images
  this.load.image('field', 'assets/football-field.jpg');
}

//called once after preload ends
function create(){
  //setup boundaries in the matter.js world
  this.matter.world.setBounds(0, 0, game.config.width, game.config.height).disableGravity();
  
  //create background sprite
  let background = this.add.sprite(0, 0, 'field');

  //change origin of background sprite
  background.setOrigin(0, 0);

  //scale background to fit
  console.log(background);
  background.setDisplaySize(720, 320);

  //create HB player using text
  var text = this.add.text(10*in2px, 320/2, 'HB', { font: '6px Arial', fill: '#ffffff' });
  hb = this.matter.add.gameObject(text, { shape: { type: 'circle', radius: 6 } });
  hb.setAngle(90);
  hb.setMass(200);
  hb.setVelocity(2, 0);
  hb.setBounce(0.1);
  hb.setFriction(0,0,0);

  //create LB using text
  var text = this.add.text(60*in2px, 320/2, 'LB', { font: '6px Arial', fill: '#ffffff' });
  let lb = this.matter.add.gameObject(text, { shape: { type: 'circle', radius: 6 } });
  lb.setAngle(-90);
  lb.setMass(240);
  lb.setVelocity(-1, 0);
  lb.setBounce(0.1);
  lb.setFriction(0,0,0);

  console.log(hb);

  // set bounds so the camera won't go outside the game world
  var camera = this.cameras.add(0, 0, 720, 320).setZoom(2).setBounds(0, 0, 720, 320).startFollow(hb);
}

//this will try to run 60 times per second
function update(){

}