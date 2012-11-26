// A thin veneer of polymorphic convenience over the fast vec classes
// for when you can get away with a little slowness.

vec[2] = vec2;
vec[3] = vec3;
vec[4] = vec4;
vec2.mat = mat2;
vec3.mat = mat3;
vec4.mat = mat4;
vec.eps = 1e-6;

vec.make = function(v)
{
    return vec[v.length].make(v);
};

vec.equal_eps = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw "mismatched lengths";
    }
    return vec[v1.length].equal_eps(v1, v2);
};

vec.equal = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw "mismatched lengths";
    }
    return vec[v1.length].equal(v1, v2);
};

vec.plus = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw "mismatched lengths";
    }
    return vec[v1.length].plus(v1, v2);
};

vec.minus = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw "mismatched lengths";
    }
    return vec[v1.length].minus(v1, v2);
};

vec.negative = function(v)
{
    return vec[v.length].negative(v);
};

vec.scaling = function(v, val)
{
    return vec[v.length].scaling(v, val);
};

vec.schur_product = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw "mismatched lengths";
    }
    return vec[v1.length].schur_product(v1, v2);
};

vec.normalized = function(v)
{
    return vec[v.length].normalized(v);
};

vec.length = function(v)
{
    return vec[v.length].length(v);
};

vec.length2 = function(v)
{
    return vec[v.length].length2(v);
};

vec.dot = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw "mismatched lengths";
    }
    return vec[v1.length].dot(v1, v2);
};

vec.map = function(c, f)
{
    return vec[c.length].map(c, f);
};

/*
// strictly speaking, this is unnecessary, since only vec3.cross exists.
// However, to force vec3.* to be written alongside vec.* would mean that
// some code would be written
// x = vec.normalized(foo);
// y = vec.normalized(bar);
// z = vec3.cross(x, y);

// instead of

// z = vec.cross(x, y);

// The notational uniformity of the latter wins
*/

vec.cross = function(v1, v2)
{
    return vec[v1.length].cross(v1, v2);
};

vec.str = function(v)
{
    return vec[v.length].str(v);
};
