var vec2 = {};

vec2.create = function()
{
    var result = new Float32Array(2);
    result.buffer._type = 'vec2';
    return result;
};

vec2.copy = function(vec)
{
    var result = new Float32Array(2);
    result.buffer._type = 'vec2';
    result[0] = vec[0];
    result[1] = vec[1];
    return result;
};

vec2.make = vec2.copy;

vec2.equalEps = function(v1, v2)
{
    return Math.abs(v1[0] - v2[0]) < vec.eps &&
        Math.abs(v1[1] - v2[1]) < vec.eps;
};

vec2.equal = function(v1, v2)
{
    return v1[0] === v2[0] && v1[1] === v2[1];
};

vec2.random = function()
{
    var result = vec2.make([Math.random(), Math.random()]);
    return result;
};

vec2.set = function(dest, vec)
{
    dest[0] = vec[0];
    dest[1] = vec[1];
    return dest;
};

vec2.plus = function(v1, v2)
{
    var result = new Float32Array(2);
    result.buffer._type = 'vec2';
    result[0] = v1[0] + v2[0];
    result[1] = v1[1] + v2[1];
    return result;
};

vec2.add = function(dest, other)
{
    dest[0] += other[0];
    dest[1] += other[1];
    return dest;
};

vec2.minus = function(v1, v2)
{
    var result = new Float32Array(2);
    result.buffer._type = 'vec2';
    result[0] = v1[0] - v2[0];
    result[1] = v1[1] - v2[1];
    return result;
};

vec2.subtract = function(dest, other)
{
    dest[0] -= other[0];
    dest[1] -= other[1];
    return dest;
};

vec2.negative = function(v)
{
    var result = new Float32Array(2);
    result.buffer._type = 'vec2';
    result[0] = -v[0];
    result[1] = -v[1];
    return result;
};

vec2.negate = function(dest)
{
    dest[0] = -dest[0];
    dest[1] = -dest[1];
    return dest;
};

vec2.scaling = function(vec, val)
{
    var result = new Float32Array(2);
    result.buffer._type = 'vec2';
    result[0] = vec[0]*val;
    result[1] = vec[1]*val;
    return result;
};

vec2.scale = function(dest, val)
{
    dest[0] *= val;
    dest[1] *= val;
    return dest;
};

vec2.schurProduct = function(v1, v2)
{
    var result = new Float32Array(2);
    result.buffer._type = 'vec2';
    result[0] = v1[0] * v2[0];
    result[1] = v1[1] * v2[1];
    return result;
};

vec2.schurMultiply = function(dest, other)
{
    dest[0] *= other[0];
    dest[1] *= other[1];
    return dest;
};

vec2.normalized = function(vec)
{
    var result = new Float32Array(2);
    result.buffer._type = 'vec2';
    var x = vec[0], y = vec[1];
    var len = Math.sqrt(x*x + y*y);
    if (!len)
        return result;
    if (len == 1) {
        result[0] = x;
        result[1] = y;
        return result;
    }
    result[0] = x / len;
    result[1] = y / len;
    return result;
};

vec2.normalize = function(dest)
{
    var x = dest[0], y = dest[1];
    var len = Math.sqrt(x*x + y*y);
    if (!len) {
        dest[0] = dest[1] = 0;
        return dest;
    }
    dest[0] /= len;
    dest[1] /= len;
    return dest;
};

vec2.length = function(vec)
{
    var x = vec[0], y = vec[1];
    return Math.sqrt(x*x + y*y);
};

vec2.length2 = function(vec)
{
    return vec[0] * vec[0] + vec[1] * vec[1];
};

vec2.dot = function(v1, v2)
{
    return v1[0] * v2[0] + v1[1] * v2[1];
};

vec2.map = function(vec, f) {
    return vec2.make(_.map(vec, f));
};

vec2.str = function(v) { return "[" + v[0] + ", " + v[1] + "]"; };

vec2.cross = function(v0, v1) {
    return v0[0] * v1[1] - v0[1] * v1[0];
};
