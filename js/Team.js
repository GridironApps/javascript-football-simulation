class Team {
	constructor(name, jersey) {
		this.name = name;
		this.jersey = jersey;

		// lists of 11 players for offense and defense. 
		// should be eventually replaced with a single roster list and functions to pick the correct players for a givien lineup. 
		this.offensiveLineup = new Array();
		this.deffensiveLineup = new Array();
	}
}