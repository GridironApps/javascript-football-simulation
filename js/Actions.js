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

		this.initPlayerX = -1;
		this.initPlayerY = -1;

		this.executing = false;
	}

	execute(player, scene) {
		if (this.executing) {
			if (this.checkPastTarget(scene.pxToYards(player.body.x), scene.pxToYards(player.body.y))) {
				// terminate: pop this action off the stack
				player.actions.shift();
				console.log(player.position + " reached target point");
			}
			else {
				player.sprintTo(scene.yardsToPx(this.xcoord), scene.yardsToPx(this.ycoord));
			}
		}
		else {
			this.executing = true;
			// get the player's initial position for comparison purposes
			this.initPlayerX = scene.pxToYards(player.body.x);
			this.initPlayerY = scene.pxToYards(player.body.y);
			//console.log("Player started at (" + this.initPlayerX + ", " + this.initPlayerY + ")");

			player.sprintTo(scene.yardsToPx(this.xcoord), scene.yardsToPx(this.ycoord));
			console.log(player.position + " running to (" + this.xcoord + ", " + this.ycoord + ")");
		}
	}

	// check if the given point is at or past the target point (give or take half a yard)
	checkPastTarget(currentX, currentY, scene) {
		var xReach;
		var yReach;
		var margin = 0.5;
		//console.log("Player at (" + currentX + ", " + currentY + "), target point is (" + this.xcoord + ", " + this.ycoord + ")");
		if (this.initPlayerX >= this.xcoord) {
			xReach = currentX <= this.xcoord + margin;
		}
		else {
			xReach = currentX >= this.xcoord - margin;
		}

		if (this.initPlayerY >= this.ycoord) {
			yReach = currentY <= this.ycoord + margin;
		}
		else {
			yReach = currentY >= this.ycoord - margin;
		}

		return xReach && yReach;
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
			console.log(player.position + " finished throwing the ball");
		}
		else {
			this.executing = true;
			scene.ball.moveTo(scene.yardsToPx(this.ballXcoord), scene.yardsToPx(this.ballYcoord), scene.yardsToPx(player.throwVelocity));
			console.log(player.position + " throwing the ball to (" + this.ballXcoord + ", " + this.ballYcoord + ")");
		}
	}
}

// make the player come to a stop
class StopAction {
	constructor() {
		this.executing = false;
	}

	execute(player, scene) {
		if (this.executing) {
			if (player.body.velocity.x == 0 && player.body.velocity.y == 0) {
				player.actions.shift();
				console.log(player.position + " stopped");
			}
			else {
				player.slow();
			}
		}
		else {
			this.executing = true;
			player.slow();
			console.log(player.position + " Stopping");
		}
	}
}