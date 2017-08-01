function create()
{
  var result = new Float32Array(9);
  result.buffer._type = 'mat3';
  return result;
};
exports.create = create;

function copy(mat)
{
  var result = new Float32Array(9);
  result.buffer._type = 'mat3';
  result[0] = mat[0];
  result[1] = mat[1];
  result[2] = mat[2];
  result[3] = mat[3];
  result[4] = mat[4];
  result[5] = mat[5];
  result[6] = mat[6];
  result[7] = mat[7];
  result[8] = mat[8];
  return result;
};
exports.copy = copy;
exports.make = copy;

function equal(v1, v2)
{
  return Math.abs(v1[0] - v2[0]) < mat.eps &&
    Math.abs(v1[1] - v2[1]) < mat.eps &&
    Math.abs(v1[2] - v2[2]) < mat.eps &&
    Math.abs(v1[3] - v2[3]) < mat.eps &&
    Math.abs(v1[4] - v2[4]) < mat.eps &&
    Math.abs(v1[5] - v2[5]) < mat.eps &&
    Math.abs(v1[6] - v2[6]) < mat.eps &&
    Math.abs(v1[7] - v2[7]) < mat.eps &&
    Math.abs(v1[8] - v2[8]) < mat.eps;
};
exports.equal = equal;

function random()
{
  var result = new Float32Array(9);
  result.buffer._type = 'mat3';
  result[0] = Math.random();
  result[1] = Math.random();
  result[2] = Math.random();
  result[3] = Math.random();
  result[4] = Math.random();
  result[5] = Math.random();
  result[6] = Math.random();
  result[7] = Math.random();
  result[8] = Math.random();
  return result;
};
exports.random = random;

function set(dest, mat)
{
  dest[0] = mat[0];
  dest[1] = mat[1];
  dest[2] = mat[2];
  dest[3] = mat[3];
  dest[4] = mat[4];
  dest[5] = mat[5];
  dest[6] = mat[6];
  dest[7] = mat[7];
  dest[8] = mat[8];
  return dest;
};
exports.set = set;

var _identity = new Float32Array([1,0,0,
                                  0,1,0,
                                  0,0,1]);

function identity()
{
  var result = new Float32Array(_identity);
  result.buffer._type = 'mat3';
  return result;
};
exports.identity = identity;

function setIdentity(mat)
{
  mat3.set(mat, _identity);
  return mat;
};
exports.setIdentity = setIdentity;

function transpose(mat)
{
  var result = new Float32Array(9);
  result.buffer._type = 'mat3';
  result[0] = mat[0];
  result[1] = mat[3];
  result[2] = mat[6];
  result[3] = mat[1];
  result[4] = mat[4];
  result[5] = mat[7];
  result[6] = mat[2];
  result[7] = mat[5];
  result[8] =  mat[8];
  return result;
};
exports.transpose = transpose;

function setTranspose(dest, mat)
{
  if (mat == dest) {
    var a01 = mat[1], a02 = mat[2];
    var a12 = mat[5];
    dest[1] = mat[3];
    dest[2] = mat[6];
    dest[3] = a01;
    dest[5] = mat[7];
    dest[6] = a02;
    dest[7] = a12;
    return dest;
  } else {
    dest[0] = mat[0];
    dest[1] = mat[3];
    dest[2] = mat[6];
    dest[3] = mat[1];
    dest[4] = mat[4];
    dest[5] = mat[7];
    dest[6] = mat[2];
    dest[7] = mat[5];
    dest[8] = mat[8];
    return dest;
  }
};
exports.setTranspose = setTranspose;

function determinant(mat)
{
  var a00 = mat[0], a01 = mat[1], a02 = mat[2];
  var a10 = mat[3], a11 = mat[4], a12 = mat[5];
  var a20 = mat[6], a21 = mat[7], a22 = mat[8];
  
  return a00*a11*a22 + a01*a12*a20 + a02*a10*a21
    - a02*a11*a20 - a01*a10*a22 - a00*a12*a21;
};
exports.determinant = determinant;

