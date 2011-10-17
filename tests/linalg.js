module("Linalg tests");

function eps_equal(x, y, eps)
{
    if (!eps) eps = vec.eps;
    return Math.abs(x - y) < eps;
};

function eps_less(x, y)
{
    return (x - y) < vec.eps;
};

test("vec properties", function() {
    var v = vec4.make([1,2,3,4]);
    equal(vec4.dot(v, v), 30);
    ok(vec4.equal(vec4.plus(vec4.make([1,2,3,4]),
                            vec4.make([3,4,2,1])),
                  vec4.make([4,6,5,5])));

    _.each([2, 3, 4], function (d) {
        var t = vec[d];
        var v1 = t.random();
        var v2 = t.random();
        var v3 = t.random();
        var s = Math.random();
        ok(t.dot(v1, v1) > 0);
        ok(eps_less(t.dot(v1, v2) * t.dot(v1, v2), 
                    t.dot(v1, v1) * t.dot(v2, v2)));
        ok(t.equal(t.plus(v1, v2), t.minus(v1, t.negative(v2))),
           "add_minus_negative " + d);
        ok(t.equal(t.minus(v1, v2), t.plus(v1, t.negative(v2))),
           "minus_add_negative " + d);
        ok(eps_equal(t.dot(v1, t.scaling(v2, s)),
                     t.dot(t.scaling(v1, s), v2)), "dot scale");
        ok(eps_equal(t.dot(v1, t.scaling(v2, s)), 
                     s * t.dot(v1, v2)), "dot scale");
        ok(eps_equal(t.length(t.scaling(v1, s)),
                     s * t.length(v1)), "length scale");
        var k = t.copy(v1);
        t.add(k, v2);
        ok(t.equal(k, t.plus(v1, v2)));
        k = t.copy(v1);
        t.subtract(k, v2);
        ok(t.equal(k, t.minus(v1, v2)));
        ok(t.equal(t.schur_product(v1, v2),
                   t.schur_product(v2, v1)));
        ok(t.equal(t.schur_product(v1, t.schur_product(v2, v3)),
                   t.schur_product(v2, t.schur_product(v3, v1))));
        ok(t.equal(t.scaling(t.normalized(v1), t.length(v1)), v1));
        var e1 = t.create(), e2 = t.create();
        var i = Math.floor(Math.random() * d);
        e1[i] = Math.random();
        do {
            e2[i] = Math.random();
        } while (eps_equal(e1[i], e2[i]));
        ok(!eps_equal(e1[i], e2[i]));
    });

    var v1 = vec3.random(), v2 = vec3.random(), v3 = vec3.random();
    ok(vec3.equal(vec3.cross(v1, v2),
                  vec3.negative(vec3.cross(v2, v1))));
    ok(eps_equal(vec3.dot(v1, vec3.cross(v2, v3)),
                 mat3.determinant(mat3.make([v1[0], v1[1], v1[2],
                                             v2[0], v2[1], v2[2],
                                             v3[0], v3[1], v3[2]]))));

    ok(vec3.equal(vec3.scaling(v1, vec3.dot(v1, vec3.cross(v2, v3))),
                  vec3.cross(vec3.cross(v1, v2),
                             vec3.cross(v1, v3))), "triple product");

    ok(eps_equal(vec3.dot(v1, vec3.cross(v2, v3)),
                 vec3.dot(v2, vec3.cross(v3, v1))), "triple product");

    ok(eps_equal(vec3.dot(v1, vec3.cross(v2, v3)),
                 vec3.dot(v3, vec3.cross(v1, v2))), "triple product");
});

test("mat4 properties", function() {
    var m1 = mat4.random(), m2 = mat4.random();
    var v = vec3.random(), a = Math.random();
    ok(eps_equal(mat4.determinant(mat4.product(m1, m2)),
                 mat4.determinant(m1) * mat4.determinant(m2)));
    ok(eps_equal(mat4.determinant(mat4.rotation_of(m1, a, v)),
                 mat4.determinant(m1)));
    ok(eps_equal(mat4.determinant(mat4.rotation(a, v)), 1));
    var d = mat4.determinant(m2);
    mat4.rotate(m2, a, v);
    ok(eps_equal(mat4.determinant(m2), d));
    ok(eps_equal(mat4.determinant(m2) * v[0] * v[1] * v[2],
                 mat4.determinant(mat4.scaling_of(m2, v))));
    
});

test("mat properties", function() {
    _.each([2, 3, 4], function (d) {
        var mt = mat[d];
        var m1 = mt.random(), m2 = mt.random();
        var vt = vec[d];
        var v = vt.random();
        ok(eps_equal(mt.determinant(mt.product(m1, m2)),
                     mt.determinant(m1) * mt.determinant(m2)));
        var e1 = mt.create(), e2 = mt.create();
        var i1 = Math.floor(Math.random() * (d*d));
        e1[i1] = Math.random();
        do {
            e2[i1] = Math.random();
        } while (eps_equal(e2[i1], e1[i1]));
        ok(!mt.equal(e1, e2));
        ok(eps_less(vt.length(mt.product_vec(m1, v)),
                    mt.frobenius_norm(m1) * vt.length(v)));
        ok(vt.equal(mt.product_vec(mt.product(m1, m2), v),
                    mt.product_vec(m1, mt.product_vec(m2, v))));

        var det = mt.determinant(m1);

        // comparison more tolerant because this is numerically bad.
        ok(eps_equal(mt.frobenius_norm(mt.product(m1, mt.inverse(m1))), Math.sqrt(d),
                     Math.sqrt(vec.eps)));
    });
});
