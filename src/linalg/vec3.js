function create()
{
  var result = new Float32Array(3);
  result.buffer._type = 'vec3';
  return result;
};
exports.create = create;

function copy(vec)
{
  var result = new Float32Array(3);
  result.buffer._type = 'vec3';
  result[0] = vec[0];
  result[1] = vec[1];
  result[2] = vec[2];
  return result;
};
exports.copy = copy;
exports.make = copy;

function equalEps(v1, v2)
{
  return Math.abs(v1[0] - v2[0]) < vec.eps &&
    Math.abs(v1[1] - v2[1]) < vec.eps &&
    Math.abs(v1[2] - v2[2]) < vec.eps;
};
exports.equalEps = equalEps;

function equal(v1, v2)
{
  return v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2];
};
exports.equal = equal;

function random()
{
  var result = vec3.make([Math.random(), Math.random(), Math.random()]);
  return result;
};
exports.random = random;

function set(dest, vec)
{
  dest[0] = vec[0];
  dest[1] = vec[1];
  dest[2] = vec[2];
  return dest;
};
exports.set = set;

function plus(v1, v2)
{
  var result = new Float32Array(3);
  result.buffer._type = 'vec3';
  result[0] = v1[0] + v2[0];
  result[1] = v1[1] + v2[1];
  result[2] = v1[2] + v2[2];
  return result;
};
exports.plus = plus;

function add(dest, other)
{
  dest[0] += other[0];
  dest[1] += other[1];
  dest[2] += other[2];
  return dest;
};
exports.add = add;

function minus(v1, v2)
{
  var result = new Float32Array(3);
  result.buffer._type = 'vec3';
  result[0] = v1[0] - v2[0];
  result[1] = v1[1] - v2[1];
  result[2] = v1[2] - v2[2];
  return result;
};
exports.minus = minus;

function subtract(dest, other)
{
  dest[0] -= other[0];
  dest[1] -= other[1];
  dest[2] -= other[2];
  return dest;
};
exports.subtract = subtract;

function negative(v)
{
  var result = new Float32Array(3);
  result.buffer._type = 'vec3';
  result[0] = -v[0];
  result[1] = -v[1];
  result[2] = -v[2];
  return result;
};
exports.negative = negative;

function negate(dest)
{
  dest[0] = -dest[0];
  dest[1] = -dest[1];
  dest[2] = -dest[2];
  return dest;
};
exports.negate = negate;

function scaling(vec, val)
{
  var result = new Float32Array(3);
  result.buffer._type = 'vec3';
  result[0] = vec[0]*val;
  result[1] = vec[1]*val;
  result[2] = vec[2]*val;
  return result;
};
exports.scaling = scaling;

function scale(dest, val)
{
  dest[0] *= val;
  dest[1] *= val;
  dest[2] *= val;
  return dest;
};
exports.scale = scale;

function schurProduct(v1, v2)
{
  var result = new Float32Array(3);
  result.buffer._type = 'vec3';
  result[0] = v1[0] * v2[0];
  result[1] = v1[1] * v2[1];
  result[2] = v1[2] * v2[2];
  return result;
};
exports.schurProduct = schurProduct;

function schurMultiply(dest, other)
{
  dest[0] *= other[0];
  dest[1] *= other[1];
  dest[2] *= other[2];
  return dest;
};
exports.schurMultiply = schurMultiply;

function normalized(vec)
{
  var result = new Float32Array(3);
  result.buffer._type = 'vec3';
  var x = vec[0], y = vec[1], z = vec[2];
  var len = Math.sqrt(x*x + y*y + z*z);
  if (!len)
    return result;
  if (len == 1) {
    result[0] = x;
    result[1] = y;
    result[2] = z;
    return result;
  }
  result[0] = x / len;
  result[1] = y / len;
  result[2] = z / len;
  return result;
};
exports.normalized = normalized;

function normalize(dest)
{
  var x = dest[0], y = dest[1], z = dest[2];
  var len = Math.sqrt(x*x + y*y + z*z);
  if (!len) {
    dest[0] = dest[1] = dest[2] = 0;
    return dest;
  }
  dest[0] /= len;
  dest[1] /= len;
  dest[2] /= len;
  return dest;
};
exports.normalize = normalize;

function cross(v1, v2)
{
  var x1 = v1[0], y1 = v1[1], z1 = v1[2];
  var x2 = v2[0], y2 = v2[1], z2 = v2[2];
  var result = new Float32Array(3);
  result.buffer._type = 'vec3';
  result[0] = y1 * z2 - z1 * y2;
  result[1] = z1 * x2 - x1 * z2;
  result[2] = x1 * y2 - y1 * x2;
  return result;
};
exports.cross = cross;

function length(vec)
{
  var x = vec[0], y = vec[1], z = vec[2];
  return Math.sqrt(x*x + y*y + z*z);
};
exports.length = length;

function length2(vec)
{
  return vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2];
};
exports.length2 = length2;

function dot(v1, v2)
{
  return v1[0] * v2[0] + 
    v1[1] * v2[1] + 
    v1[2] * v2[2];
};
exports.dot = dot;

function map(vec, f) {
  return vec3.make(_.map(vec, f));
};
exports.map = map;

function str(v) { 
  return "[" + v[0] + ", " + v[1] + ", " + v[2] + "]";
};
exports.str = str;

/* Local Variables:  */
/* mode: js2         */
/* js2-basic-offset: 2 */
/* End:              */
