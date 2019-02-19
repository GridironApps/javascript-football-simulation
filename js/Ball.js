class Ball {
	constructor(scene, x, y) {
		this.scene = scene;

		// boolean variable, denotes if this ball is currently posessed by a player
		this.posessed = false;
		
		// the player who currently posesses the ball. Currently null if none (should be a better way?)
		this.posessedBy = null;

		//create ball sprite at given location
		var sprite = scene.physics.add.image(x, y, 'football').setDisplaySize(1.5 * 10 / 3 / 3 * this.scene.px_per_yd, 1.5 * 7 / 3 / 3 * this.scene.px_per_yd);

		//create pointer to physics body
		this.body = sprite.body;

		//set a few physics options for the ball
		this.body.setCollideWorldBounds(true)
			.setMass(1 / 32.2);
	}

	moveTo(x,y,v){
		//x and y are mouse pointer locations that are passed in as pixels
		//v is the magnitude of the velocity

		var dx = x - (this.body.x + this.body.halfWidth);
		var dy = y - (this.body.y + this.body.halfHeight);
		var h = Math.pow((dx*dx + dy*dy),0.5);    

		var vx = v*dx/h;
		var vy = v*dy/h;

		this.body.setVelocity(vx, vy);
	}

	stop(){
		this.body.stop();
	}

	// the ball is now posessed by the given player
	caught(catcher) {
		this.stop();
		this.posessed = true;
		this.posessedBy = catcher;
		this.body.x = catcher.body.x - this.body.halfWidth;
		this.body.y = catcher.body.y - this.body.halfHeight;
	}

	checkPosession() {
		if (this.posessed) {
			if (!this.scene.physics.world.overlap(this.posessedBy, this)) {
				this.posessed = false;
				this.posessedBy = null;
				//alert("ball released!");
			}
		}
	}// */
}