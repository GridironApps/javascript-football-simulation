class FieldScene extends Phaser.Scene {
  constructor() {
    super(); //this is used to call the parent class Phase.Scene
    this.px_per_yd = game.config.width / 120;
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
    console.log(game.config);
    console.log(this.matter.world);

    //create background sprite
    let background = this.add.sprite(0, 0, 'field');

    //change origin of background sprite
    background.setOrigin(0, 0);

    //scale background to fit
    background.setDisplaySize(game.config.width, game.config.height);

    //create player from class player using text
    this.player = new Player(this, 10 * this.px_per_yd, game.config.height / 2, '⚡');
    console.log(this.player);

    //create camera to zoom in and follow player
    this.cameras.main.startFollow(this.player.sprite).setZoom(2);

    //create a dummy player to run into
    this.dummy = new Player(this, 40 * this.px_per_yd, game.config.height / 2, '☃');

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
  }

  //this will try to run 60 times per second
  update() {
    // Allow the player to respond to key presses and move itself
    this.player.update();

    if(this.player.sprite.x > 10 * this.px_per_yd && !this.t_start){
      this.t_start = new Date();
    } else if (this.player.sprite.x > 20 * this.px_per_yd && !this.t_10){
      this.t_10 = (new Date() - this.t_start)/1000;
      console.log('10 yard split: ' + this.t_10);
      console.log('current speed: ' + this.player.sprite.body.velocity.x);
    } else if(this.player.sprite.x > 30 * this.px_per_yd && !this.t_20){
      this.t_20 = (new Date() - this.t_start)/1000;
      console.log('20 yard split: ' + this.t_20);
      console.log('current speed: ' + this.player.sprite.body.velocity.x);
    } else if(this.player.sprite.x > 50 * this.px_per_yd && !this.t_40){
      this.t_40 = (new Date() - this.t_start)/1000;
      console.log('40 yard time: ' + this.t_40);
      console.log('current speed: ' + this.player.sprite.body.velocity.x);
    } else if(this.player.sprite.x > 110 * this.px_per_yd && !this.t_100){
      this.t_100 = (new Date() - this.t_start)/1000;
      console.log('100 yard time: ' + this.t_100);
      console.log('current speed: ' + this.player.sprite.body.velocity.x);
    }
  }
}