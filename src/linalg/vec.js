import vec2 from './vec2.js';
import vec3 from './vec3.js';
import vec4 from './vec4.js';
import mat2 from './mat2.js';
import mat3 from './mat3.js';
import mat4 from './mat4.js';

// A thin veneer of polymorphic convenience over the fast vec classes
// for when you can get away with a little slowness.

var vec = {};

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

vec.equalEps = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw new Error("mismatched lengths");
    }
    return vec[v1.length].equalEps(v1, v2);
};

vec.equal = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw new Error("mismatched lengths");
    }
    return vec[v1.length].equal(v1, v2);
};

vec.plus = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw new Error("mismatched lengths");
    }
    return vec[v1.length].plus(v1, v2);
};

vec.minus = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw new Error("mismatched lengths");
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

vec.schurProduct = function(v1, v2)
{
    if (v1.length != v2.length) {
        throw new Error("mismatched lengths");
    }
    return vec[v1.length].schurProduct(v1, v2);
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
        throw new Error("mismatched lengths");
    }
    return vec[v1.length].dot(v1, v2);
};

vec.map = function(c, f)
{
    return vec[c.length].map(c, f);
};

/*
// strictly speaking, this is unnecessary, since only vec2.cross and vec3.cross exist.
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

exports.vec = vec;
