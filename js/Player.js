class Player {
    constructor(h,v) {
        this.unit = 'foot';
        this._x;
        this._y;
        this.height;
        this.weight;
        this.front_edge;
        this.back_edge;
        this.left_edge;
        this.right_edge;
        this.h_align = h;
        this.v_align = v;
        
        //based on https://assets.usafootball.com/documents/heads-up-football/riddell-youth-pad-fitting-guide.pdf
        this.radius = 20 / 12 / 2; //TODO make this based on height and weight
    }

    set x(val){
        this._x = val;
        this.left_edge = this.x - this.radius;
        this.right_edge = this.x + this.radius;
    }

    get x(){
        return this._x;
    }

    set y(val){
        this._y = val;
        this.front_edge = this.y + this.radius;
        this.back_edge = this.y - this.radius;
    }

    get y(){
        return this._y;
    }
}