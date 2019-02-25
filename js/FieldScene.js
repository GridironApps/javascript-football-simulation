class FieldScene extends Phaser.Scene {
	constructor() {
		super(); //this is used to call the parent class Phaser.Scene
		this.px_per_yd = game.config.width / 120;
	}

	//load assets
	preload() {
		//load images
		this.load.image('field', 'assets/football-field.jpg');
		this.load.image('football', 'assets/football.png');
		this.load.image('red-dot', 'assets/red-circle-64.png');
		this.load.image('blue-dot', 'assets/blue-circle-64.png');

		this.offTeam = new Team('Offense Team', 'red-dot');
		this.offTeam.setOffensiveLineup(this, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTJwIgCS-T2qFvOjVAFo0TzBbUHxtWDxy60DWNED1gQeS8V43zI5toweqvyia2uuFK67xUlntvQMDjT/pub?gid=0&single=true&output=csv&headers=false');

		this.defTeam = new Team('Defense Team', 'blue-dot');
		this.defTeam.setDefensiveLineup(this, 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTJwIgCS-T2qFvOjVAFo0TzBbUHxtWDxy60DWNED1gQeS8V43zI5toweqvyia2uuFK67xUlntvQMDjT/pub?gid=1074706941&single=true&output=csv&headers=false');
	}

	//called once after preload ends
	create() {
		//create a scene variable so we can reference it when needed
		var scene = this;

		//create background sprite
		var background = this.add.sprite(0, 0, 'field');

		//change origin of background sprite
		background.setOrigin(0, 0);

		//scale background to fit
		background.setDisplaySize(game.config.width, game.config.height);

		//create ball from Ball class
		this.ball = new Ball(this, 60 * this.px_per_yd, 27 * scene.px_per_yd);

		//create camera to zoom in and follow ball
		this.cameras.main.startFollow(this.ball.body).setZoom(1);

		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0, game.config.width, game.config.height);

		//create a tooltip next to mouse cursor
		this.tooltip = scene.add.text(0, 0, '(0, 0)', { font: '12px Arial', fill: '#ffffff' })
			.setOrigin(0, 1);

		//add click handler that moves the ball around
		background.setInteractive();
		background.on('pointerdown', function () {

			var velocity = 120; // yd/s
			if (scene.ball.body.velocity.x != 0 || scene.ball.body.velocity.y != 0) {
				scene.ball.stop();
			} else {
				scene.ball.moveTo(scene.input.x, scene.input.y,velocity);
			}
		});

		this.physics.add.overlap(scene.ball, scene.offTeam.offensiveLineup, scene.catchBall, null, this); // */
	}

	//this will try to run 60 times per second
	update() {
		this.tooltip.setText('(' + Math.round(10 * this.input.x / this.px_per_yd) / 10 + ', ' + Math.round(10 * this.input.y / this.px_per_yd) / 10 + ')');
		this.tooltip.setPosition(this.input.x, this.input.y);
		this.ball.checkPosession();

		// loop through each offensive (and defensive, later) player and execute their top action
	}

	catchBall(ball, catcher) {
		if (!ball.posessed) {
			ball.caught(catcher);
			//alert("ball caught!");
		}
	}
}