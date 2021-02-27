//need a function to convert input file(?) to json data

//TODO in the near term update this to match the job types (handoff, run, run_block, pass_block, run_route, catch, throw, shed_blocker, tackle, cover_man, cover_zone)

//TODO work in style of pass: quick, normal, timing, long, play-action

//TODO update code to accept fit-gap

//FIXME need to target recievers in a more general sense

//for the function below just assume the data is already formatted in a json object (above)
function simulateRun(o, d) {
    //
    // OFFENSE
    //

    //setup log file to return
    let log = [];

    //get target zone for runner
    let target_zone;
    for (const pos in o) {
        if (o[pos].job === 'run') {
            target_zone = o[pos].run_zone; //FIXME future things could break if this is an array
            log.push('Runner is ' + pos);
            log.push('Run is targeting zone ' + target_zone);
        }
    }

    //re-scale importance so it adds up to 100%  //TODO should probably chunk these into a blocking, running, handoff groups first
    let temp_sum = 0;
    for (const pos in o) {
        temp_sum += o[pos].importance;
    }
    for (const pos in o) {
        o[pos].importance = o[pos].importance / temp_sum;
    }

    //roll dice for each offensive player and calculate their scores
    let temp_score = 0;
    for (const pos in o) {
        o[pos].roll = roll(o[pos].run_dice);
        o[pos].score = o[pos].roll * o[pos].importance;
        temp_score += o[pos].score;
    }
    o.score = temp_score;

    //
    // DEFENSE
    //

    //assign importance to each rushing zone based on the targeted zone of the run play
    let zone_importance;
    switch (target_zone) {
        case (1):
            zone_importance = [8, 4, 4, 2, 1, 1]; //no need to scale yet, we will rescale everything at once later
            break;
        case (2):
            zone_importance = [2, 8, 4, 2, 1, 1];
            break;
        case (3):
            zone_importance = [1, 4, 8, 4, 2, 1];
            break;
        case (4):
            zone_importance = [1, 2, 4, 8, 4, 1];
            break;
        case (5):
            zone_importance = [1, 1, 2, 4, 8, 2];
            break;
        case (6):
            zone_importance = [1, 1, 2, 4, 4, 8];
            break;
        default:
            //we should never make it here
            console.log('run_zone for offense is not defined properly');
    }

    //get run direction
    var run_direction;
    if (target_zone >= 4 && target_zone <= 6) {
        run_direction = 'right';
    } else if (target_zone >= 1 && target_zone <= 3) {
        run_direction = 'left';
    }

    //assign zone importance to each defender //TODO eventually it would be a good idea to build the zones up with players so I can check zone by zone instead of an entire group roll
    for (const pos in d) {
        let assignment = d[pos]['run_' + run_direction];

        //get defender_zone
        let defender_zones = [];
        if (assignment.job == 'fit-zone') {
            defender_zones = assignment.run_zones;
        } else if (assignment.job == 'pursue') {
            defender_zones = target_zone;
        }

        //loop through all zones the defender is in and average the importance
        let temp_importance = 0;
        if (defender_zones.length > 0) {
            //in this case there is an array
            for (const z of defender_zones) {
                temp_importance += zone_importance[z - 1];
            }
            temp_importance = temp_importance / defender_zones.length;
        } else {
            //in this case there is a single value
            temp_importance = zone_importance[defender_zones - 1];
        }
        d[pos].importance = temp_importance;        
    }

    //re-scale importance so it adds up to 100%
    temp_sum = 0;
    for (const pos in d) {
        temp_sum += d[pos].importance;
    }
    for (const pos in d) {
        d[pos].importance = d[pos].importance / temp_sum;
    }

    //roll dice for each defensive player and calculate their scores
    temp_score = 0;
    for (const pos in d) {
        d[pos].roll = roll(d[pos].run_dice);
        d[pos].score = d[pos].roll * d[pos].importance;
        temp_score += d[pos].score;
    }
    d.score = temp_score;

    //TODO concievbly we could have run_dice and pass_dice or multiple run_dices for option type plays, the QB would be responsible for choosing ... this should actually be based on the defense, but passing might look at offensive rolls for reads

    return {
        offense: o,
        defense: d,
        log: log
    }

}

