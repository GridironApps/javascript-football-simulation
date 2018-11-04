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

    //create camera to zoom in and follow ball
    this.cameras.main.startFollow(this.ball.body).setZoom(1);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);

    //parse csv file
    var scene = this;
    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vTJwIgCS-T2qFvOjVAFo0TzBbUHxtWDxy60DWNED1gQeS8V43zI5toweqvyia2uuFK67xUlntvQMDjT/pub?gid=0&single=true&output=csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: function (offense) {
        //create offensive group
        offense.data.forEach(function (player, index, array) {
          new Player(scene, player.id, player.weight, player.power, player.speed, player.agility, player.x * scene.px_per_yd, player.y * scene.px_per_yd);
        });
      }
    });
  }

  //this will try to run 60 times per second
  update() {

  }
}