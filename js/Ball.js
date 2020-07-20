/*
    x-coordinate is left (-) and right (+) from an offensive perspective
    y-coordinate is forward (+) and backwards (-) from an offensive perspective
*/

class Ball {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.length = 11 / 12;
        this.width = 7 / 12;
        this.left_edge = this.x - this.width / 2;
        this.right_edge = this.x + this.width / 2;
        this.back_edge = this.y - this.length;
        this.front_edge = this.y;
    }
}