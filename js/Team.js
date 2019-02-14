class Team {
	constructor(name, jersey) {
		this.name = name;
		this.jersey = jersey;

		// lists of 11 players for offense and defense. 
		// should be eventually replaced with a single roster list and functions to pick the correct players for a givien lineup. 
		this.offensiveLineup = new Array();
		this.deffensiveLineup = new Array();
	}

	setOffensiveLineup(scene, linkToParse) {
		var team = this;

		//parse csv file to create offense
		Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vTJwIgCS-T2qFvOjVAFo0TzBbUHxtWDxy60DWNED1gQeS8V43zI5toweqvyia2uuFK67xUlntvQMDjT/pub?gid=0&single=true&output=csv&headers=false', {
			download: true,
			header: true,
			dynamicTyping: true,
			complete: function (offense) {
				console.log(offense);
				//create offensive group
				offense.data.forEach(function (player, index, array) {
					var attribute = {
						'jersey': 'red-dot',
						'position': player.id,
						'weight': player.weight,
						'power': player.power,
						'speed': player.speed,
						'agility': player.agility
					};
					team.offensiveLineup.push(new Player(scene, player.x * scene.px_per_yd, player.y * scene.px_per_yd, attribute));
				});
			}
		});
	}
}