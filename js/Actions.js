// single file for all player action classes
// All Actions have an execute() function which takes a Player object and the FieldScene object

class MoveAction {
	constructor(coordinateString) {
		var endFirstVar = coordinateString.indexOf(",");
		var endSecondVar = coordinateString.indexOf(",", endFirstVar+1);
		if (endSecondVar <= -1) {
			endSecondVar = coordinateString.length;
		}
		this.xcoord = parseInt(coordinateString.substring(0, endFirstVar));
		this.ycoord = parseInt(coordinateString.substring(endFirstVar+1, endSecondVar));
	}

	execute(player, scene) {
		// move the player
	}
}

class ThrowAction {
	constructor(coordinateString) {
		var endFirstVar = coordinateString.indexOf(",");
		var endSecondVar = coordinateString.indexOf(",", endFirstVar+1);
		if (endSecondVar <= -1) {
			endSecondVar = coordinateString.length;
		}
		this.ballXcoord = parseInt(coordinateString.substring(0, endFirstVar));
		this.ballYcoord = parseInt(coordinateString.substring(endFirstVar+1, endSecondVar));
	}

	execute(player, scene) {
		// throw the ball
	}
}

class StopAction {
	constructor() {
		// no values, do nothing
	}

	execute(player, scene) {

	}
}