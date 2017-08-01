function create()
{
    var result = new Float32Array(4);
    result.buffer._type = 'mat2';
    return result;
};
exports.create = create;

function copy(mat)
{
    var result = new Float32Array(4);
    result.buffer._type = 'mat2';
    result[0] = mat[0];
    result[1] = mat[1];
    result[2] = mat[2];
    result[3] = mat[3];
    return result;
};
exports.copy = copy;
exports.make = copy;

function equal(v1, v2)
{
    return Math.abs(v1[0] - v2[0]) < mat.eps &&
        Math.abs(v1[1] - v2[1]) < mat.eps &&
        Math.abs(v1[2] - v2[2]) < mat.eps &&
        Math.abs(v1[3] - v2[3]) < mat.eps;
};
exports.equal = equal;

function random()
{
    var result = new Float32Array(4);
    result.buffer._type = 'mat2';
    result[0] = Math.random();
    result[1] = Math.random();
    result[2] = Math.random();
    result[3] = Math.random();
    return result;
};
exports.random = random;

function set(dest, mat)
{
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    return dest;
};
exports.set = set;

var _identity = new Float32Array([1,0,0,1]);

function identity()
{
    var result = new Float32Array(_identity);
    result.buffer._type = 'mat2';
    return result;
};
exports.identity = identity;

function setIdentity(mat)
{
    mat2.set(mat, _identity);
    return mat;
};
exports.setIdentity = setIdentity;

function transpose(mat)
{
    var result = new Float32Array(4);
    result.buffer._type = 'mat2';
    result[0] = mat[0];
    result[1] = mat[2];
    result[2] = mat[1];
    result[3] = mat[3];
    return result;
};
exports.transpose = transpose;

function setTranspose(dest, mat)
{
    if (mat == dest) {
        var a01 = mat[1];
        dest[1] = mat[2];
        dest[2] = a01;
        return dest;
    } else {
        dest[0] = mat[0];
        dest[1] = mat[2];
        dest[2] = mat[1];
        dest[3] = mat[3];
        return dest;
    }
};
exports.setTranspose = setTranspose;

function determinant(mat)
{
    return mat[0]*mat[3] - mat[1]*mat[2];
};
exports.determinant = determinant;

// From glMatrix
function inverse(mat)
{
    var result = new Float32Array(4);
    result.buffer._type = 'mat2';
	
    var a00 = mat[0], a01 = mat[1];
    var a10 = mat[2], a11 = mat[3];
    
    // Calculate the determinant (inlined to avoid double-caching)
    var det = (a00*a11 - a01*a10);
    if (det === 0)
        throw new Error("Singular matrix");

    result[0] =  a11/det;
    result[1] = -a01/det;
    result[2] = -a10/det;
    result[3] =  a00/det;

    return result;
};
exports.inverse = inverse;

function invert(mat)
{
    var a00 = mat[0], a01 = mat[1];
    var a10 = mat[2], a11 = mat[3];
    
    // Calculate the determinant (inlined to avoid double-caching)
    var det = (a00*a11 - a01*a10);
    if (det === 0)
        throw new Error("Singular matrix");

    mat[0] =  a11/det;
    mat[1] = -a01/det;
    mat[2] = -a10/det;
    mat[3] =  a00/det;

    return mat;
};
exports.invert = invert;

function asMat4(mat)
{
    var result = new Float32Array(16);
    result.buffer._type = 'mat4';
    result[0]  = mat[0];
    result[1]  = mat[1];
    result[4]  = mat[2];
    result[5]  = mat[3];
    return result;
};
exports.asMat4 = asMat4;

function asMat3(mat)
{
    var result = new Float32Array(9);
    result.buffer._type = 'mat3';
    result[0] = mat[0];
    result[1] = mat[1];
    result[3] = mat[2];
    result[4] = mat[3];
    return result;
};
exports.asMat3 = asMat3;

// from glMatrix
function product(m1, m2)
{
    var result = new Float32Array(4);
    result.buffer._type = 'mat2';

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = m1[0],  a01 = m1[1];
    var a10 = m1[2],  a11 = m1[3];
    
    var b00 = m2[0],  b01 = m2[1];
    var b10 = m2[2],  b11 = m2[3];
    
    result[0] = b00*a00 + b01*a10;
    result[1] = b00*a01 + b01*a11;
    result[2] = b10*a00 + b11*a10;
    result[3] = b10*a01 + b11*a11;
    
    return result;
};
exports.product = product;

// from glMatrix
function multiply(dest, other)
{
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = dest[0],  a01 = dest[1]; 
    var a10 = dest[2],  a11 = dest[3]; 
    
    var b00 = other[0],  b01 = other[1]; 
    var b10 = other[2],  b11 = other[3]; 
    
    dest[0] = b00*a00 + b01*a10;
    dest[1] = b00*a01 + b01*a11;
    dest[2] = b10*a00 + b11*a10;
    dest[3] = b10*a01 + b11*a11;
    
    return dest;
};
exports.multiply = multiply;

function productVec(mat, vec)
{
    var result = new Float32Array(2);
    result.buffer._type = 'vec2';
    var x = vec[0], y = vec[1];
    result[0] = mat[0]*x + mat[2]*y;
    result[1] = mat[1]*x + mat[3]*y;
    return result;
};
exports.productVec = productVec;

function multiplyVec(mat, vec)
{
    var x = vec[0], y = vec[1];
    vec[0] = mat[0]*x + mat[2]*y;
    vec[1] = mat[1]*x + mat[3]*y;
    return vec;
};
exports.multiplyVec = multiplyVec;

function frobeniusNorm(mat)
{
    return Math.sqrt(mat[0] * mat[0] +
                     mat[1] * mat[1] +
                     mat[2] * mat[2] +
                     mat[3] * mat[3]);
};
exports.frobeniusNorm = frobeniusNorm;

function map(mat, f)
{
    return mat2.make(_.map(mat, f));
};
exports.map = map;

function str(mat)
{
    return "[ [" + mat[0] + "] [" + mat[2] + "] ]\n" +
        "[ [" + mat[1] + "] [" + mat[3] + "] ]";
};
exports.str = str;
