/*
    x-coordinate is left (-) and right (+) from an offensive perspective
    y-coordinate is forward (+) and backwards (-) from an offensive perspective
    TODO: allow perspective to change so we can dynamically figure out edges
*/

class Landmarks {
    constructor(field_data, last_spot) {
        const YARD_TO_FOOT = 3;

        if(last_spot == undefined){
            var last_spot = new Line(
                field_data.total_width / 2, //x in the center
                20 * YARD_TO_FOOT, //default to the 20 yardline (touchback)
                0 //width of zero
            );
        }

        //initialize current spot as last spot
        this.spot = last_spot;

        this.hash_left = new Line(
            field_data.total_width / 2 - field_data.hash_width / 2, //x
            this.spot.y, //y
            field_data.hash_length //width
        );

        this.hash_right = new Line(
            field_data.total_width / 2 + field_data.hash_width / 2, //x
            this.spot.y, //y
            field_data.hash_length //width
        );

        this.numbers_left = new Line(
            field_data.number_top - field_data.number_width / 2, //x
            this.spot.y, //y
            field_data.number_width //width //FIXME make data have consistent names
        );

        this.numbers_right = new Line(
            field_data.total_width - (field_data.number_top - field_data.number_width / 2), //x
            this.spot.y, //y
            field_data.number_width //width //FIXME make data have consistent names
        );

        this.sideline_left = new Boundary(
            0, //x
            this.spot.y, //y
        );

        this.sideline_right = new Boundary(
            field_data.total_width, //x
            this.spot.y, //y
        );

        //update spot if outside hashes
        this.spot.x = Math.min(Math.max(this.spot.x,this.hash_left.right_edge),this.hash_right.left_edge);
    }
}

/*
helper classes, only used by the Field class
*/

class Boundary {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get front_edge() {
        return this.y;
    }

    get back_edge() {
        return this.y;
    }

    get left_edge() {
        if (this.x == 0) {
            Error('Cannot get reference edge that is out of bonds.');
            return undefined;
        } else {
            return this.x;
        }
    }

    get right_edge() {
        if (this.x == 0) {
            return this.x;
        } else {
            Error('Cannot get reference edge that is out of bonds.');
            return undefined;
        }
    }
}

class Line {
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.width = w;
    }

    get front_edge() {
        return this.y;
    }

    get back_edge() {
        return this.y;
    }

    get left_edge() {
        return this.x - this.width / 2;
    }

    get right_edge() {
        return this.x + this.width / 2;
    }
}