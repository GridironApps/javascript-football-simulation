//TODO need a function to convert input file(?) to json data

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

    //initialize object to store blocking matchups for each possible zone ... zones correspond to location of pre-snap gaps
    const ZONES = ["E-", "D-", "C-", "B-", "A-", "A+", "B+", "C+", "D+", "E+"];
    let x = [-16, -7, -5, -3, -1, 1, 3, 5, 7, 16]; //shortest horizontal yardage from center for each zone
    let blocking_matchup = {};
    for (const ZONE of ZONES) {
        blocking_matchup[ZONE] = {};
        blocking_matchup[ZONE].score = 0; // + is good for offense, - is good for defense
        blocking_matchup[ZONE].blockers = [];
        blocking_matchup[ZONE].defenders = [];
        blocking_matchup[ZONE].x = x.shift();
    }

    //get run blockers
    let run_blockers = [];
    for (const POS in o) {
        o[POS].blocking = [];
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
    if(target_zone.indexOf('+') > 0){
        run_direction = 'right';
    }else if(target_zone.indexOf('-') > 0){
        run_direction = 'left';
    }

    //assign defenders to rushing zones
    for (const POS in d) {
        //get assignment based on run direction
        const ASSIGNMENT = d[POS]['run_' + run_direction];

        //get rush_zone responsibliity
        let rush_zones = [];
        if (ASSIGNMENT.job == 'fit-zones') {
            rush_zones = ASSIGNMENT.rush_zones;
            d[POS].defending_zones = rush_zones;            
        }

        //TODO if a guy is defending multiple zones they shouldn't be on the line, they should have some initial depth

        //write assignment to blocking matchup object
        for (const ZONE of rush_zones) {
            blocking_matchup[ZONE].defenders.push(POS);
        }
    }

    //clean up matchups so we don't have guys assigned to multiple rushing zones

    //check from sideline to sideline based upon direction of run
    let z = ZONES;
    if (run_direction == 'right') {
        z = z.reverse();
    }

    //TODO add these rules somewhere
    /*
        guys with a single gap (left and right) are on the line, those gaps can be different if adjacent
        guys with multiple gaps are off the line
        guys with non-rush pass responsiblity are also off the line
        guys with deep-zones are further off the line initially
    
        offense must have 1 WR (or more) on each side
        offense can have 0,1,2 TE .... the 1st TE is always to the offenses right
    
        a back with a lead blocker starts further back
    */

    //goal is at least 1 defender per blocker in each zone, if possible
    for (const ZONE of z) {
        let possible_defenders = blocking_matchup[ZONE].defenders;
        let assigned_defenders = [];

        //check each defender to see if they only have one option
        for (const DEFENDER of possible_defenders) {
            if (d[DEFENDER].defending_zones.length == 1) { //FIXME should probably check that the defender's zone matches the zone we are checking (it should, but could catch an unforseen error)
                //add defender to array of defenders to be assigned
                assigned_defenders.push(DEFENDER);

                //remove defender from list of possible options
                possible_defenders.splice(possible_defenders.indexOf(DEFENDER), 1);
            }
        }

        //see if we need to assign one of the optional multi-zone defenders
        let num_defenders_needed = blocking_matchup[ZONE].blockers.length - assigned_defenders.length;
        if (num_defenders_needed > 0) {
            //see if we have more options than blockers needed
            if (possible_defenders.length > num_defenders_needed) {

                //prioritize guys with the fewest options
                possible_defenders.sort(function (a, b) {
                    return d[a].length - d[b].length;
                });

                //assign the first x defenders to this zone where x is equal to the number of defenders needed
                for (let i = 0; i < possible_defenders.length; i++) {

                    let defender = possible_defenders[i];

                    if (i < num_defenders_needed) {
                        //add defender to array of defenders to be assigned
                        assigned_defenders.push(defender);

                        //remove defender from list of possible options
                        possible_defenders.splice(possible_defenders.indexOf(defender), 1);

                        //update matchups
                        for (const ZZ of d[defender].defending_zones) {
                            if (ZZ == ZONE) {
                                continue;
                            }
                            blocking_matchup[ZZ].defenders.splice(blocking_matchup[ZZ].defenders.indexOf(defender), 1);
                        }

                        //update defender
                        d[defender].defending_zones = [ZONE];

                    } else {
                        //remove defender from list of possible options
                        possible_defenders.splice(possible_defenders.indexOf(DEFENDER), 1);

                        //update defender that isn't needed
                        d[defender].defending_zones.splice(d[defender].defending_zones.indexOf(ZONE), 1);
                    }
                }
            } else {
                //assign all remaining possible_defenders to this zone
                for (const DEFENDER of possible_defenders) {
                    //add defender to array of defenders to be assigned
                    assigned_defenders.push(DEFENDER);

                    //remove defender from list of possible options
                    possible_defenders.splice(possible_defenders.indexOf(DEFENDER), 1);

                    //update matchups
                    for (const ZZ of d[DEFENDER].defending_zones) {
                        if (ZZ == ZONE) {
                            continue;
                        }
                        blocking_matchup[ZZ].defenders.splice(blocking_matchup[ZZ].defenders.indexOf(DEFENDER), 1);
                    }

                    //update defender
                    d[DEFENDER].defending_zones = [ZONE];
                }
            }
        } else {
            //update each defender
            for (const DEFENDER of possible_defenders) {
                //update defender that isn't needed
                d[DEFENDER].defending_zones.splice(d[DEFENDER].defending_zones.indexOf(ZONE), 1);
            }
        }

        //update matchup
        blocking_matchup[ZONE].defenders = assigned_defenders;
    }

    //assign pursuit guy(s) to zone
    for (const POS in d) {
        //get assignment based on run direction
        const ASSIGNMENT = d[POS]['run_' + run_direction];

        //get rush_zone responsibliity
        let rush_zones = [];
        if (ASSIGNMENT.job == 'pursue') {
            rush_zones = [target_zone];
            d[POS].defending_zones = rush_zones;
        }

        //TODO if a guy is pursuing shouldn't be on the line, they should have some initial depth
        //TODO intial depth is also determined by pass responsiblity

        //write assignment to blocking matchup object
        for (const ZONE of rush_zones) {
            blocking_matchup[ZONE].defenders.push(POS);
        }
    }

    //TODO write matchups to players

    //
    // Simulate Play
    //

    //TODO probably need some formation data so we can adjust and not have guys hanging out by the sideline with nothing to do

    // ball is snapped
    let is_play_active = true;

    // roll first step for all players
    for (const POS in o) {
        o[POS].first_step_roll = roll(o[POS].first_step, o[POS].consistency);
    }
    for (const POS in d) {
        d[POS].first_step_roll = roll(d[POS].first_step, d[POS].consistency);
    }

    //FIXME make sure blockers are assigned to a single zone, might add a "combo" type block later where they can start in one zone and move to another

    // use first step and position to determine where player position is 1-tick later ... will smooth this once we determine matchups
    for (const ZONE in blocking_matchup) {
        
        //get blockers positions
        for (const BLOCKER of blocking_matchup[ZONE].blockers) {
            o[BLOCKER].x = blocking_matchup[ZONE].x; //FIXME this should update based on players initial position
            o[BLOCKER].y = o[BLOCKER].first_step_roll / 100; //bounds distance between 0-1 yards
            o[BLOCKER].blocking = [];
        }

        //get defenders positions
        for (const DEFENDER of blocking_matchup[ZONE].defenders) {
            d[DEFENDER].y -= d[DEFENDER].first_step_roll / 100;
            d[DEFENDER].blocked_by = [];
        }

        //sort large to small by y-pos
        blocking_matchup[ZONE].blockers.sort(function(a,b){
            return o[b].y - o[a].y;
        });

        //sort small to large by y-pos
        blocking_matchup[ZONE].defenders.sort(function(a,b){
            return d[a].y - d[b].y;
        }); 
        
        //matchup individual players if possible
        for(let i=0;i<blocking_matchup[ZONE].blockers.length;i++){
            //check to see if we have a defender to block
            if(blocking_matchup[ZONE].defenders.length >= i){
                let blocker = blocking_matchup[ZONE].blockers[i];
                let defender = blocking_matchup[ZONE].defenders[i];

                o[blocker].blocking.push(defender);
                d[defender].blocked_by.push(blocker);

                let y = (o[blocker].y + d[defender].y)/2; //FIXME this lets players teleport if they don't overlap ... think S coming from deep
                o[blocker].y = y;
                d[defender].y = y;
            }else{
                //we have more blockers than defenders ... help with the first available matchup //FIXME breaks if I have more than a double team
                let ii = i - blocking_matchup[ZONE].defenders.length - 1;

                let blocker = blocking_matchup[ZONE].blockers[i];
                let defender = blocking_matchup[ZONE].defenders[ii];
                let other_blocker = blocking_matchup[ZONE].blockers[ii];

                o[blocker].blocking.push(defender);
                d[defender].blocked_by.push(blocker);

                let y = Math.max(o[blocker].y,o[other_blocker].y);
                o[blocker].y = y;
                d[defender].y = y;
                o[other_blocker].y = y;
            }
        }
    }

    //TODO add a read check to see how quickly they get to their assignment ... not needed if they only have a single responsibility

    // offense tries to engage the player they are blocking ... roll run blocking for each offensive player, with advantage
    for (const POS in o) {
        o[POS].engaged = false; //FIXME this should be set earlier
        if(o[POS].blocking.length > 0){ //FIXME should the be == 1 since they can only block a single player?
            o[POS].run_blocking_roll = roll(o[POS].run_blocking, o[POS].consistency, 'advantage'); //FIXME should the consistency be 0 here for a true percentile roll?
            if(o[POS].run_blocking_roll > Math.random()*100){
                o[POS].engaged = true;
            }
        }
    }

    // defense tries to free themselves ... roll shed for each defensive player that is blocked
    //TODO add a time delay for getting off a block
    for (const POS in d) {
        d[POS].engaged = false; //FIXME this shoudl be set earlier
        if(d[POS].blocked_by.length > 0){
            for(const BLOCKER of d[POS].blocked_by){
                if(o[BLOCKER].engaged){
                    //roll shed normally
                    d[POS].shed_roll = roll(d[POS].shed, d[POS].consistency);
                }else{
                    //roll shed with advantage
                    d[POS].shed_roll = roll(d[POS].shed, d[POS].consistency, 'advantage');
                }
                if(d[POS].shed_roll > Math.random()*100){
                    o[BLOCKER].engaged = false; //FIXME I could update the arrays, but I kind of want to keep a record of who was responsible for who
                }else{
                    //move defender back a yard and retry
                    d[POS].y += 1;
                    o[BLOCKER].y += 1; //FIXME move the other blocker as well if they exist
                    
                    //roll shed with advantage
                    d[POS].shed_roll = roll(d[POS].shed, d[POS].consistency, 'advantage');
                    
                    if(d[POS].shed_roll > Math.random()*100){
                        o[BLOCKER].engaged = false;
                    } else {
                        d[POS].engaged = true; // they won't be able to make the tackle
                    }
                }
            }
        }
    }

    // defender(s) in unblocked zones chase ball carrier ... calculate distances and see if and where tackle can be made ... use horizontal distance between zones for now //FIXME add player (RB) depth

    //build a tackle queue with players that are no longer blocked
    let tackle_queue = [];
    for(const POS in d){
        if(!d[POS].engaged){
            tackle_queue.push(POS);
        }
    }

    //get forty time for each defender
    for (const POS in d) {
        d[POS].forty_time = 5.2 - roll(d[POS].speed, d[POS].consistency) / 100;
    }
    
    //sort the tackle queue based on time to reach hole  //FIXME this could disadvantage TFLs from behind
    tackle_queue.sort(function(a,b){
        let time_a = dist2(d[a],blocking_matchup[target_zone]) * d[a].forty_time / 40;
        let time_b = dist2(d[b],blocking_matchup[target_zone]) * d[b].forty_time / 40;
        return time_a - time_b;
    });
        
    //initialize runner position //FIXME do this earlier
    o[runner].x = 0;
    o[runner].y = -1; //FIXME need to get vertical position of ball carrier at start ... for now we know they are at least 1 yard behind the LOS
    o[runner].forty_time = 5.2 - roll(o[runner].speed, o[runner].consistency) / 100; // assuming 40 times are bounded between 4.2 (100 spd) and 5.2 (0 spd)
    
    //update runner so they are inline with the target zone (in the backfield)
    o[runner].x = blocking_matchup[target_zone].x;
    let distance_to_target = Math.abs(o[runner].x);     
    let runner_time = distance_to_target * o[runner].forty_time / 40;

    //work through tackle queue at 0.1 second intervals until we have no more potential tacklers left //FIXME each defender only gets 1 chance to tackle
    while(tackle_queue.length > 0 && is_play_active){
        for(const DEFENDER of tackle_queue){
            //get time to runners current position
            let time_to_runner = dist2(d[DEFENDER],o[runner]) * d[DEFENDER].forty_time / 40;
            if(time_to_runner <= runner_time){ //FIXME we should probably adjust the distance through interpolation or add some margin of error
                // defender can reach the ball carrier

                // ball carrier tries to evade the defender
                
                // defender tries to tackle if not evaded
                if(roll(d[DEFENDER].tackling, d[DEFENDER].consistency) > Math.random() * 100){
                    //ball carrier is tackled
                    log.push(runner + ' is tackled by ' + DEFENDER + ' for a gain of ' + o[runner].y + ' yards');
                    is_play_active = false;
                    break;
                }else{
                    //remove the tackler from the queue
                    tackle_queue.splice(tackle_queue.indexOf(DEFENDER),1);
                }

                // ball carrier tries to break tackle if tackled ... add a 0.1s time delay
            }
        }
        if(is_play_active){
            runner_time += 0.1;
            o[runner].y += 0.1 * 40 / o[runner].forty_time;
        }   
    }

    //Check for touchdown
    if (is_play_active) {
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
function dist2(a,b){
    return Math.pow(Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2),0.5);
}