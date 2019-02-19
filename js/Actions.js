// single file for all player action classes

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

	execute(player) {
		// move the player
	}
}