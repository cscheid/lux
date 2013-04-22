Lux.identity = function()
{
    return mat4.identity();
};

Lux.translation = function(v)
{
    function t_3x3(ar) {
        var r = mat3.create();
        r[6] = ar[0];
        r[7] = ar[1];
        return r;
    }
    function t_4x4(ar) {
        return mat4.translation(ar);
    }
    if (v.length === 3) return t_4x4(v);
    else if (arguments.length === 3) return t_4x4(arguments);
    else if (v.length === 2) return t_3x3(v);
    else if (arguments.length === 2) return t_3x3(arguments);

    throw "invalid vector size for translation";
};

Lux.scaling = function (v)
{
    var ar;
    function s_3x3(ar) {
        var r = mat3.create();
        r[0] = ar[0];
        r[4] = ar[1];
        return r;
    }
    function s_4x4(ar) {
        return mat4.scaling(ar);
    }

    if (v.length === 3) return s_4x4(v);
    else if (arguments.length === 3) return s_4x4(arguments);
    else if (v.length === 2) return s_3x3(v);
    else if (arguments.length === 2) return s_3x3(arguments);

    throw "invalid size for scale";
};

Lux.rotation = function(angle, axis)
{
    return mat4.rotation(angle, axis);
};

Lux.look_at = function(ex, ey, ez, cx, cy, cz, ux, uy, uz)
{
    return mat4.lookAt([ex, ey, ez], [cx, cy, cz], [ux, uy, uz]);
};

Lux.perspective = mat4.perspective;

Lux.frustum = mat4.frustum;

Lux.ortho = mat4.ortho;

Lux.shear = function(xf, yf)
{
    return mat4.create([1, 0, xf, 0,
                        0, 1, yf, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1]);
};
