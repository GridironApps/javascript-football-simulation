var field_width = 720; //px

// set the configuration of the game
let game_config = {
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
  width: field_width,
  height: field_width * 160/360,
  parent: "game-container",
  backgroundColor: '#013220',
  scene: SprintTest,
  physics: {
    default: 'arcade',
    matter: {
        gravity: {
            y: 0
        },
        debug: true
    }
  }
};

// create a new game, pass the configuration
const game = new Phaser.Game(game_config);