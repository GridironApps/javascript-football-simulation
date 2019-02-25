// single file for all player action classes
// All Actions have: 
// a constructor which sets the executing variable to false
// an execute() function which takes a Player object and the FieldScene object


// Move the player from one point to another
class MoveAction {
	constructor(coordinateString) {
		var endFirstVar = coordinateString.indexOf(",");
		var endSecondVar = coordinateString.indexOf(",", endFirstVar+1);
		if (endSecondVar <= -1) {
			endSecondVar = coordinateString.length;
		}
		this.xcoord = parseInt(coordinateString.substring(0, endFirstVar));
		this.ycoord = parseInt(coordinateString.substring(endFirstVar+1, endSecondVar));

		this.executing = false;
	}

	execute(player, scene) {
		if (this.executing) {
			if (player.body.x == this.xcoord && player.body.y == this.ycoord) {
				// terminate: pop this action off the stack
				player.actions.shift();
			}
		}
		else {
			this.executing = true;
			player.sprint();
			console.log("running to (" + this.xcoord + ", " + this.ycoord + ")");
		}
	}
}

// throw a ball to a specified point
class ThrowAction {
	constructor(coordinateString) {
		var endFirstVar = coordinateString.indexOf(",");
		var endSecondVar = coordinateString.indexOf(",", endFirstVar+1);
		if (endSecondVar <= -1) {
			endSecondVar = coordinateString.length;
		}
		this.ballXcoord = parseInt(coordinateString.substring(0, endFirstVar));
		this.ballYcoord = parseInt(coordinateString.substring(endFirstVar+1, endSecondVar));

		this.executing = false;
	}

	execute(player, scene) {
		if (this.executing) {
			player.actions.shift();
			console.log("Finished throwing the ball");
		}
		else {
			this.executing = true;
			scene.ball.moveTo(scene.yardsToPx(this.ballXcoord), scene.yardsToPx(this.ballYcoord), 120);
			console.log("Throwing the ball to (" + this.ballXcoord + ", " + this.ballYcoord + ")");
		}
	}
}

// make the player come to a stop
class StopAction {
	constructor() {
		this.executing = false;
	}

	execute(player, scene) {
		this.executing = true;
		player.slow();
		console.log("Stopping");
	}
}