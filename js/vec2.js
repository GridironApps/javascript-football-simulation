vec2 = function (x, y) {
    return p2.vec2.set(p2.vec2.create(), x, y);
}

vec2.add = function (a, b) {
    return p2.vec2.add(p2.vec2.create(), a, b);
}

vec2.clone = function (a) {
    return p2.vec2.clone(a);
}

vec2.copy = function (a) {
    return p2.vec2.copy(p2.vec2.create(), a);
}

vec2.create = function () {
    return p2.vec2.create();
}