//initialize the offense, this is a play and the assigned players, later this will only be the play and the player will be auto-pulled in
var offense = {
    'QB': {
        'job': {
            'handoff': {
                'target': 'RB',
                'direction' : 'right' //this is mostly for the play parser, but could effect the sim
            }
        },
        'attributes': {
            'speed': 4.8
        }
    },
    'FB': {
        'job': {
            'run_block': {
                'gaps': ['A+', 'B+']
            }
        },
        'attributes': {
            'speed': 4.6,
            'run_block': 40,
            'strength' : 40
        }
    },
    'RB': {
        'job': {
            'run': {
                'target': ['A+', 'B+'],
                'bounce': ['D+']
            }
        },
        'attributes': {
            'speed': 4.5
        }
    },
    'LT': {
        'job': {
            'run_block': {
                'gaps': ['C-']
            }
        },
        'attributes': {
            'speed': 4.8,
            'run_block': 70,
            'strength' : 70
        }
    },
    'LG': {
        'job': {
            'run_block': {
                'gaps': ['B-']
            }
        },
        'attributes': {
            'speed': 5.2,
            'run_block': 80,
            'strength' : 75
        }
    },
    'OC': {
        'job': {
            'run_block': {
                'gaps': ['A-']
            }
        },
        'attributes': {
            'speed': 4.9,
            'run_block': 75,
            'strength' : 60
        }
    },
    'RG': {
        'job': {
            'run_block': {
                'gaps': ['A+', 'B+']
            }
        },
        'attributes': {
            'speed': 5.0,
            'run_block': 75,
            'strength' : 80
        }
    },
    'RT': {
        'job': {
            'run_block': {
                'gaps': ['C+']
            }
        },
        'attributes': {
            'speed': 5.0,
            'run_block': 75,
            'strength' : 70
        }
    },
    'TE': {
        'job': {
            'run_block': {
                'gaps': ['D+']
            }
        },
        'attributes': {
            'speed': 4.6,
            'run_block': 50,
            'strength' : 50
        }
    },
    'W1': {
        'job': {
            'run_block': {
                'gaps': ['E-'] //E is for edge or contain
            }
        },
        'attributes': {
            'speed': 4.4,
            'run_block': 20,
            'strength' : 30
            
        }
    },
    'W2': {
        'job': {
            'run_block': {
                'gaps': ['E+']
            }
        },
        'attributes': {
            'speed': 4.3,
            'run_block' : 10,
            'strength' : 15
        }
    }
};

//initialize the defense
defense = {
    'RE': {
        'job' : {
            'gap' : 'C-'  // job -> (defend-gap -> C-), (pash-rush OR cover-man OR cover-zone)
        },
        'attributes' : {
            'read': 50,
            'speed': 4.6,
            'shed' : 80,
            'strength' : 60
        }        
    },
    'NT': {
        'job' : {
            'gap' : 'A-'
        },
        'attributes' : {
            'read': 50,
            'speed': 5.2,
            'shed' : 50,
            'strength' : 90
        }
    },
    'DT': {
        'job' : {
            'gap' : 'B+'
        },
        'attributes' : {
            'read': 50,
            'speed': 5.0,
            'shed' : 70,
            'strength' : 80
        }
    },
    'LE': {
        'job' : {
            'gap' : 'D+'
        },
        'attributes' : {
            'read': 50,
            'speed': 4.8,
            'shed' : 75,
            'strength' : 70
        }
    },
    'WB': {
        'job' : {
            'gap' : 'B-'
        },
        'attributes' : {
            'read': 50,
            'speed': 4.5,
            'shed' : 40,
            'strength' : 40
        }
    },
    'MB': {
        'job' : {
            'gap' : 'A+'
        },
        'attributes' : {
            'read': 50,
            'speed': 4.6,
            'shed' : 60,
            'strength' : 60
        }
    },
    'SB': {
        'job' : {
            'gap' : 'C+'
        },
        'attributes' : {
            'read': 50,
            'speed': 4.6,
            'shed' : 50,
            'strength' : 50
        }
    },
    'C1': {
        'job' : {
            'gap' : 'E-' //E is for edge or contain
        },
        'attributes' : {
            'read': 50,
            'speed': 4.3,
            'shed' : 20,
            'strength' : 10
        }
    },
    'FS': {
        'job' : {
            'gap' : 'D-'
        },
        'attributes' : {
            'read': 50,
            'speed': 4.4,
            'shed' : 30,
            'strength' : 25
        }
    },
    'SS': {
        'job' : {
            'gap' : 'free'
        },
        'attributes' : {
            'read': 50,
            'speed': 4.5,
            'shed' : 40,
            'strength' : 35
        }
    },
    'C2': {
        'job' : {
            'gap' : 'E+'
        },
        'attributes' : {
            'read': 50,
            'speed': 4.4,
            'shed' : 15,
            'strength' : 10
        }
    }
};

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

//calculate approximate defender locations, ball is at 0,0, units are yards
for (row = 4; row > -1; row--) {
    for (col = 0; col < 27; col++) {
        var pos = d_formation[row][col];
        if (pos !== '__') {
            var h = horizontal[col];
            var v = d_vertical[row];
            defense[pos].location = [h, v];
        }
    }
}

//calculate approximate location of offensive player
for (row = 0; row < 5; row++) {
    for (col = 0; col < 27; col++) {
        var pos = o_formation[row][col];
        if (pos !== '__') {
            var h = horizontal[col];
            var v = o_vertical[row];
            offense[pos].location = [h, v];
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