/*
    x-coordinate is left (+) and right (-) from a defensive perspective
    y-coordinate is forward (-) and backwards (+) from a defensive perspective
*/

class Defense {
    constructor(formation_data, landmarks, ball, offense) {
        this.roster = [];
        this.personnel = '';
        this.formation = formation_data.name;

        //copy alignment instructions to each player ... TODO pull players from roster based on peronnel 
        var positions = formation_data.positions;
        this.players = {}; //guys on the field ... using an object so we can map to position tags
        for (var pos in positions) {
            this.players[pos] = new Player(
                positions[pos].horizontal,
                positions[pos].vertical
            );
        }

        /*
            create player groups using Player Zones and the offense
        */

        const YARD_TO_FOOT = 3;
        const WR_ZONE_START = 10 * YARD_TO_FOOT;
        const FB_ZONE_START = 5 * YARD_TO_FOOT;

        var temp_offense = {}; //use this to temporarily store offensive players with custom tags

        //starting with the o-line .. it should have 5 players sorted left-to-right from an offensive perspective        
        temp_offense['OT-right'] = offense.o_line[0];
        temp_offense['OG-right'] = offense.o_line[1];
        temp_offense['OC'] = offense.o_line[2];
        temp_offense['OG-left'] = offense.o_line[3];
        temp_offense['OT-left'] = offense.o_line[4];

        //WRs and TEs on the left
        var wr_left = [];
        var te_left = [];
        var o_left = offense.eligible_right; //the offenses right is the defenses left
        var divider = temp_offense['OT-left'].x + WR_ZONE_START;
        for (var i = 0; i < o_left.length; i++) { //we are going inside to outside since this is sorted left to right
            var player = o_left[i];
            if (rightEdge(player, this) < divider) {
                te_left.unshift(player); //use unshift so we can make the outside player first in the array
            } else {
                wr_left.unshift(player);
            }
        }

        //WRs and TEs on the right
        var wr_right = [];
        var te_right = [];
        var o_right = offense.eligible_left; //the offenses left is the defenses right
        var divider = temp_offense['OT-right'].x - WR_ZONE_START;
        for (var i = 0; i < o_right.length; i++) { //we are going outside to inside since this is sorted left to right
            var player = o_right[i];
            if (leftEdge(player, this) > divider) {
                te_right.push(player); //use push so we can make the outside player first in the array
            } else {
                wr_right.push(player);
            }
        }

        //RB and FB
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

        //RB left, right, and center
        var rb_left = [];
        var rb_center = [];
        var rb_right = [];
        for (var i = 0; i < rb_all.length; i++) {
            var player = rb_all[i];
            if (rightEdge(player, this) >= ball.x) {
                rb_left.push(player);
            } else if (leftEdge(player, this) <= ball.x) {
                rb_right.push(player);
            } else {
                rb_center.push(player);
            }
        }

        //FB left, right, and center
        var fb_left = [];
        var fb_center = [];
        var fb_right = [];
        for (var i = 0; i < fb_all.length; i++) {
            var player = fb_all[i];
            if (rightEdge(player, this) >= ball.x) {
                fb_left.push(player);
            } else if (leftEdge(player, this) <= ball.x) {
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
        //initialize position of each player in the defese
        //we split this up so we don't have to care about the order that the players appear in the object or file
        var players = this.players;
        for (var pos in players) {
            var player = players[pos];

            //check if player already has a position defined
            if (typeof (player.x) === 'undefined') {
                player.x = getX(player);
            }

            if (typeof (player.y) === 'undefined') {
                player.y = getY(player);
            }
        }
        this.players = players;

        /*
            helper methods to align players horizontally
        */

        function getX(player) {
            var h = player.h_align;
            var x;
            switch (h[0]) {
                case "align":
                    x = alignX(h[1]); //TODO might look into chaining funcitions for padding align().padLeft()
                    break;
                case "apex":
                    x = apex(h[1], h[2]);
                    break;
                case "left-of":
                    x = leftOf(h[1], h[2], player);
                    break;
                case "right-of":
                    x = rightOf(h[1], h[2], player);
                    break;
                case "shade-left":
                    x = shadeLeft(h[1], h[2]);
                    break;
                case "shade-right":
                    x = shadeRight(h[1], h[2]);
                    break;
                default:
                //do nothing for now
            }
            return x;
        }

        function alignX(ref) {
            ref = getRef(ref);

            return ref.x;
        }

        function apex(ref1, ref2) {

            ref1 = getRef(ref1);
            ref2 = getRef(ref2);

            return (ref1.x + ref2.x) / 2;
        }

        function leftOf(ref, dist, player) {
            ref = getRef(ref);

            //dist is (+) left and (-) right
            return ref.left_edge - player.radius - dist;
        }

        function rightOf(ref, dist, player) {
            ref = getRef(ref);

            //dist is (-) left and (+) right
            return ref.right_edge + player.radius + dist;
        }

        function shadeLeft(ref, dist) {
            ref = getRef(ref);

            //dist is (+) left and (-) right
            return ref.left_edge - dist;
        }

        function shadeRight(ref, dist) {
            ref = getRef(ref);

            //dist is (-) left and (+) right
            return ref.right_edge + dist;
        }

        /*
            helper methods to align players vertically
        */

        function getY(player) {
            var v = player.v_align;
            var y;
            switch (v[0]) {
                case "align":
                    y = alignY(v[1]);
                    break;
                case "behind":
                    y = behind(v[1], v[2], player);
                    break;
                case "shade-back":
                    y = shadeBack(v[1], v[2]);
                    break;
                default:
                //do nothing for now
            }
            return y;
        }

        function alignY(ref) {
            ref = getRef(ref);

            return ref.y;
        }

        function behind(ref, dist, player) {
            ref = getRef(ref);

            //dist is (-) forward and (+) backward
            return ref.back_edge - player.radius - dist;
        }

        function shadeBack(ref, dist) {
            ref = getRef(ref);

            //dist is (-) forward and (+) backward
            return ref.back_edge - dist;
        }

        /*
            helper function to map reference to object
        */

        function getRef(ref) {
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
                    ref = players[ref];

                    //check if player ref has x set
                    if (typeof (ref.x) === 'undefined') {
                        //set the y-coordinate for undefined player
                        ref.x = getX(ref);
                    }

                    //check if player ref has y set
                    if (typeof (ref.y) === 'undefined') {
                        //set the y-coordinate for undefined player
                        ref.y = getY(ref);
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
            if (ref in def.players) {
                return 'defense';
            } else {
                return 'offense';
            }
        }
    }






}