/*
    x-coordinate is left (+) and right (-) from a defensive perspective
    y-coordinate is forward (-) and backwards (+) from a defensive perspective
*/

class Defense {
    constructor(formation_data, landmarks, ball, offense) {
        this.roster = [];
        this.personnel = '';
        this.formation = formation_data.name;

        /*
            create player groups using Player Zones and the offense
        */

        const YARD_TO_FOOT = 3;
        const WR_ZONE_START = 10; //feet
        const FB_ZONE_START = 5 * YARD_TO_FOOT;

        var temp_offense = {}; //use this to temporarily store offensive players with custom tags

        //Re-tag the o-line in case of Tackle over ... it should have 5 players sorted left-to-right from an offensive perspective        
        temp_offense['OT-right'] = offense.o_line[0];
        temp_offense['OG-right'] = offense.o_line[1];
        temp_offense['OC'] = offense.o_line[2]; //FIXME should we look at ball or center in a tackle over situation for left/right
        temp_offense['OG-left'] = offense.o_line[3];
        temp_offense['OT-left'] = offense.o_line[4];

        //Split eligibles into WRs and TEs on the left
        var wr_left = [];
        var te_left = [];
        var o_left = offense.eligible_right; //the offenses right is the defenses left
        var divider = temp_offense['OT-left'].right_edge + WR_ZONE_START;
        for (var i = 0; i < o_left.length; i++) { //we are going inside to outside since this is sorted left to right
            var player = o_left[i];
            if (player.right_edge > divider) {
                wr_left.unshift(player); //use unshift so we can make the outside player first in the array
            } else {
                te_left.unshift(player);
            }
        }

        //Split eligibles into WRs and TEs on the right
        var wr_right = [];
        var te_right = [];
        var o_right = offense.eligible_left; //the offenses left is the defenses right
        var divider = temp_offense['OT-right'].left_edge - WR_ZONE_START;
        for (var i = 0; i < o_right.length; i++) { //we are going outside to inside since this is sorted left to right
            var player = o_right[i];
            if (player.left_edge < divider) {
                wr_right.push(player); //use push so we can make the outside player first in the array
            } else {
                te_right.push(player);
            }
        }

        //Split backs into RB and FB
        var rb_all = [];
        var fb_all = [];
        var o_backs = offense.backs; //list is sorted left-to-right and front-to-back from an offensive perspective
        var divider = ball.front_edge - FB_ZONE_START;
        for (var i = 0; i < o_backs.length; i++) {
            var player = o_backs[i];
            if (player.front_edge < divider) {
                rb_all.push(player);
            } else {
                fb_all.push(player);
            }
        }

        //Split RB into left, right, and center
        var rb_left = [];
        var rb_center = [];
        var rb_right = [];
        for (var i = 0; i < rb_all.length; i++) {
            var player = rb_all[i];
            if (player.left_edge >= ball.x) {
                rb_left.push(player);
            } else if (player.right_edge <= ball.x) {
                rb_right.push(player);
            } else {
                rb_center.push(player);
            }
        }

        //Split FB into left, right, and center
        var fb_left = [];
        var fb_center = [];
        var fb_right = [];
        for (var i = 0; i < fb_all.length; i++) {
            var player = fb_all[i];
            if (player.left_edge >= ball.x) {
                fb_left.push(player);
            } else if (player.right_edge <= ball.x) {
                fb_right.push(player);
            } else {
                fb_center.push(player);
            }
        }

        /*
            Determine strength of offense
        */

        var non_rb_left = wr_left.length + te_left.length + fb_left.length;
        var non_rb_right = wr_right.length + te_right.length + fb_right.length;

        if (non_rb_left > non_rb_right) {
            this.strength = 'left';
        } else if (non_rb_left < non_rb_right) {
            this.strength = 'right';
        } else {
            if (te_left.length > te_right.length) {
                this.strength = 'left';
            } else if (te_left.length < te_right.length) {
                this.strength = 'right';
            } else {
                if (fb_left.length < fb_right.length) {
                    this.strength = 'left';
                } else if (fb_left.length < fb_right.length) {
                    this.strength = 'right';
                } else {
                    if (rb_left.length < rb_right.length) {
                        this.strength = 'right';
                    } else if (rb_left.length > rb_right.length) {
                        this.strength = 'left';
                    } else {
                        //TODO add field and QB arm checks
                        this.strength = 'left';
                    }
                }
            }
        }

        /*
            Tag offensive players so we can more easily find them
        */

        //O-line
        if (this.strength == 'right') {
            temp_offense['OT-strong'] = temp_offense['OT-right'];
            temp_offense['OG-strong'] = temp_offense['OG-right'];
            temp_offense['OG-weak'] = temp_offense['OG-left'];
            temp_offense['OT-weak'] = temp_offense['OT-left'];
        } else if (this.strength == 'left') {
            temp_offense['OT-strong'] = temp_offense['OT-left'];
            temp_offense['OG-strong'] = temp_offense['OG-left'];
            temp_offense['OG-weak'] = temp_offense['OG-right'];
            temp_offense['OT-weak'] = temp_offense['OT-right'];
        }

        //TE-left
        for (i = 0; i < te_left.length; i++) {
            temp_offense['TE' + (i + 1) + '-left'] = te_left[i];
            if (this.strength == 'left') {
                temp_offense['TE' + (i + 1) + '-strong'] = te_left[i];
            } else {
                temp_offense['TE' + (i + 1) + '-weak'] = te_left[i];
            }
        }

        //TE-right
        for (i = 0; i < te_right.length; i++) {
            temp_offense['TE' + (i + 1) + '-right'] = te_right[i];
            if (this.strength == 'right') {
                temp_offense['TE' + (i + 1) + '-strong'] = te_right[i];
            } else {
                temp_offense['TE' + (i + 1) + '-weak'] = te_right[i];
            }
        }

        //WR-left
        for (i = 0; i < wr_left.length; i++) {
            temp_offense['WR' + (i + 1) + '-left'] = wr_left[i];
            if (this.strength == 'left') {
                temp_offense['WR' + (i + 1) + '-strong'] = wr_left[i];
            } else {
                temp_offense['WR' + (i + 1) + '-weak'] = wr_left[i];
            }
        }

        //WR-right
        for (i = 0; i < wr_right.length; i++) {
            temp_offense['WR' + (i + 1) + '-right'] = wr_right[i];
            if (this.strength == 'right') {
                temp_offense['WR' + (i + 1) + '-strong'] = wr_right[i];
            } else {
                temp_offense['WR' + (i + 1) + '-weak'] = wr_right[i];
            }
        }

        /*
            align defensive players
        */

        //copy alignment instructions to each player based on matching criteria ... TODO pull players from roster based on peronnel 
        var positions = formation_data.positions;
        this.players = {}; //guys on the field ... using an object so we can map to position tags
        for (var pos in positions) {
            var defender = positions[pos];
            var h_align = undefined;
            var v_align = undefined;

            //work through criteria until we find one that works
            if (Array.isArray(defender)) {
                var options = defender;
                for (var i = 0; i < options.length; i++) {
                    var criteria = options[i].criteria;

                    //default criteria ... mostly for testing
                    if(criteria == 'default'){
                        h_align = options[i].horizontal;
                        v_align = options[i].vertical;
                        break; //stop on FIRST successful set of criteria ... could change to last if needed
                    }                    

                    //evaluate each criteria
                    var pass = true;
                    for (var j = 0; j < criteria.length; j++) {
                        var c = criteria[j].split(' ');

                        if(c.length !== 3){
                            console.error('Criteria "' + criteria[j] + '" for defender "' + pos + '" is not formatted correctly. Skipping to next criteria.');
                            pass = false;
                            break;
                        }

                        var val1 = getVal(c[0], this);
                        var val2 = getVal(c[2], this);

                        switch (c[1]) {
                            case '=':
                                pass = pass && (val1 == val2);
                                break;
                            case '==':
                                pass = pass && (val1 == val2);
                                break;
                            case '>':
                                pass = pass && (val1 > val2);
                                break;
                            case '<':
                                pass = pass && (val1 < val2);
                                break;
                            case '>=':
                                pass = pass && (val1 >= val2);
                                break;
                            case '<=':
                                pass = pass && (val1 <= val2);
                                break;
                            default:
                            //do nothing for now
                        }

                        //once we fail any part of the criteria we are done
                        if (!pass) {
                            break;
                        }
                    }

                    if (pass) {
                        h_align = options[i].horizontal;
                        v_align = options[i].vertical;
                        break; //stop on FIRST successful set of criteria ... could change to last if needed
                    }

                }

                //adding an elegant message
                if(typeof(h_align) === 'undefined' || typeof(v_align) === 'undefined'){
                    console.error('No matching alignment criteria for defender "' + pos + '". Defaulting to top sideline.');
                    h_align = ['align','sideline-left'];
                    v_align = ['align', 'ball'];
                }

            } else {
                h_align = defender.horizontal;
                v_align = defender.vertical;
            }
            
            this.players[pos] = new Player(pos,h_align, v_align);
        }

        //helper function to turn text criteria into floating point numbers
        function getVal(val, def) {
            switch (val) {
                case "RB":
                    return rb_all.length;
                case "RB_all":
                    return rb_all.length;
                case "RB_left":
                    return rb_left.length + rb_center.length / 2;
                case "RB_right":
                    return rb_right.length + rb_center.length / 2;
                case "RB_strong":
                    if (def.strength == 'right') {
                        return rb_right.length + rb_center.length / 2;
                    } else {
                        return rb_left.length + rb_center.length / 2;
                    }
                case "RB_weak":
                    if (def.strength == 'left') {
                        return rb_right.length + rb_center.length / 2;
                    } else {
                        return rb_left.length + rb_center.length / 2;
                    }
                case "FB":
                    return fb_all.length;
                case "FB_all":
                    return fb_all.length;
                case "FB_left":
                    return fb_left.length + fb_center.length / 2;
                case "FB_right":
                    return fb_right.length + fb_center.length / 2;
                case "FB_strong":
                    if (def.strength == 'right') {
                        return fb_right.length + fb_center.length / 2;
                    } else {
                        return fb_left.length + fb_center.length / 2;
                    }
                case "FB_weak":
                    if (def.strength == 'left') {
                        return fb_right.length + fb_center.length / 2;
                    } else {
                        return fb_left.length + fb_center.length / 2;
                    }
                case "WR":
                    return wr_all.length;
                case "WR_all":
                    return wr_all.length;
                case "WR_left":
                    return wr_left.length;
                case "WR_right":
                    return wr_right.length;
                case "WR_strong":
                    if (def.strength == 'right') {
                        return wr_right.length;
                    } else {
                        return wr_left.length;
                    }
                case "WR_weak":
                    if (def.strength == 'left') {
                        return wr_right.length;
                    } else {
                        return wr_left.length;
                    }
                case "TE":
                    return te_all.length;
                case "TE_all":
                    return te_all.length;
                case "TE_left":
                    return te_left.length;
                case "TE_right":
                    return te_right.length;
                case "TE_strong":
                    if (def.strength == 'right') {
                        return te_right.length;
                    } else {
                        return te_left.length;
                    }
                case "TE_weak":
                    if (def.strength == 'left') {
                        return te_right.length;
                    } else {
                        return te_left.length;
                    }
                default:
                    //assume it's a number
                    return parseFloat(val);
            }
        }

        //initialize position of each player in the defese
        //we don't have to care about the order that the players appear in the object or file
        for (var pos in this.players) {
            var player = this.players[pos];

            //check if player already has a position defined
            if (typeof (player.x) === 'undefined') {
                player.x = getX(player, this);
            }

            if (typeof (player.y) === 'undefined') {
                player.y = getY(player, this);
            }
        }

        /*
            helper methods to align players horizontally
        */

        function getX(player, def) {
            var h = player.h_align;
            var x;
            switch (h[0]) {
                case "align":
                    x = alignX(h[1], def); //TODO might look into chaining funcitions for padding align().padLeft()
                    break;
                case "apex":
                    x = apex(h[1], h[2], def);
                    break;
                case "left-of":
                    x = leftOf(h[1], h[2], player, def);
                    break;
                case "right-of":
                    x = rightOf(h[1], h[2], player, def);
                    break;
                case "inside":
                    x = inside(h[1], h[2], player, def);
                    break;
                case "outside":
                    x = outside(h[1], h[2], player, def);
                    break;
                case "shade-left":
                    x = shadeLeft(h[1], h[2], def);
                    break;
                case "shade-right":
                    x = shadeRight(h[1], h[2], def);
                    break;
                case "shade-in":
                    x = shadeIn(h[1], h[2], def);
                    break;
                case "shade-out":
                    x = shadeOut(h[1], h[2], def);
                    break;
                case "shade-strong":
                    x = shadeStrong(h[1], h[2], def);
                    break;
                case "shade-weak":
                    x = shadeWeak(h[1], h[2], def);
                    break;
                default:
                //do nothing for now
            }
            return x;
        }

        function alignX(ref, def) {
            ref = getRef(ref, def);

            return ref.x;
        }

        function apex(ref1, ref2, def) {

            ref1 = getRef(ref1, def);
            ref2 = getRef(ref2, def);

            return (ref1.x + ref2.x) / 2;
        }

        function leftOf(ref, dist, player, def) {
            ref = getRef(ref, def);

            //dist is (+) left and (-) right
            return leftEdge(ref, def) + player.radius + dist;
        }

        function rightOf(ref, dist, player, def) {
            ref = getRef(ref, def);

            //dist is (-) left and (+) right
            return rightEdge(ref, def) - player.radius - dist;
        }

        function inside(ref, dist, player, def) {
            var _ref = getRef(ref, def);

            //figure out if inside is left or right
            if (rightEdge(_ref, def) > ball.x) {
                //ref is to the left, inside is to the right
                return rightOf(ref, dist, player, def);

            } else if (leftEdge(_ref, def) < ball.x) {
                //ref is to the right, inside is to the left
                return leftOf(ref, dist, player, def);

            } else {
                //do nothing if the ref is inline with the ball ... could default to alignX
            }
        }

        function outside(ref, dist, player, def) {
            var _ref = getRef(ref, def);

            //figure out if outside is left or right
            if (rightEdge(_ref, def) > ball.x) {
                //ref is to the left, outside is to the left
                return leftOf(ref, dist, player, def);

            } else if (leftEdge(_ref, def) < ball.x) {
                //ref is to the right, outside is to the right
                return rightOf(ref, dist, player, def);

            } else {
                //do nothing if the ref is inline with the ball ... could default to alignX
            }
        }

        function shadeLeft(ref, dist, def) {
            ref = getRef(ref, def);

            //dist is (+) left and (-) right
            return leftEdge(ref, def) + dist;
        }

        function shadeRight(ref, dist, def) {
            ref = getRef(ref, def);

            //dist is (-) left and (+) right
            return rightEdge(ref, def) - dist;
        }

        function shadeIn(ref, dist, def) {
            var _ref = getRef(ref, def);

            //figure out if inside is left or right
            if (rightEdge(_ref, def) > ball.x) {
                //ref is to the left, inside is to the right
                return shadeRight(ref, dist, def);

            } else if (leftEdge(_ref, def) < ball.x) {
                //ref is to the right, inside is to the left
                return shadeLeft(ref, dist, def);

            } else {
                //do nothing if the ref is inline with the ball ... could default to alignX
            }

        }

        function shadeOut(ref, dist, def) {
            var _ref = getRef(ref, def);

            //figure out if outside is left or right
            if (rightEdge(_ref, def) > ball.x) {
                //ref is to the left, outside is to the left
                return shadeLeft(ref, dist, def);

            } else if (leftEdge(_ref, def) < ball.x) {
                //ref is to the right, outside is to the right
                return shadeRight(ref, dist, def);

            } else {
                //do nothing if the ref is inline with the ball ... could default to alignX
            }

        }

        function shadeStrong(ref, dist, def) {
            if (def.strength == 'right') {
                return shadeRight(ref, dist, def);
            } else {
                //assuming this is strong left
                return shadeLeft(ref, dist, def);
            }
        }

        function shadeWeak(ref, dist, def) {
            if (def.strength == 'left') {
                return shadeRight(ref, dist, def);
            } else {
                //assuming this is strong right
                return shadeLeft(ref, dist, def);
            }
        }

        /*
            helper methods to align players vertically
        */

        function getY(player, def) {
            var v = player.v_align;
            var y;
            switch (v[0]) {
                case "align":
                    y = alignY(v[1], def);
                    break;
                case "behind":
                    y = behind(v[1], v[2], player, def);
                    break;
                case "shade-back":
                    y = shadeBack(v[1], v[2], def);
                    break;
                default:
                //do nothing for now
            }
            return y;
        }

        function alignY(ref, def) {
            ref = getRef(ref, def);

            return ref.y;
        }

        function behind(ref, dist, player, def) {
            ref = getRef(ref, def);

            //dist is (-) forward and (+) backward
            return backEdge(ref, def) + player.radius + dist;
        }

        function shadeBack(ref, dist, def) {
            ref = getRef(ref, def);

            //dist is (-) forward and (+) backward
            return backEdge(ref, def) + dist;
        }

        /*
            helper function to map reference to object
        */

        function getRef(ref, def) {
            switch (ref) {
                case 'ball':
                    ref = ball;
                    break;
                case 'hash-left':
                    ref = landmarks.hash_left;
                    break;
                case 'hash-right':
                    ref = landmarks.hash_right;
                    break;
                case 'numbers-left':
                    ref = landmarks.numbers_left;
                    break;
                case 'numbers-right':
                    ref = landmarks.numbers_right;
                    break;
                case 'sideline-left':
                    ref = landmarks.sideline_left;
                    break;
                case 'sideline-right':
                    ref = landmarks.sideline_right;
                    break;
                case 'spot':
                    ref = landmarks.spot;
                    break;
                default:
                    //assume its a player 
                    if (getPerspective(ref, def) == 'defense') {
                        var _ref = def.players[ref];
                    } else {
                        var _ref = temp_offense[ref];
                    }

                    //check that we found the ref
                    if(typeof(_ref) !== 'undefined'){
                        ref = _ref;
                    }else{
                        console.error('Could not find reference "' + ref + '" for defender "' + player.position + '". Defaulting to top sideline.');
                        ref = landmarks.sideline_left;
                    }

                    //check if player ref has x set
                    if (typeof (ref.x) === 'undefined') {
                        //set the y-coordinate for undefined player
                        ref.x = getX(ref, def);
                    }

                    //check if player ref has y set
                    if (typeof (ref.y) === 'undefined') {
                        //set the y-coordinate for undefined player
                        ref.y = getY(ref, def);
                    }
            }
            return ref;
        }

        function leftEdge(ref, def) {
            //figure out perspective of reference (offense or defence)
            var p = getPerspective(ref, def);
            if (p == 'defense') {
                return ref.left_edge;
            } else { //assume offense
                return ref.right_edge;
            }
        }

        function rightEdge(ref, def) {
            //figure out perspective of reference (offense or defence)
            var p = getPerspective(ref, def);
            if (p == 'defense') {
                return ref.right_edge;
            } else { //assume offense
                return ref.left_edge;
            }
        }

        function frontEdge(ref, def) {
            //figure out perspective of reference (offense or defence)
            var p = getPerspective(ref, def);
            if (p == 'defense') {
                return ref.front_edge;
            } else { //assume offense
                return ref.back_edge;
            }
        }

        function backEdge(ref, def) {
            //figure out perspective of reference (offense or defence)
            var p = getPerspective(ref, def);
            if (p == 'defense') {
                return ref.back_edge;
            } else { //assume offense
                return ref.front_edge;
            }
        }

        function getPerspective(ref, def) {
            for (pos in def.players) {
                if (ref === def.players[pos]) {
                    return 'defense';
                }
            }
            return 'offense';
        }
    }
}