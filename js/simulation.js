//TODO need a function to convert input file(?) to json data

//TODO in the near term update this to match the job types (handoff, run, run_block, pass_block, run_route, catch, throw, shed_blocker, tackle, cover_man, cover_zone)

//for the function below just assume the data is already formatted in a json object (above)
function simulateRun(o, d) {

    //setup log file to return
    let log = [];

    //initialize closest location to rushing zones ... zones correspond to location of pre-snap gaps
    let zones = {
        "E-": {
            x: -16,
            y: 0
        },
        "D-": {
            x: -7,
            y: 0
        },
        "C-": {
            x: -5,
            y: 0
        },
        "B-": {
            x: -3,
            y: 0
        },
        "A-": {
            x: -1,
            y: 0
        },
        "A+": {
            x: 1,
            y: 0
        },
        "B+": {
            x: 3,
            y: 0
        },
        "C+": {
            x: 5,
            y: 0
        },
        "D+": {
            x: 7,
            y: 0
        },
        "E+": {
            x: 16,
            y: 0
        },
    };

    //initialize arrays in zones to store blocking matchups
    for (const ZONE in zones) {
        zones[ZONE].blockers = [];
        zones[ZONE].defenders = [];
    }

    //
    // OFFENSE setup
    //

    //get target zone for runner
    let runner;
    let run_direction;
    for (const pos in o) {
        if (o[pos].job === 'run') {

            //get runner
            runner = pos;
            log.push('Runner is ' + pos);

            //get run direction    
            if (o[runner].target_zone.indexOf('+') > 0) {
                run_direction = 'right';
            } else if (o[runner].target_zone.indexOf('-') > 0) {
                run_direction = 'left';
            }
            log.push('Run is heading to the ' + run_direction);

            break; //assuming only one player has the job "run"
        }
    }

    //ignoring "handoff" job for now //TODO should check that it exists though...could be a pitch

    //list possible run blockers for each zone
    let run_blockers = [];
    for (const POS in o) {

        //intialize blocking matchup arrays
        o[POS].blocking = [];
        o[POS].engaged_with = [];

        //add to rush zone if job is blocking
        if (o[POS].job === "run-block") {
            run_blockers.push(POS);

            //add blocker to zone //FIXME assumes blocker has a single zone assigned
            zones[o[POS].blocking_zone].blockers.push(POS); //FIXME make sure blockers are assigned to a single zone, might add a "combo" type block later where they can start in one zone and move to another
        }
    }

    //
    // DEFENSE setup
    //    

    //list possible defenders for each rushing zone
    let pursuit_defenders = [];
    let zone_defenders = [];
    for (const DEFENDER in d) {

        //initialize blocking matchup arrays
        d[DEFENDER].blocked_by = [];
        d[DEFENDER].engaged_with = [];

        //get assignment based on run direction
        const ASSIGNMENT = d[DEFENDER]['run_' + run_direction];

        //get rush_zone responsibliity
        let rush_zones = [];
        if (ASSIGNMENT.job == 'fit-zones') {
            zone_defenders.push(DEFENDER);
            rush_zones = ASSIGNMENT.rush_zones;
        } else if (ASSIGNMENT.job == 'pursue') {
            pursuit_defenders.push(DEFENDER);
        }
        d[DEFENDER].defending_zones = rush_zones;

        //add defender to zones
        for (const ZONE of rush_zones) {
            zones[ZONE].defenders.push(DEFENDER);
        }
    }

    //assign defenders to a single zone ... goal is at least 1 defender per blocker in each zone, if possible

    //check from sideline to sideline based upon direction of run
    let zone_order = ["E-", "D-", "C-", "B-", "A-", "A+", "B+", "C+", "D+", "E+"]; //left to right
    if (run_direction == 'right') {
        zone_order = zone_order.reverse(); //right to left
    }

    for (const ZONE of zone_order) {

        //get possible defenders
        let possible_defenders = zones[ZONE].defenders;

        //sort possible defenders base upon number of zones they can cover (less to more) and distance if tied (closer to farther)
        possible_defenders.sort(function (a, b) {
            if (d[a].defending_zones.length < d[b].defending_zones.length) {
                return -1;
            } else if (d[a].defending_zones.length < d[b].defending_zones.length) {
                return 1;
            } else {
                return dist2(d[a], zones[ZONE]) - dist2(d[b], zones[ZONE]);
            }
        });

        //assign defenders until we match the number of blockers ... also assign defenders that have no other zones to defend
        let assigned_defenders = [];
        for (const DEFENDER of possible_defenders) {
            if (assigned_defenders.length < zones[ZONE].blockers.length || d[DEFENDER].defending_zones.length == 1) {
                //add defender to assigned_defenders
                assigned_defenders.push(DEFENDER);

                //remove defender from other zones
                for (const D_ZONE of d[DEFENDER].defending_zones) {
                    zones[D_ZONE].defenders = remove(DEFENDER, zones[D_ZONE].defenders);
                }

                //update defender
                d[DEFENDER].defending_zones = [ZONE];
            } else {
                //remove this ZONE from the defenders list of defending zones
                d[DEFENDER].defending_zones = remove(ZONE, d[DEFENDER].defending_zones);
            }
        }

        //update defenders in zones
        zones[ZONE].defenders = assigned_defenders;

        //add pursuit players if current zone matches runners target zone 
        if (o[runner].target_zone == ZONE) {
            zones[ZONE].defenders.concat(pursuit_defenders);
            for (const DEFENDER of pursuit_defenders) {
                d[DEFENDER].defending_zones = [ZONE]; //FIXME runner could bounce the run and the pursuit players would need to update
            }
        }
    }

    //
    // Simulate Play
    //

    // ball is snapped
    let is_play_active = true;

    //update runners position using first step
    o[runner].first_step_roll = roll(o[runner].first_step, o[runner].consistency);
    o[runner] = move(o[runner], zones[o[runner].target_zone], o[runner].first_step_roll / 100);

    //update blockers and defenders using first step ... determine where player position is 1-tick (0.1 seconds) later
    for (const ZONE in zones) {

        //update blockers position using first step
        for (const BLOCKER of zones[ZONE].blockers) {
            o[BLOCKER].first_step_roll = roll(o[BLOCKER].first_step, o[BLOCKER].consistency);
            o[BLOCKER] = move(o[BLOCKER], zones[ZONE], o[BLOCKER].first_step_roll / 100);
        }

        //update defenders position using first step
        for (const DEFENDER of zones[ZONE].defenders) {
            d[DEFENDER].first_step_roll = roll(d[DEFENDER].first_step, d[DEFENDER].consistency);
            d[DEFENDER] = move(d[DEFENDER], zones[ZONE], d[DEFENDER].first_step_roll / 100);
        }

        //sort large to small by distance to zone, small to large
        zones[ZONE].blockers.sort(function (a, b) {
            return dist2(o[a], zones[ZONE]) - dist2(o[b], zones[ZONE]);
        });

        //sort small to large by distance to zone, small to large
        zones[ZONE].defenders.sort(function (a, b) {
            return dist2(d[a], zones[ZONE]) - dist2(d[b], zones[ZONE]);
        });

        //matchup individual players based on distance when possible
        for (let i = 0; i < zones[ZONE].blockers.length; i++) {
            //check to see if we have a defender to block
            if (zones[ZONE].defenders.length == 0) {
                //we don't have anyone to block

                //FIXME they should try to block someone in a neighboring zone ...for now have them block the pursuit guys (if they exist)
            } else {
                //create one-on-one blocking matchups
                let blocker = zones[ZONE].blockers[i];
                let defender = zones[ZONE].defenders[i % zones[ZONE].defenders.length]; //this allows multiple blockers per defender

                o[blocker].blocking.push(defender);
                d[defender].blocked_by.push(blocker);

                log.push(blocker + ' is trying to block ' + defender);

                //TODO need to fuzz location if they are close enough to collide
            }
        }
    }

    //TODO add a read check to see how quickly they get to their assignment ... not needed if they only have a single responsibility    

    //get forty time of runner on this play
    o[runner].forty_time = 5.2 - roll(o[runner].speed, o[runner].consistency) / 100; // assuming 40 times are bounded between 4.2 (100 spd) and 5.2 (0 spd)

    //get forty time for blockers on this play
    for (const POS of run_blockers) {
        o[POS].forty_time = 5.2 - roll(o[POS].speed, o[POS].consistency) / 100;
    }

    //get forty time for each defenders on this play
    for (const POS in d) {
        d[POS].forty_time = 5.2 - roll(d[POS].speed, d[POS].consistency) / 100;
    }

    //step through the play at 0.1 second intervals until tackle is made or runner scores
    let time = 0.1;
    let dt = 0.1;
    const REACH_DIST = 0.75; //yards
    while (is_play_active) {
        //increment time
        time += 0.1;

        //update runner
        let target = zones[o[runner].target_zone];
        if (o[runner].y >= 0) { //if runner is at or beyond the LOS head to the endzone
            target.y = 100;
        }
        o[runner] = move(o[runner], target, dt * 40 / o[runner].forty_time);

        //check to see if runner has scored
        if (o[runner].y > 99) {
            log.push('The ' + runner + ' runs for a TOUCHDOWN!');
            is_play_active = false;
            break;
        }

        //update blockers
        for (const BLOCKER of run_blockers) {

            //check to see if target defender is in range
            if (dist2(o[BLOCKER], d[o[BLOCKER].blocking[0]]) > REACH_DIST) {
                //not in range, so move closer
                let target = d[o[BLOCKER].blocking[0]]; //FIXME should they move to the zone first? //TODO add waypoints to each player
                o[BLOCKER] = move(o[BLOCKER], target, dt * 40 / o[BLOCKER].forty_time);
            } else {
                //if in range check to see if defender is already blocked
                if (o[BLOCKER].engaged_with.length > 0) {
                    //push the defender back 
                    let target = o[BLOCKER].engaged_with[0];
                    let direction = unitVector(o[BLOCKER], d[target]);
                    let dist = dt * roll(o[BLOCKER].run_blocking) / 100; //FIXME should this be strength based?

                    //update position of both players 
                    o[BLOCKER].x += direction.x * dist;
                    o[BLOCKER].y += direction.y * dist;
                    d[target].x -= direction.x * dist;
                    d[target].y -= direction.y * dist;
                    //update the position of the other blocker if they exist
                    if (d[target].engaged_with > 1) {
                        let blocker2 = d[target].engaged_with[0];
                        if (BLOCKER == blocker2) {
                            blocker2 = d[target].engaged_with[1];
                        }
                        o[blocker2].x += direction.x * dist;
                        o[blocker2].y += direction.y * dist;
                    }
                } else {
                    //if not blocked try to engage the player they are blocking ... roll run blocking for each offensive player //FIXME should this be with advantage?
                    if (Math.random() * 100 < roll(o[BLOCKER].run_blocking, o[BLOCKER].consistency)) { //FIXME should the consistency be 0 here for a true percentile roll?
                        let defender = o[BLOCKER].blocking[0];
                        o[BLOCKER].engaged_with.push(defender);
                        d[defender].engaged_with.push(BLOCKER);
                    }
                }

            }
        }

        //DEFENSE update
        for (const DEFENDER in d) {

            //check to see if defender is engaged with a blocker
            if (d[DEFENDER].engaged_with.length > 0) {
                //try to disengage from each blocker
                for (const BLOCKER of d[DEFENDER].engaged_with) {
                    if (Math.random() * 100 < roll(d[DEFENDER].shed, d[DEFENDER].consistency)) {
                        //update engaged_with arrays
                        d[DEFENDER].engaged_with = remove(BLOCKER, d[DEFENDER].engaged_with);
                        o[BLOCKER].engaged_with = remove(DEFENDER, o[BLOCKER].engaged_with);
                    }
                }
            } else {
                //check if the runner is in range
                if (dist2(d[DEFENDER], o[runner]) > REACH_DIST) {
                    //move
                    let target;
                    if (o[runner].y < 0 && d[DEFENDER].y > 0) { //if runner is behind the LOS AND defender is on other side of LOS, defender should head through their assigned zone/gap
                        target = {
                            "x": zones[d[DEFENDER].defending_zones[0]].x,
                            "y": 0
                        };
                    } else if(o[runner].y < 0 && d[DEFENDER].y <= 0){ //defender should head to the runner and try to get a TFL
                        target = {
                            "x": o[runner].x,
                            "y": o[runner].y
                        };
                    }else{ //runner is past the LOS, defender should try to intersect the runners path

                        //initialize target
                        target = {
                            "x": o[runner].x,
                            "y": o[runner].y
                        };

                        //get speed of each player
                        let v_runner = 40 / o[runner].forty_time;
                        let v_defender = 40 / d[DEFENDER].forty_time;

                        //get initial distance to runner in x and y direction
                        let dx = o[runner].x - d[DEFENDER].x;
                        let dy = o[runner].y - d[DEFENDER].y;

                        //get min time to close horizontal distance
                        let t_min = Math.abs(dx) / v_defender;
                        let diff = t_min;

                        while (Math.abs(diff) > dt) {
                            
                            //update dy using diff
                            dy += v_runner * diff;

                            //repeat again to improve accuracy
                            diff = Math.pow(dy * dy + dx * dx, 0.5) / v_defender - t_min;

                            //update t_min
                            t_min += diff;
                        }

                        //update target
                        target.y += v_runner * t_min; //FIXME this can undershoot the actual needed angle
                    }

                    //update defenders position
                    d[DEFENDER] = move(d[DEFENDER], target, dt * 40 / d[DEFENDER].forty_time);

                } else {
                    //try to tackle //TODO allow runner to evade and/or break tackle (for a small time delay)
                    if (Math.random() * 100 < roll(d[DEFENDER].tackling, d[DEFENDER].consistency)) {
                        log.push(DEFENDER + ' made the tackle for a gain of ' + o[runner].y + ' yards');
                        is_play_active = false;
                        break;
                    } else {
                        log.push(DEFENDER + ' missed the tackle at ' + o[runner].y + ' yards');
                    }
                }
            }
        }
    }

    //TODO conceivibly we could have run_dice and pass_dice or multiple run_dices for option type plays, the QB would be responsible for choosing ... this should actually be based on the defense, but passing might look at offensive rolls for reads

    return {
        offense: o,
        defense: d,
        matchups: zones,
        log: log
    }

}

