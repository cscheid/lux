var vec4 = {};

vec4.create = function()
{
    var result = new Float32Array(4);
    result._type = 'vector';
    return result;
};

vec4.copy = function(vec)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = vec[0];
    result[1] = vec[1];
    result[2] = vec[2];
    result[3] = vec[3];
    return result;
};

vec4.make = vec4.copy;

vec4.random = function() {
    var lst = [Math.random(), Math.random(), Math.random(), Math.random()];
    return vec4.make(lst);
};

vec4.equal_eps = function(v1, v2)
{
    return Math.abs(v1[0] - v2[0]) < vec.eps &&
        Math.abs(v1[1] - v2[1]) < vec.eps &&
        Math.abs(v1[2] - v2[2]) < vec.eps &&
        Math.abs(v1[3] - v2[3]) < vec.eps;
};

vec4.equal = function(v1, v2)
{
    return v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2] && v1[3] === v2[3];
};

vec4.set = function(dest, vec)
{
    dest[0] = vec[0];
    dest[1] = vec[1];
    dest[2] = vec[2];
    dest[3] = vec[3];
    return dest;
};

vec4.plus = function(v1, v2)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = v1[0] + v2[0];
    result[1] = v1[1] + v2[1];
    result[2] = v1[2] + v2[2];
    result[3] = v1[3] + v2[3];
    return result;
};

vec4.add = function(dest, other)
{
    dest[0] += other[0];
    dest[1] += other[1];
    dest[2] += other[2];
    dest[3] += other[3];
    return dest;
};

vec4.minus = function(v1, v2)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = v1[0] - v2[0];
    result[1] = v1[1] - v2[1];
    result[2] = v1[2] - v2[2];
    result[3] = v1[3] - v2[3];
    return result;
};

vec4.subtract = function(dest, other)
{
    dest[0] -= other[0];
    dest[1] -= other[1];
    dest[2] -= other[2];
    dest[3] -= other[3];
    return dest;
};

vec4.negative = function(v)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = -v[0];
    result[1] = -v[1];
    result[2] = -v[2];
    result[3] = -v[3];
    return result;
};

vec4.negate = function(dest)
{
    dest[0] = -dest[0];
    dest[1] = -dest[1];
    dest[2] = -dest[2];
    dest[3] = -dest[3];
    return dest;
};

vec4.scaling = function(vec, val)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = vec[0]*val;
    result[1] = vec[1]*val;
    result[2] = vec[2]*val;
    result[3] = vec[3]*val;
    return result;
};

vec4.scale = function(dest, val)
{
    dest[0] *= val;
    dest[1] *= val;
    dest[2] *= val;
    dest[3] *= val;
    return dest;
};

vec4.schur_product = function(v1, v2)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    result[0] = v1[0] * v2[0];
    result[1] = v1[1] * v2[1];
    result[2] = v1[2] * v2[2];
    result[3] = v1[3] * v2[3];
    return result;
};

vec4.schur_multiply = function(dest, other)
{
    dest[0] *= other[0];
    dest[1] *= other[1];
    dest[2] *= other[2];
    dest[3] *= other[3];
    return dest;
};

vec4.normalized = function(vec)
{
    var result = new Float32Array(4);
    result._type = 'vector';
    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    var len = Math.sqrt(x*x + y*y + z*z + w*w);
    if (!len)
        return result;
    if (len == 1) {
        result[0] = x;
        result[1] = y;
        result[2] = z;
        result[3] = w;
        return result;
    }
    result[0] = x / len;
    result[1] = y / len;
    result[2] = z / len;
    result[3] = w / len;
    return result;
};

vec4.normalize = function(dest)
{
    var x = dest[0], y = dest[1], z = dest[2], w = dest[3];
    var len = Math.sqrt(x*x + y*y + z*z + w*w);
    if (!len) {
        dest[0] = dest[1] = dest[2] = dest[3] = 0;
        return dest;
    }
    dest[0] /= len;
    dest[1] /= len;
    dest[2] /= len;
    dest[3] /= len;
    return dest;
};

vec4.length = function(vec)
{
    var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

vec4.length2 = function(vec)
{
    return vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2] + vec[3] * vec[3];
};

vec4.dot = function(v1, v2)
{
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2] + v1[3] * v2[3];
};

vec4.map = function(vec, f) {
    return vec4.make(_.map(vec, f));
};

vec4.str = function(v) { 
    return "[" + v[0] + ", " + v[1] + ", " + v[2] + ", " + v[3] + "]";
};
