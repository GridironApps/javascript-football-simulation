// create a new scene
let gameScene = new Phaser.Scene('Game');

//load assets
gameScene.preload = function(){
  //load images
  this.load.image('field','assets/football-field.jpg');
}

//called once after preload ends
gameScene.create = function(){
  //create background sprite
  let background = this.add.sprite(0, 0, 'field');

  //change origin of background sprite
  background.setOrigin(0,0);

  //scale background to fit
  console.log(background);
  background.setDisplaySize(720,320);
}

//this will try to run 60 times per second
gameScene.update = function(){

}

// set the configuration of the game
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 720,
  height: 320,
  scene: gameScene
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