function simulatePass(o, d) {
    //TODO work in style of pass: quick, normal, timing, long, play-action

    //FIXME need to target recievers in a more general sense

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
// Utility function to get and set initial score
//

function getRoll(player, attribute) {
    if (typeof (player[attribute + '_roll']) === "undefined") {
        player[attribute + '_roll'] = roll(player[attribute], player.consistency);
    }
    return player[attribute + '_roll'];
}

//
// UTILITY function to roll dice
//

function roll(dice_size, dice_consistency, type) {
    if (type === "advantage") {
        return Math.max(
            roll(dice_size, dice_consistency),
            roll(dice_size, dice_consistency)
        )
    } else if (type === "disadvantage") {
        return Math.min(
            roll(dice_size, dice_consistency),
            roll(dice_size, dice_consistency)
        )
    } else {
        if (Math.random() * 100 < dice_consistency) {
            return dice_size;
        } else {
            //return dice_size;
            return Math.random() * dice_size;
        }
    }
}

//
// Utility function to calculate distance
//

// 2-norm, euclidian, distance
function dist2(a, b) {
    return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), 0.5);
}

function vec2(start, end) {
    let vec = {};
    vec.x = end.x - start.x;
    vec.y = end.y - start.y;
    return vec;
}

function unitVector(start, end) {
    let dist = dist2(start, end);
    let vec = vec2(start, end);
    vec.x = vec.x / dist;
    vec.y = vec.y / dist;
    return vec;
}

function move(player, target, dist) {
    let direction = unitVector(player, target); //FIXME create a subfunction to update position
    player.x += direction.x * dist;
    player.y += direction.y * dist;
    return player;
}

//TODO put some of the physics stuff together into an object

//utility function to remove an element from an array
function remove(el, arr) {
    arr = arr.filter(function (item) {
        return item !== el;
    });
    return arr;
}

//
// PLAYER OBJECT
//

class Player {
    constructor() {

    }
}