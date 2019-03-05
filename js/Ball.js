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
		console.log("Ball caught by " + catcher.position);
	}

	// check if the ball is still within the posession of (meaning, still overlaps with) a player
	checkPosession() {
		if (this.posessed) {
			if (!this.scene.physics.world.overlap(this.posessedBy, this)) {
				console.log("ball released by " + this.posessedBy);
				this.posessed = false;
				this.posessedBy = null;
			}
		}
	}

	// check if the ball is posessed by a player and not being thrown, then ensure that the ball is located in the same place as that player
	moveWithPlayer() {
		if (this.posessed && this.body.velocity.x == 0 && this.body.velocity.y == 0) {
			//console.log("ball posessed and motionless");
			this.body.x = this.posessedBy.body.x - this.body.halfWidth;
			this.body.y = this.posessedBy.body.y - this.body.halfHeight;
		}
		/*else if (this.posessed) {
			console.log("posessed, but vx = " + this.body.velocity.x + ", vy = " + this.body.velocity.y);
		} // */
	}
}