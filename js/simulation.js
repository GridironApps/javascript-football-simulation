//need a function to convert input file(?) to json data

//TODO in the near term update this to match the job types (handoff, run, run_block, pass_block, run_route, catch, throw, shed_blocker, tackle, cover_man, cover_zone)

//TODO work in style of pass: quick, normal, timing, long, play-action

//FIXME need to target recievers in a more general sense

//for the function below just assume the data is already formatted in a json object (above)
function simulateRun(o, d) {

    //setup log file to return
    let log = [];

    //
    // OFFENSE
    //

    //get target zone for runner
    let target_zone;
    let runner;
    for (const pos in o) {
        if (o[pos].job === 'run') {
            runner = pos;
            target_zone = o[pos].target_zone; //FIXME future things could break if this is an array
            log.push('Runner is ' + pos);
            log.push('Run is targeting zone ' + target_zone);
            break; //assuming only one player has the job "run"
        }
    }

    //ignoring "handoff" job for now, should check that it exists though...could be a pitch

    //initialize blocking matchups for each possible zone ... zones roughly correspond to location of pre-snap gaps
    const ZONES = ["E-", "D-", "C-", "B-", "A-", "A+", "B+", "C+", "D+", "E+"];
    let blocking_matchup = {};
    for (const ZONE of ZONES) {
        blocking_matchup[ZONE] = {};
        blocking_matchup[ZONE].score = 0; // + is good for offense, - is good for defense
        blocking_matchup[ZONE].blockers = [];
        blocking_matchup[ZONE].defenders = [];
    }

    //get run blockers
    let run_blockers = [];
    for (const POS in o) {
        if (o[POS].job === "run-block") {
            run_blockers.push(POS);

            //write assignment to blocking matchup object
            for (const ZONE of o[POS].blocking_zones) {
                blocking_matchup[ZONE].blockers.push(POS);
            }
        }
    }
    log.push('Run blockers are ' + run_blockers);

    //
    // DEFENSE
    //

    //get run direction
    var run_direction;
    switch (target_zone) {
        case ("E-"):
            run_direction = 'left';
            break;
        case ("D-"):
            run_direction = 'left';
            break;
        case ("C-"):
            run_direction = 'left';
            break;
        case ("B-"):
            run_direction = 'left';
            break;
        case ("A-"):
            run_direction = 'left';
            break;
        case ("A+"):
            run_direction = 'right';
            break;
        case ("B+"):
            run_direction = 'right';
            break;
        case ("C+"):
            run_direction = 'right';
            break;
        case ("D+"):
            run_direction = 'right';
            break;
        case ("E+"):
            run_direction = 'right';
            break;
        default:
            console.log('Not able to determine run direction.');
    }

    //assign defenders to rushing zones
    for (const POS in d) {
        //get assignment based on run direction
        const ASSIGNMENT = d[POS]['run_' + run_direction];

        //get rush_zone responsibliity
        let rush_zones;
        if (ASSIGNMENT.job == 'fit-zones') {
            rush_zones = ASSIGNMENT.rush_zones;
        } else if (ASSIGNMENT.job == 'pursue') {
            rush_zones = [target_zone];
        }

        //store rush_zones in player object
        d[POS].defending_zones = rush_zones;

        //write assignment to blocking matchup object
        for (const ZONE of rush_zones) {
            blocking_matchup[ZONE].defenders.push(POS);
        }
    }

    //write matchups to players

    //
    // Roll Dice
    //

    //generate rushing_score for runner
    o[runner].rushing_score = roll(o[runner].running, o[runner].consistency);

    //generate score for each blocker
    for (const POS of run_blockers) {
        o[POS].run_blocking_score = roll(o[POS].run_blocking, o[POS].consistency);
    }

    //generate scores for each defender
    for (const POS in d) {
        d[POS].run_defense_score = roll(d[POS].shedding, d[POS].consistency);
        d[POS].tackling_score = roll(d[POS].tackling, d[POS].consistency);
    }

    //generate a matchup score for each rushing zone
    for (const ZONE in blocking_matchup) {
        const MATCHUP = blocking_matchup[ZONE];

        //blockers
        for (const BLOCKER of MATCHUP.blockers) {
            MATCHUP.score += (o[BLOCKER].run_blocking_score / o[BLOCKER].blocking_zones.length);
        }

        //defenders
        for (const DEFENDER of MATCHUP.defenders) {
            MATCHUP.score -= (d[DEFENDER].run_defense_score / d[DEFENDER].defending_zones.length);
        }
    }

    //
    // Simulate Play
    //

    let tackled = false;

    //FIXME assuming handoff, pitch might get us outside the A-gap zone
    let tfl_zones;
    if (run_direction == 'right') {
        //check these in order for TFL    //TODO add starting depth to help with the matchups ... deeper guys won't make TFLs
        tfl_zones = ['A+', 'B+', 'C+', 'D+', 'E+'];
    } else if (run_direction == 'left') {
        tfl_zones = ['A-', 'B-', 'C-', 'D-', 'E-'];
    }

    for (const ZONE of tfl_zones) {

        //if the matchup score is negative, the defenders have a chance at a TFL
        if (blocking_matchup[ZONE].score < 0) {
            //log the penetration
            log.push('Good penetration in zone ' + ZONE);

            //calculate a tackle score
            let tackle_score = 0;
            for (const DEFENDER of blocking_matchup[ZONE].defenders) {
                tackle_score += (d[DEFENDER].tackling_score / d[DEFENDER].defending_zones.length);
            }

            //check for a tackle //FIXME might check and see if we can run down the runner first
            if (tackle_score > o[runner].rushing_score) {
                //figure out who makes the tackle
                let tackler;
                let tackler_score = 0;
                for (const DEFENDER of blocking_matchup[ZONE].defenders) {
                    let temp_score = (d[DEFENDER].run_defense_score + d[DEFENDER].tackling_score) / d[DEFENDER].defending_zones.length;
                    if (temp_score > tackler_score) {
                        tackler = DEFENDER;
                        tackler_score = temp_score;
                    }
                }
                log.push('The ' + tackler + ' tackles the ' + runner + ' for a loss.');
                tackled = true;
                break;

            } else {
                log.push('The ' + runner + ' was able to avoid it.')
            }
        }

        //stop checking once we get to the target zone
        if (ZONE === target_zone) {
            break;
        }
    }

    if (!tackled) {

        //note that the runner has made it to the LOS
        log.push('The ' + runner + ' runs through the ' + target_zone + ' zone');
        //check for minimal gain ... tackle in target gap

        //calculate a tackle score
        let tackle_score = 0;
        for (const DEFENDER of blocking_matchup[target_zone].defenders) {
            tackle_score += (d[DEFENDER].tackling_score / d[DEFENDER].defending_zones.length);
        }

        //check for a tackle //FIXME might check and see if we can run down the runner first
        if (tackle_score > o[runner].rushing_score) {
            //figure out who makes the tackle
            let tackler;
            let tackler_score = 0;
            for (const DEFENDER of blocking_matchup[target_zone].defenders) {
                let temp_score = d[DEFENDER].tackling_score / d[DEFENDER].defending_zones.length;
                if (temp_score > tackler_score) {
                    tackler = DEFENDER;
                    tackler_score = temp_score;
                }
            }
            log.push('The ' + tackler + ' tackles the ' + runner + ' for a minimal gain.');
            tackled = true;
        }

    }

    if (!tackled) {
        //check these in order for gain
        let right_zones = ZONES.slice(ZONES.indexOf(target_zone) + 1, ZONES.length);
        let left_zones = ZONES.slice(0, ZONES.indexOf(target_zone)).reverse();

        for (let i = 0; i < ZONES.length; i++) {
            let a = blocking_matchup[right_zones[i]];
            let b = blocking_matchup[left_zones[i]];
            let defenders = [];
            if (a) {
                defenders.concat(a.defenders);
            }
            if (b) {
                defenders.concat(b.defenders);
            }
            //FIXME i could have the same player in both group a and group b

            let tackle_score = 0;
            for (const DEFENDER of defenders) {
                tackle_score += (d[DEFENDER].tackling_score / d[DEFENDER].defending_zones.length);
            }

            //check for a tackle //FIXME might check and see if we can run down the runner first
            if (tackle_score > o[runner].rushing_score) {
                //figure out who makes the tackle
                let tackler;
                let tackler_score = 0;
                for (const DEFENDER of defenders) {
                    let temp_score = d[DEFENDER].tackling_score / d[DEFENDER].defending_zones.length;
                    if (temp_score > tackler_score) {
                        tackler = DEFENDER;
                        tackler_score = temp_score;
                    }
                }
                log.push('The ' + tackler + ' tackles the ' + runner + ' for a ' + (i + 2) + ' yard gain.');
                tackled = true;
                //runner is tackled ... stop checking
                break;
            }
        }
    }

    //TODO check for touchdown
    if(!tackled){
        log.push('The ' + runner + ' runs for a TOUCHDOWN!');
    }

    //TODO conceivibly we could have run_dice and pass_dice or multiple run_dices for option type plays, the QB would be responsible for choosing ... this should actually be based on the defense, but passing might look at offensive rolls for reads

    return {
        offense: o,
        defense: d,
        matchup: blocking_matchup,
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

    //get the quarterback based scaling for the pass rush and pass defense groups
    let def_qb_scalar = 1 / (1 - o[pass_thrower].importance);

    //setup importance for pass rushers, assume all pass rushers are equally important
    for (const pos of pass_rushers) {
        d[pos].importance = def_qb_scalar * temp_sum / pass_blockers.length; //we use the number of pass_blockers instead of pass_rushers to capture the impact of more or less pass rushers
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
            cvr.score *= o[pos].importance * def_qb_scalar;

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

function roll(dice_size, dice_consistency) {
    if (Math.random() * 100 < dice_consistency) {
        return dice_size;
    } else {
        //return dice_size;
        return Math.random() * dice_size;
    }
}