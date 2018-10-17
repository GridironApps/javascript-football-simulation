var field_width = 720; //px

// set the configuration of the game
let config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: field_width,
  height: field_width * 160/360,
  parent: "game-container",
  backgroundColor: '#013220',
  scene: SprintTest,
  physics: {
    default: 'matter',
    matter: {
        gravity: {
            y: 0
        },
        debug: true,
        timing: {
          timeScale: 1/1000 * Math.pow(field_width/120, 0.5)
        }
    }
  }
};

// create a new game, pass the configuration
const game = new Phaser.Game(config);