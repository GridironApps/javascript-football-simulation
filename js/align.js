//replace gap with location for defense
var gap = {
    'A-strong': [1, 0],
    'B-strong': [3, 0],
    'C-strong': [5, 0],
    'D-strong': [7, 0],
    'contain-strong': [9, 0],
    'A-weak': [-1, 0],
    'B-weak': [-3, 0],
    'C-weak': [-5, 0],
    'D-weak': [-7, 0],
    'contain-weak': [-9, 0]
};
for (pos in defense) {
    var g = defense[pos].gap;
    if (typeof (gap[g]) !== 'undefined') {
        defense[pos].gap = gap[g];
    } else {
        defense[pos].gap = defense[pos].location;
    }
}