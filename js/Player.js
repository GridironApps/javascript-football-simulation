class Player {
	constructor(scene, x, y, attributes, assignments) {
		this.scene = scene;

		//write attributes to object
		this.jersey = attributes.jersey;
		this.position = attributes.position; //FIXME position may not be the best name for this??? ID or role may be better....
		this.weight = attributes.weight;
		this.power = attributes.power;
		this.speed = attributes.speed;
		this.agility = attributes.agility;

		this.actions = new Array();
		this.parseActions(attributes.actions);


		//create a dot to put player on, easier to see
		var dot = scene.add.image(0, 0, this.jersey).setDisplaySize(1 * scene.px_per_yd, 1 * scene.px_per_yd);

		//create player with given text id
		var text = scene.add.text(0, 0, this.position, { font: '7px Arial', fill: '#ffffff' })
			.setOrigin(0.5, 0.5);

		//create a container at desired location for player
		var container = scene.add.container(x, y);

		//put text in container
		container.add(dot);
		container.add(text);

		//enable physics on container
		scene.physics.world.enable(container);

		//create pointer to physics body
		this.body = container.body;

		//give the body a circle collision boundary
		this.body.setCircle(4)
			.setCollideWorldBounds(true)
			.setMass(this.weight / 32.2)
			.setMaxVelocity(12.3 * this.scene.px_per_yd, 12.3 * this.scene.px_per_yd);
	}

	parseActions(actionString) {
		var nextAction = actionString.indexOf("[");
		while (nextAction > -1) {
			var endAction = actionString.indexOf("]", nextAction);
			var endActType = actionString.indexOf(",", nextAction);
			var actionOthers = null;
			if (endActType <= -1 || endActType > endAction) {
				endActType = endAction;
			}
			else {
				actionOthers = actionString.substring(endActType+1, endAction);
			}

			// determine which type of action, create it, and add it to the actions queue
			var actionType = actionString.substring(nextAction+1, endActType);
			if (actionType == "throw") {
				this.actions.push(new ThrowAction(actionOthers));
			}
			else if (actionType == "move") {
				this.actions.push(new MoveAction(actionOthers));
			}
			else if (actionType == "stop") {
				this.actions.push(new StopAction());
			}
			else {
				// unknown input, do nothing (error state once implementation is complete)
			}

			nextAction = actionString.indexOf("[", endAction);
		}
	}

	sprint() {
		const body = this.body;
		body.setAcceleration(54.9, 0); //549 N
	}

	slow() {
		const body = this.body;
		console.log(body.velocity.x);
		if (body.velocity.x > 1.5 * this.scene.px_per_yd) {
			body.setVelocityX(body.velocity.x * 0.88);
		} else {
			body.stop();
		}
	}
}