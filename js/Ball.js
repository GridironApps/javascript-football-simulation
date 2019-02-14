class Ball {
	constructor(scene, x, y) {
		this.scene = scene;

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
}