// From glMatrix
function inverse(mat)
{
  var result = new Float32Array(9);
  result.buffer._type = 'mat3';
  
  var a00 = mat[0], a01 = mat[3], a02 = mat[6];
  var a10 = mat[1], a11 = mat[4], a12 = mat[7];
  var a20 = mat[2], a21 = mat[5], a22 = mat[8];
  
  // Calculate the determinant (inlined to avoid double-caching)
  // var det = mat3.determinant(mat);
  var det = a00*a11*a22 + a01*a12*a20 + a02*a10*a21
        - a02*a11*a20 - a01*a10*a22 - a00*a12*a21;
  if (det === 0)
    throw new Error("Singular matrix");

  result[0] = ( a11*a22 - a12*a21)/det;
  result[1] = (-a10*a22 + a12*a20)/det;
  result[2] = ( a10*a21 - a11*a20)/det;
  result[3] = (-a01*a22 + a02*a21)/det;
  result[4] = ( a00*a22 - a02*a20)/det;
  result[5] = (-a00*a21 + a01*a20)/det;
  result[6] = ( a01*a12 - a02*a11)/det;
  result[7] = (-a00*a12 + a02*a10)/det;
  result[8] = ( a00*a11 - a01*a10)/det;

  return result;
};
exports.inverse = inverse;

// From glMatrix
function invert(mat)
{
  var a00 = mat[0], a01 = mat[3], a02 = mat[6];
  var a10 = mat[1], a11 = mat[4], a12 = mat[7];
  var a20 = mat[2], a21 = mat[5], a22 = mat[8];
  
  // Calculate the determinant (inlined to avoid double-caching)
  var det = a00*a11*a22 + a01*a12*a20 + a02*a10*a21
        - a02*a11*a20 - a01*a10*a22 - a00*a12*a21;
  if (det === 0)
    throw new Error("Singular mat3");

  mat[0] = ( a11*a22 - a12*a21)/det;
  mat[1] = (-a10*a22 + a12*a20)/det;
  mat[2] = ( a10*a21 - a11*a20)/det;
  mat[3] = (-a01*a22 + a02*a21)/det;
  mat[4] = ( a00*a22 - a02*a20)/det;
  mat[5] = (-a00*a21 + a01*a20)/det;
  mat[6] = ( a01*a12 - a02*a11)/det;
  mat[7] = (-a00*a12 + a02*a10)/det;
  mat[8] = ( a00*a11 - a01*a10)/det;

  return mat;
};
exports.invert = invert;

function asMat4(mat)
{
  var result = new Float32Array(9);
  result.buffer._type = 'mat4';
  result[0]  = mat[0];
  result[1]  = mat[1];
  result[2]  = mat[2];
  result[4]  = mat[3];
  result[5]  = mat[4];
  result[6]  = mat[5];
  result[8]  = mat[6];
  result[9]  = mat[7];
  result[10] = mat[8];
  return result;
};
exports.asMat4 = asMat4;

function asMat2(mat)
{
  var result = new Float32Array(4);
  result.buffer._type = 'mat2';
  result[0] = mat[0];
  result[1] = mat[1];
  result[2] = mat[3];
  result[3] = mat[4];
  return result;
};
exports.asMat2 = asMat2;