function simulatePass(o, d) {
    //setup constants
    const SHORT_ZONE_END = 20;
    const DEEP_ZONE_START = 10;

    //setup a log file to display later
    let log = [];

    //initialize pass coverage mapping arrays
    for (const pos in o) {
        if (pos == 'play') {
            continue;
        }
        o[pos].covered_by = [];
    }

    for (const pos in d) {
        d[pos].covering = [];
    }

    //get pass thrower
    let pass_thrower;
    for (const pos in o) {
        if (pos == 'play') {
            continue;
        }
        if (o[pos].job == 'throw') {
            pass_thrower = pos;
            break;
            //there can be only one pass_thrower
        }
    }
    log.push('Pass thrower is ' + pass_thrower);

    // get pass blockers
    let pass_blockers = [];
    for (const pos in o) {
        if (pos == 'play') {
            continue;
        }
        if (o[pos].job == 'block') {
            pass_blockers.push(pos);
        }
    }
    log.push('Pass blockers are ' + pass_blockers);

    // get recievers
    let pass_catchers = [];
    for (const pos in o) {
        if (pos == 'play') {
            continue;
        }
        if (o[pos].job == 'run-route') {
            pass_catchers.push(pos);
        }
    }
    log.push('Pass catchers are ' + pass_catchers);

    //get initial pass rushers
    let pass_rushers = [];
    for (const pos in d) {
        if (d[pos].pass.job == 'rush') {
            pass_rushers.push(pos);
        }
    }
    log.push('Initial pass rushers are ' + pass_rushers);

    //get pass defenders
    let pass_defenders = [];

    // map man-coverage guys to recievers    
    for (const pos in d) {
        if (d[pos].pass.job == 'cover-man') {
            if (pass_catchers.includes(d[pos].pass.target_player)) {
                pass_defenders.push(pos);

                d[pos].covering.push({
                    player: d[pos].pass.target_player,
                    zone: o[d[pos].pass.target_player].catch_zone,
                    depth: o[d[pos].pass.target_player].catch_depth
                });

                o[d[pos].pass.target_player].covered_by.push({
                    player: pos,
                    type: 'man'
                });

            } else {
                //pass rush through assignment since their guy is blocking
                pass_rushers.push(pos);
                log.push(pos + ' has no one to cover and is rushing the passer.')
            }
        }
    }

    // map zone-coverage guys to recievers
    for (const pos in d) {
        if (d[pos].pass.job == 'cover-zone') {
            pass_defenders.push(pos);

            //check each pass_catcher vs zone responsibilities
            for (const rec of pass_catchers) {
                //check deep_zones
                if (d[pos].pass.deep_zones.includes(o[rec].catch_zone) && o[rec].catch_depth >= DEEP_ZONE_START) {
                    d[pos].covering.push({
                        player: rec,
                        zone: o[rec].catch_zone,
                        depth: o[rec].catch_depth
                    });
                    o[rec].covered_by.push({
                        player: pos,
                        type: 'deep-zone'
                    });
                }

                //check short zones ... defender can show up for both cases
                if (d[pos].pass.short_zones.includes(o[rec].catch_zone) && o[rec].catch_depth <= SHORT_ZONE_END) {
                    d[pos].covering.push({
                        player: rec,
                        zone: o[rec].catch_zone,
                        depth: o[rec].catch_depth
                    });
                    o[rec].covered_by.push({
                        player: pos,
                        type: 'short-zone'
                    });
                }
            }
        }
    }
    log.push('Pass defenders are ' + pass_defenders);

    //
    // DICE rolling time
    //

    //scale offense importance so adds up to 100%
    let temp_sum = 0;
    for (const pos in o) {
        if (pos == 'play') {
            continue;
        }
        temp_sum += o[pos].importance;
    }
    for (const pos in o) {
        o[pos].importance = o[pos].importance / temp_sum;
    }

    //roll dice for pass_thrower and calculate weighted score
    o[pass_thrower].roll = roll(o[pass_thrower].pass_dice);
    o[pass_thrower].score = o[pass_thrower].roll * o[pass_thrower].importance;
    log.push('The ' + pass_thrower + ' generated a score of ' + o[pass_thrower].score.toFixed(1));

    //roll dice for pass blockers and calculate weighted scores
    let pass_block_score = 0;
    for (const pos of pass_blockers) {
        o[pos].roll = roll(o[pos].pass_dice);
        o[pos].score = o[pos].roll * o[pos].importance;
        pass_block_score += o[pos].score;
    }
    log.push('The pass blockers generated a score of ' + pass_block_score.toFixed(1));

    //calculate pass blocker importance so we can use it for pass rushers
    temp_sum = 0;
    for (const pos of pass_blockers) {
        temp_sum += o[pos].importance;
    }

    //setup importance for pass rushers, assume all pass rushers are equally important
    for (const pos of pass_rushers) {
        d[pos].importance = temp_sum / pass_blockers.length; //we use the number of pass_blockers instead of pass_rushers to capture the impact of more or less pass rushers
    }

    //roll dice for pass rushers and calculate weighted scores
    let pass_rush_score = 0;
    for (const pos of pass_rushers) {
        d[pos].roll = roll(d[pos].pass_dice);
        d[pos].score = d[pos].roll * d[pos].importance;
        pass_rush_score += d[pos].score;
    }
    log.push('The pass rushers generated a score of ' + pass_rush_score.toFixed(1));

    //roll dice for pass_defenders and initialize score ... weights and score updated per matchup ... a guy covering no one will have a score of 0
    for (const pos of pass_defenders) {
        d[pos].roll = roll(d[pos].pass_dice);
        d[pos].score = 0;
    }

    //roll dice for recievers and calculate weighted scores
    let pass_catch_score = 0;
    let pass_defense_score = 0;
    for (const pos of pass_catchers) {
        o[pos].roll = roll(o[pos].pass_dice);
        o[pos].score = o[pos].roll * o[pos].importance;
        pass_catch_score += o[pos].score;

        //calculate a coverage score
        for (const cvr of o[pos].covered_by) {

            //get initial defender score (i.e. roll) based on coverage type
            cvr.score = 0;
            if (cvr.type == 'man') {
                cvr.score = d[cvr.player].roll;
            } else if (cvr.type == 'short-zone') {
                if (o[pos].catch_depth < DEEP_ZONE_START) {
                    cvr.score = d[cvr.player].roll;
                } else {
                    let slope = (20 - 80) / (SHORT_ZONE_END - DEEP_ZONE_START);
                    cvr.score = d[cvr.player].roll * (80 + slope * (o[pos].catch_depth - DEEP_ZONE_START)) / 100;
                }
            } else if (cvr.type == 'deep-zone') {
                if (o[pos].catch_depth > SHORT_ZONE_END) {
                    cvr.score = d[cvr.player].roll;
                } else {
                    let slope = (80 - 20) / (SHORT_ZONE_END - DEEP_ZONE_START);
                    cvr.score = d[cvr.player].roll * (20 + slope * (o[pos].catch_depth - DEEP_ZONE_START)) / 100
                }
            } else {
                Error('Unknown coverage type.')
            }

            //modify the score by the recivers importance
            cvr.score *= o[pos].importance;

            //store the score
            d[cvr.player].score += cvr.score;
            pass_defense_score += cvr.score;
        }
    }
    log.push('The pass catchers generated a score of ' + pass_catch_score.toFixed(1));
    log.push('The pass defenders generated a score of ' + pass_defense_score.toFixed(1));

    //
    // calculate results
    //

    /*

    let non_thrower_importance = 1 - o[pass_thrower].importance;
    switch (o[pass_thrower].drop) {
        case '3-step':
            o.score = (0.3 * pass_block_score + 0.7 * pass_catch_score) * non_thrower_importance + o[pass_thrower].score;
            d.score = 0.3 * pass_rush_score + 0.7 * pass_defense_score;
            break;
        case '7-step':
            o.score = (0.7 * pass_block_score + 0.3 * pass_catch_score) * non_thrower_importance + o[pass_thrower].score;
            d.score = 0.7 * pass_rush_score + 0.3 * pass_defense_score;
            break;
        default:
            // 5-step lives here along with any uncaught cases
            o.score = (0.5 * pass_block_score + 0.5 * pass_catch_score) * non_thrower_importance + o[pass_thrower].score;
            d.score = 0.5 * pass_rush_score + 0.5 * pass_defense_score;
    }
    */
    o.score = o[pass_thrower].score + pass_block_score + pass_catch_score;
    d.score = pass_rush_score + pass_defense_score;

    return {
        offense: o,
        defense: d,
        log: log
    }

}

//
// UTILITY function to roll dice
//

function roll(dice_size) {
    return dice_size;
    //use this to remove all randomness    
    //return Math.random() * dice_size;
}