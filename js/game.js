// set the configuration of the game
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: 720,
  height: 320,
  parent: "game-container",
  backgroundColor: '#013220',
  scene: FieldScene,
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
const game = new Phaser.Game(config);