// from glMatrix
function product(m1, m2)
{
  var result = new Float32Array(9);
  result.buffer._type = 'mat3';
  
  // Cache the matrix values (makes for huge speed increases!)
  var a00 = m1[0],  a01 = m1[1],  a02 = m1[2];
  var a10 = m1[3],  a11 = m1[4],  a12 = m1[5];
  var a20 = m1[6],  a21 = m1[7],  a22 = m1[8];
  
  var b00 = m2[0],  b01 = m2[1],  b02 = m2[2];
  var b10 = m2[3],  b11 = m2[4],  b12 = m2[5];
  var b20 = m2[6],  b21 = m2[7],  b22 = m2[8];
  
  result[0] = b00*a00 + b01*a10 + b02*a20;
  result[1] = b00*a01 + b01*a11 + b02*a21;
  result[2] = b00*a02 + b01*a12 + b02*a22;
  result[3] = b10*a00 + b11*a10 + b12*a20;
  result[4] = b10*a01 + b11*a11 + b12*a21;
  result[5] = b10*a02 + b11*a12 + b12*a22;
  result[6] = b20*a00 + b21*a10 + b22*a20;
  result[7] = b20*a01 + b21*a11 + b22*a21;
  result[8] = b20*a02 + b21*a12 + b22*a22;
  
  return result;
};
exports.product = product;

// from glMatrix
function multiply(dest, other)
{
  // Cache the matrix values (makes for huge speed increases!)
  var a00 = dest[0],  a01 = dest[1],  a02 = dest[2]; 
  var a10 = dest[3],  a11 = dest[4],  a12 = dest[5]; 
  var a20 = dest[6],  a21 = dest[7],  a22 = dest[8];
  
  var b00 = other[0],  b01 = other[1],  b02 = other[2]; 
  var b10 = other[3],  b11 = other[4],  b12 = other[5]; 
  var b20 = other[6],  b21 = other[7],  b22 = other[8];
  
  dest[0] = b00*a00 + b01*a10 + b02*a20;
  dest[1] = b00*a01 + b01*a11 + b02*a21;
  dest[2] = b00*a02 + b01*a12 + b02*a22;
  dest[3] = b10*a00 + b11*a10 + b12*a20;
  dest[4] = b10*a01 + b11*a11 + b12*a21;
  dest[5] = b10*a02 + b11*a12 + b12*a22;
  dest[6] = b20*a00 + b21*a10 + b22*a20;
  dest[7] = b20*a01 + b21*a11 + b22*a21;
  dest[8] = b20*a02 + b21*a12 + b22*a22;
  
  return dest;
};
exports.multiply = multiply;

function productVec(mat, vec)
{
  var result = new Float32Array(3);
  result.buffer._type = 'vec3';
  var x = vec[0], y = vec[1], z = vec[2];
  result[0] = mat[0]*x + mat[3]*y + mat[6]*z;
  result[1] = mat[1]*x + mat[4]*y + mat[7]*z;
  result[2] = mat[2]*x + mat[5]*y + mat[8]*z;
  return result;
};
exports.productVec = productVec;

function multiplyVec(mat, vec)
{
  var x = vec[0], y = vec[1], z = vec[2];
  vec[0] = mat[0]*x + mat[3]*y + mat[6]*z;
  vec[1] = mat[1]*x + mat[4]*y + mat[7]*z;
  vec[2] = mat[2]*x + mat[5]*y + mat[8]*z;
  return vec;
};
exports.multiplyVec = multiplyVec;

function frobeniusNorm(mat)
{
  return Math.sqrt(mat[0] * mat[0] +
                   mat[1] * mat[1] +
                   mat[2] * mat[2] +
                   mat[3] * mat[3] +
                   mat[4] * mat[4] +
                   mat[5] * mat[5] +
                   mat[6] * mat[6] +
                   mat[7] * mat[7] +
                   mat[8] * mat[8]);
};
exports.frobeniusNorm = frobeniusNorm;

function map(mat, f)
{
  return mat3.make(_.map(mat, f));
};
exports.map = map;

function str(mat)
{
  return "[ [" + mat[0] + "] [" + mat[3] + "] [" + mat[6] + "] ]\n" +
    "[ [" + mat[1] + "] [" + mat[4] + "] [" + mat[7] + "] ]\n" +
    "[ [" + mat[2] + "] [" + mat[5] + "] [" + mat[8] + "] ]";
};
exports.str = str;

/* Local Variables:  */
/* mode: js2         */
/* js2-basic-offset: 2 */
/* End:              */
