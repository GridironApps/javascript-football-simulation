//add starting location for offense & defense, PLAYER TAGS MUST MATCH
var horizontal = [-22, -19, -16, -13, -11, -9, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 13, 16, 19, 22];
var d_vertical = [12, 8, 4, 1, 0.5];
var o_vertical = [-0.5, -1, -4, -8, -12];

var d_formation = [
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', 'FS', '__', '__', '__', '__', '__', '__', '__', 'SS', '__', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', 'WB', '__', '__', '__', 'MB', '__', '__', '__', 'SB', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', 'C1', '__', '__', '__', '__', '__', '__', 'RE', '__', '__', '__', 'NT', '__', '__', '__', 'DT', '__', '__', '__', 'LE', '__', '__', '__', '__', 'C2', '__']
];

var o_formation = [
    ['__', 'W1', '__', '__', '__', '__', '__', '__', '__', 'LT', '__', 'LG', '__', 'OC', '__', 'RG', '__', 'RT', '__', 'TE', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', 'QB', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', 'W2', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', 'FB', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', 'RB', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__'],
    ['__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__', '__']
];

//calculate approximate starting locations for defender, ball is at 0,0, units are yards
for (row = 4; row > -1; row--) {
    for (col = 0; col < 27; col++) {
        var pos = d_formation[row][col];
        if (pos !== '__') {
            var h = horizontal[col];
            var v = d_vertical[row];
            defense[pos].location = [h, v];
            defense[pos].delay = 0;
        }
    }
}

//calculate approximate starting location of offensive player
for (row = 0; row < 5; row++) {
    for (col = 0; col < 27; col++) {
        var pos = o_formation[row][col];
        if (pos !== '__') {
            var h = horizontal[col];
            var v = o_vertical[row];
            offense[pos].location = [h, v];
            offense[pos].delay = 0;
        }
    }
}

//print defense alignment to page
for (row = 0; row < d_formation.length; row++) {
    var text = '';
    for (col = 0; col < d_formation[row].length; col++) {
        text += d_formation[row][col];
    }
    $('#field').append(text).append('<br />');
}

//print offense alignment to page
for (row = 0; row < o_formation.length; row++) {
    var text = '';
    for (col = 0; col < o_formation[row].length; col++) {
        text += o_formation[row][col];
    }
    $('#field').append(text).append('<br />');
}