class SprintTest extends Phaser.Scene {
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
      //create background sprite
      let background = this.add.sprite(0, 0, 'field');
  
      //change origin of background sprite
      background.setOrigin(0, 0);
  
      //scale background to fit
      background.setDisplaySize(game.config.width, game.config.height);
  
      //create player from class player -> scence, id, weight, power, speed, x, y
      this.player = new Player(this, 'QB', 200, 'med', 'low', 10 * this.px_per_yd, game.config.height/2);
      console.log(this.player);
  
      //create camera to zoom in and follow player
      this.cameras.main.startFollow(this.player.body).setZoom(2);
  
      // set bounds so the camera won't go outside the game world
      this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);
    }
  
    //this will try to run 60 times per second
    update() {     
  
      if(this.player.body.x > 10 * this.px_per_yd && !this.t_start){
        this.player.sprint();
        this.t_start = new Date();        
      } else if (this.player.body.x > 20 * this.px_per_yd && !this.t_10){
        this.player.sprint();
        this.t_10 = (new Date() - this.t_start)/1000;
        console.log('10 yard split: ' + this.t_10);
        console.log('current speed: ' + this.player.body.velocity.x);
      } else if(this.player.body.x > 30 * this.px_per_yd && !this.t_20){
        this.player.sprint();
        this.t_20 = (new Date() - this.t_start)/1000;
        console.log('20 yard split: ' + this.t_20);
        console.log('current speed: ' + this.player.body.velocity.x);
      } else if(this.player.body.x > 50 * this.px_per_yd && !this.t_40){
        this.t_40 = (new Date() - this.t_start)/1000;
        console.log('40 yard time: ' + this.t_40);
        console.log('current speed: ' + this.player.body.velocity.x);
      } else if (this.player.body.x > 50 * this.px_per_yd) {
        this.player.slow();
      } else{
        this.player.sprint();
      }
    }
  }