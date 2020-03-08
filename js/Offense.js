/*
    x-coordinate is left (-) and right (+) from an offensive perspective
    y-coordinate is forward (+) and backwards (-) from an offensive perspective
*/

class Offense {
    constructor(formation_data, landmarks, ball) {
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

        //initialize position of each player in the offense 
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
                    x = apex(h[1],h[2]);
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
    }
}