(function() {

mat[2] = mat2;
mat[3] = mat3;
mat[4] = mat4;
mat2.vec = vec2;
mat3.vec = vec3;
mat4.vec = vec4;
mat.eps = 1e-6;

function toDim(l)
{
    switch (l) {
    case 4: return 2;
    case 9: return 3;
    case 16: return 4;
    }
    throw new Error("bad length");
}

mat.make = function(v)
{
    return mat[toDim(v.length)].make(v);
};

mat.map = function(c, f)
{
    return mat[toDim(c.length)].map(c, f);
};

mat.equal = function(m1, m2)
{
    if (m1.length != m2.length) {
        throw new Error("mismatched lengths: " + m1.length + ", " + m2.length);
    }
    return mat[toDim(m1.length)].equal(m1, m2);
};

mat.str = function(m1)
{
    return mat[toDim(m1.length)].str(m1);
};

})();
