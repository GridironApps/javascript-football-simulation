class FieldScene extends Phaser.Scene {
  constructor() {
    super(); //this is used to call the parent class Phase.Scene
    this.in2px = 6; //6 inches per pixel at default zoom 
  }

  //load assets
  preload() {
    //load images
    this.load.image('field', 'assets/football-field.jpg');
  }

  //called once after preload ends
  create() {
    //setup boundaries in the matter.js world
    this.matter.world.setBounds(0, 0, game.config.width, game.config.height).disableGravity();

    //create background sprite
    let background = this.add.sprite(0, 0, 'field');

    //change origin of background sprite
    background.setOrigin(0, 0);

    //scale background to fit
    background.setDisplaySize(720, 320);

    //create player from class player using text
    this.player = new Player(this, 10 * this.in2px, game.config.height / 2, 'HB');
    console.log(this.player);

    //create camera to zoom in and follow player
    this.cameras.main.startFollow(this.player.sprite).setZoom(2);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
  }

  //this will try to run 60 times per second
  update() {
    // Allow the player to respond to key presses and move itself
    this.player.update();
  }
}