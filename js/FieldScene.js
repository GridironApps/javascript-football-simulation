class FieldScene extends Phaser.Scene {
  constructor() {
    super(); //this is used to call the parent class Phase.Scene
    this.px_per_yd = game.config.width / 120;
  }

  //load assets
  preload() {
    //load images
    this.load.image('field', 'assets/football-field.jpg');
    this.load.image('football','assets/football.png');
    this.load.image('red-dot','assets/red-circle-64.png');
  }

  //called once after preload ends
  create() {
    //create background sprite
    let background = this.add.sprite(0, 0, 'field');

    //change origin of background sprite
    background.setOrigin(0, 0);

    //scale background to fit
    background.setDisplaySize(game.config.width, game.config.height);

    //create ball from Ball class
    this.ball = new Ball(this, 60 * this.px_per_yd, game.config.height / 2);
    console.log(this.ball);

    //create camera to zoom in and follow ball
    this.cameras.main.startFollow(this.ball.body).setZoom(1);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);

    // hard coded offense
    var offense = [
      {
        "id": "C",
        "x": 59.5,
        "y": 27
      },
      {
        "id": "LG",
        "x": 59,
        "y": 26
      },
      {
        "id": "LT",
        "x": 59,
        "y": 25
      },
      {
        "id": "RG",
        "x": 59,
        "y": 28
      },
      {
        "id": "RT",
        "x": 59,
        "y": 29
      },
      {
        "id": "QB",
        "x": 55,
        "y": 27
      },
      {
        "id": "Y",
        "x": 58.5,
        "y": 20
      },
      {
        "id": "H",
        "x": 58.5,
        "y": 34
      },
      {
        "id": "X",
        "x": 59.5,
        "y": 3
      },
      {
        "id": "Z",
        "x": 59.5,
        "y": 50.3
      },
      {
        "id": "F",
        "x": 58.5,
        "y": 11.5
      }
    ];    
    console.log(offense);

    //create offensive group
    var scene = this;
    offense.forEach(function(player, index, array){
      new Player(scene, player.id, 200, 'med', 'low', player.x * scene.px_per_yd, player.y * scene.px_per_yd);
    });
  }

  //this will try to run 60 times per second
  update() {

  }
}