(function() {

var table = {};
var colorspaces = ["rgb", "srgb", "luv", "hcl", "hls", "hsv", "xyz"];
_.each(colorspaces, function(space) {
    table[space] = {};
    table[space][space] = function(x) { return x; };
    table[space].create = function(v0, v1, v2) {
        // this function is carefully designed to work for the above
        // color space names. if those change, this probably changes
        // too.
        var l = space.length;
        var field_0 = space[l-3],
            field_1 = space[l-2],
            field_2 = space[l-1];
        var result = {
            space: space,
            values: function() {
                return [this[field_0], this[field_1], this[field_2]];
            },
            as_shade: function(alpha) {
                if (_.isUndefined(alpha))
                    alpha = 1;
                var srgb = table[space].rgb(this);
                return Shade.vec(srgb.r, srgb.g, srgb.b, alpha);
            }
        };
        
        result[field_0] = v0;
        result[field_1] = v1;
        result[field_2] = v2;
        _.each(colorspaces, function(other_space) {
            result[other_space] = function() { return table[space][other_space](this); };
        });
        return result;
    };
});

function xyz_to_uv(xyz)
{
    var t, x, y;
    t = xyz.x + xyz.y + xyz.z;
    x = xyz.x / t;
    y = xyz.y / t;
    return [2 * x / (6 * y - x + 1.5),
            4.5 * y / (6 * y - x + 1.5)];
};

// currently we assume a D65 white point, but this could be configurable
var white_point = table.xyz.create(95.047, 100.000, 108.883);
var white_point_uv = xyz_to_uv(white_point);

// qtrans takes hue varying from 0 to 1!
function qtrans(q1, q2, hue)
{
    if (hue > 1) hue -= 1;
    if (hue < 0) hue += 1;
    if (hue < 1/6) 
        return q1 + (q2 - q1) * (hue * 6);
    else if (hue < 1/2)
        return q2;
    else if (hue < 2/3)
        return q1 + (q2 - q1) * (2/3 - hue) * 6;
    else
        return q1;
};

function gtrans(u, gamma)
{
    if (u < 0) return u;
    return Math.pow(u, 1.0 / gamma);
}

function ftrans(u, gamma)
{
    if (u < 0) return u;
    return Math.pow(u, gamma);
}

//////////////////////////////////////////////////////////////////////////////
// table.rgb.*

table.rgb.hsv = function(rgb)
{
    var x = Math.min(rgb.r, rgb.g, rgb.b);
    var y = Math.max(rgb.r, rgb.g, rgb.b);
    if (y !== x) {
        var f = ((rgb.r === x) ? rgb.g - rgb.b : 
                 (rgb.g === x) ? rgb.b - rgb.r :
                                 rgb.r - rgb.g);
        var i = ((rgb.r === x) ? 3 :
                 (rgb.g === x) ? 5 : 1);
        return table.hsv.create(1/6 * (i - f / (y - x)),
                                (y - x) / y,
                                y);
    } else {
        return table.hsv.create(0, 0, y);
    }
};

table.rgb.hls = function(rgb)
{
    var min = Math.min(rgb.r, rgb.g, rgb.b);
    var max = Math.max(rgb.r, rgb.g, rgb.b);

    var l = (max + min) / 2, s, h;
    if (max !== min) {
        if (l < 0.5)
            s = (max - min) / (max + min);
        else
            s = (max - min) / (2.0 - max - min);
        if (rgb.r === max) {
            h = (rgb.g - rgb.b) / (max - min);
        } else if (rgb.g === max) {
            h = 2.0 + (rgb.b - rgb.r) / (max - min);
        } else {
            h = 4.0 + (rgb.r - rgb.g) / (max - min);
        }
        h = h * Math.PI / 3;
        if (h < 0)           h += Math.PI * 2;
        if (h > Math.PI * 2) h -= Math.PI * 2;
    } else {
        s = 0;
        h = 0;
    }
    return table.hls.create(h, l, s);
};

table.rgb.xyz = function(rgb)
{
    var yn = white_point.y;
    return table.xyz.create(
        yn * (0.412453 * rgb.r + 0.357580 * rgb.g + 0.180423 * rgb.b),
        yn * (0.212671 * rgb.r + 0.715160 * rgb.g + 0.072169 * rgb.b),
        yn * (0.019334 * rgb.r + 0.119193 * rgb.g + 0.950227 * rgb.b));
};

table.rgb.srgb = function(rgb)
{
    return table.rgb.create(gtrans(rgb.r, 2.2),
                            gtrans(rgb.g, 2.2),
                            gtrans(rgb.b, 2.2));
};

// table.rgb.luv = _.compose(table.xyz.luv, table.rgb.xyz);
// table.rgb.hcl = _.compose(table.luv.hcl, table.rgb.luv);

//////////////////////////////////////////////////////////////////////////////
// table.srgb.*

table.srgb.xyz = function(srgb)
{
    var yn = white_point.y;
    var r = ftrans(srgb.r, 2.2),
        g = ftrans(srgb.g, 2.2),
        b = ftrans(srgb.b, 2.2);
    return table.xyz.create(
        yn * (0.412453 * r + 0.357580 * g + 0.180423 * b),
        yn * (0.212671 * r + 0.715160 * g + 0.072169 * b),
        yn * (0.019334 * r + 0.119193 * g + 0.950227 * b));
};

table.srgb.rgb = function(srgb)
{
    return table.rgb.create(ftrans(srgb.r, 2.2),
                            ftrans(srgb.b, 2.2),
                            ftrans(srgb.b, 2.2));
};

table.srgb.hls = _.compose(table.rgb.hls, table.srgb.rgb);
table.srgb.hsv = _.compose(table.rgb.hsv, table.srgb.rgb);
// table.srgb.luv = _.compose(table.rgb.luv, table.srgb.rgb);
// table.srgb.hcl = _.compose(table.rgb.hcl, table.srgb.rgb);

//////////////////////////////////////////////////////////////////////////////
// table.xyz.*

table.xyz.luv = function(xyz)
{
    var u, v, un, vn, y;
    var t1 = xyz_to_uv(xyz.x, xyz.y, xyz.z);
    // var t2 = xyz_to_uv(xyz.x, xyz.y, xyz.z, u, v);
    y = xyz.y / white_point.y;
    var l = (y > 0.008856 ? 
             116 * Math.pow(y, 1.0/3.0) - 16 :
             903.3 * y);
    return table.luv.create(l, 
                            13 * l * (u - white_point_uv[0]),
                            13 * l * (v - white_point_uv[1]));
};

// now I can define these
table.rgb.luv = _.compose(table.xyz.luv, table.rgb.xyz);
table.rgb.hcl = _.compose(table.luv.hcl, table.rgb.luv);
table.srgb.luv = _.compose(table.rgb.luv, table.srgb.rgb);
table.srgb.hcl = _.compose(table.rgb.hcl, table.srgb.rgb);

table.xyz.rgb = function(xyz)
{
    var yn = white_point.y;
    return table.rgb.create(
        ( 3.240479 * xyz.x - 1.537150 * xyz.y - 0.498535 * xyz.z) / yn,
        (-0.969256 * xyz.x + 1.875992 * xyz.y + 0.041556 * xyz.z) / yn,
        ( 0.055648 * xyz.x - 0.204043 * xyz.y + 1.057311 * xyz.z) / yn
    );
};

table.xyz.srgb = function(xyz)
{
    var yn = white_point.y;
    return table.srgb.create(
        gtrans(( 3.240479 * xyz.x - 1.537150 * xyz.y - 0.498535 * xyz.z) / yn, 2.2),
        gtrans((-0.969256 * xyz.x + 1.875992 * xyz.y + 0.041556 * xyz.z) / yn, 2.2),
        gtrans(( 0.055648 * xyz.x - 0.204043 * xyz.y + 1.057311 * xyz.z) / yn, 2.2)
    );
};

table.xyz.hls = _.compose(table.rgb.hls, table.xyz.rgb);
table.xyz.hsv = _.compose(table.rgb.hsv, table.xyz.rgb);
table.xyz.luv = _.compose(table.rgb.luv, table.xyz.rgb);
table.xyz.hcl = _.compose(table.rgb.hcl, table.xyz.rgb);

//////////////////////////////////////////////////////////////////////////////
// table.luv.*

table.luv.hcl = function(luv)
{
    var l = luv.values[0], u = luv.values[1], v = luv.values[2];
    var c = Math.sqrt(luv.u * luv.u + luv.v * luv.v);    
    var h = Math.atan2(luv.v, luv.u);
    while (h > Math.PI * 2) { h -= Math.PI * 2; }
    while (h < 0) { h += Math.PI * 2; }
    return table.hcl.create(h, c, l);
};

table.luv.xyz = function(luv)
{
    var x = 0, y = 0, z = 0;
    if (!(luv.l <= 0 && luv.u == 0 && luv.v == 0)) {
        y = white_point.y * ((luv.l > 7.999592) ? 
                             Math.pow((luv.l + 16)/116, 3) : 
                             luv.l / 903.3);
        // var t = xyz_to_uv(xn, yn, zn);
        // var un = t[0], vn = t[1];
        var result_u = luv.u / (13 * luv.l) + white_point_uv[0];
        var result_v = luv.v / (13 * luv.l) + white_point_uv[1];
        x = 9 * y * result_u / (4 * result_v);
        z = -x / 3 - 5 * y + 3 * y / result_v;
    }
    return table.xyz.create(x, y, z);
};

table.luv.rgb  = _.compose(table.xyz.rgb,  table.luv.xyz);
table.luv.hls  = _.compose(table.rgb.hls,  table.luv.rgb);
table.luv.hsv  = _.compose(table.rgb.hsv,  table.luv.rgb);
table.luv.srgb = _.compose(table.rgb.srgb, table.luv.rgb);

//////////////////////////////////////////////////////////////////////////////
// table.hcl.*

table.hcl.luv = function(hcl)
{
    return table.luv.create(
        hcl.l, hcl.c * Math.cos(hcl.h), hcl.c * Math.sin(hcl.h));
};

table.hcl.rgb  = _.compose(table.luv.rgb,  table.hcl.luv);
table.hcl.srgb = _.compose(table.luv.srgb, table.hcl.luv);
table.hcl.hsv  = _.compose(table.luv.hsv,  table.hcl.luv);
table.hcl.hls  = _.compose(table.luv.hls,  table.hcl.luv);
table.hcl.xyz  = _.compose(table.luv.xyz,  table.hcl.luv);

//////////////////////////////////////////////////////////////////////////////
// table.hls.*

table.hls.rgb = function(hls)
{
    var p1 = NaN, p2 = NaN;
    if (hls.l <= 0.5)
        p2 = hls.l * (1 + hls.s);
    else
        p2 = hls.l + hls.s - (hls.l * hls.s);
    p1 = 2 * hls.l - p2;
    if (hls.s === 0) {
        return table.rgb.create(hls.l, hls.l, hls.l);
    } else {
        return table.rgb.create(
            qtrans(p1, p2, (hls.h + Math.PI * 2/3) / Math.PI * 2),
            qtrans(p1, p2, hls.h / Math.PI * 2),
            qtrans(p1, p2, (hls.h - Math.PI * 2/3) / Math.PI * 2));
    }
};

table.hls.srgb = _.compose(table.rgb.srgb, table.hls.rgb);
table.hls.hsv  = _.compose(table.rgb.hsv,  table.hls.rgb);
table.hls.xyz  = _.compose(table.rgb.xyz,  table.hls.rgb);
table.hls.luv  = _.compose(table.rgb.luv,  table.hls.rgb);
table.hls.hcl  = _.compose(table.rgb.hcl,  table.hls.rgb);

//////////////////////////////////////////////////////////////////////////////
// table.hsv.*

table.hsv.rgb = function(hsv)
{
    if (isNaN(hsv.h)) {
        return table.rgb.create(hsv.v, hsv.v, hsv.v);
    } else {
        var v = hsv.v;
        var h = hsv.h / Math.PI * 3; // from [0,2Pi] to [0,6];
        var i = Math.floor(h);
        var f = h - i;
        if (!(i & 1)) // if index is even
            f = 1 - f;
        var m = v * (1 - hsv.s);
        var n = v * (1 - hsv.s * f);
        switch (i) {
        case 6:
        case 0: return table.rgb.create(v, n, m);
        case 1: return table.rgb.create(n, v, m);
        case 2: return table.rgb.create(m, v, n);
        case 3: return table.rgb.create(m, n, v);
        case 4: return table.rgb.create(n, m, v);
        case 5: return table.rgb.create(v, m, n);
        default:
            throw "internal error";
        };
    }
};

table.hsv.srgb = _.compose(table.rgb.srgb, table.hsv.rgb);
table.hsv.hls  = _.compose(table.rgb.hls,  table.hsv.rgb);
table.hsv.xyz  = _.compose(table.rgb.xyz,  table.hsv.rgb);
table.hsv.luv  = _.compose(table.rgb.luv,  table.hsv.rgb);
table.hsv.hcl  = _.compose(table.rgb.hcl,  table.hsv.rgb);

Shade.Colors.jstable = table;

})();
