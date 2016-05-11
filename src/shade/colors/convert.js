(function() {

function compose(g, f)
{
    if (_.isUndefined(f) || _.isUndefined(g))
        throw new Error("Undefined!");
    return function(x) {
        return g(f(x));
    };
}

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
        var field0 = space[l-3],
            field1 = space[l-2],
            field2 = space[l-1];
        var result = {
            space: space,
            values: function() {
                return [this[field0], this[field1], this[field2]];
            },
            asShade: function(alpha) {
                if (_.isUndefined(alpha))
                    alpha = 1;
                var srgb = table[space].rgb(this);
                return Shade.vec(srgb.r, srgb.g, srgb.b, alpha);
            }
        };
        
        result[field0] = v0;
        result[field1] = v1;
        result[field2] = v2;
        _.each(colorspaces, function(otherSpace) {
            result[otherSpace] = function() { return table[space][otherSpace](result); };
        });
        return result;
    };
});

function xyzToUv(xyz)
{
    var t, x, y;
    t = xyz.x + xyz.y + xyz.z;
    x = xyz.x / t;
    y = xyz.y / t;
    return [2 * x / (6 * y - x + 1.5),
            4.5 * y / (6 * y - x + 1.5)];
};

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
    if (u > 0.00304)
        return 1.055 * Math.pow(u, 1 / gamma) - 0.055;
    else
        return 12.92 * u;
    // if (u < 0) return u;
    // return Math.pow(u, 1.0 / gamma);
}

function ftrans(u, gamma)
{
    if (u > 0.03928)
        return Math.pow((u + 0.055) / 1.055, gamma);
    else
        return u / 12.92;
    // if (u < 0) return u;
    // return Math.pow(u, gamma);
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
        return table.hsv.create((Math.PI/3) * (i - f / (y - x)),
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
    var yn = whitePoint.y;
    return table.xyz.create(
        yn * (0.412453 * rgb.r + 0.357580 * rgb.g + 0.180423 * rgb.b),
        yn * (0.212671 * rgb.r + 0.715160 * rgb.g + 0.072169 * rgb.b),
        yn * (0.019334 * rgb.r + 0.119193 * rgb.g + 0.950227 * rgb.b));
};

table.rgb.srgb = function(rgb)
{
    return table.srgb.create(gtrans(rgb.r, 2.4),
                             gtrans(rgb.g, 2.4),
                             gtrans(rgb.b, 2.4));
};

// table.rgb.luv = compose(table.xyz.luv, table.rgb.xyz);
// table.rgb.hcl = compose(table.luv.hcl, table.rgb.luv);

//////////////////////////////////////////////////////////////////////////////
// table.srgb.*

table.srgb.xyz = function(srgb)
{
    var yn = whitePoint.y;
    var r = ftrans(srgb.r, 2.4),
        g = ftrans(srgb.g, 2.4),
        b = ftrans(srgb.b, 2.4);
    return table.xyz.create(
        yn * (0.412453 * r + 0.357580 * g + 0.180423 * b),
        yn * (0.212671 * r + 0.715160 * g + 0.072169 * b),
        yn * (0.019334 * r + 0.119193 * g + 0.950227 * b));
};

table.srgb.rgb = function(srgb)
{
    var result = table.rgb.create(ftrans(srgb.r, 2.4),
                                  ftrans(srgb.g, 2.4),
                                  ftrans(srgb.b, 2.4));
    return result;
};

table.srgb.hls = compose(table.rgb.hls, table.srgb.rgb);
table.srgb.hsv = compose(table.rgb.hsv, table.srgb.rgb);
// table.srgb.luv = compose(table.rgb.luv, table.srgb.rgb);
// table.srgb.hcl = compose(table.rgb.hcl, table.srgb.rgb);

//////////////////////////////////////////////////////////////////////////////
// table.xyz.*

table.xyz.luv = function(xyz)
{
    var y;
    var t1 = xyzToUv(xyz);
    y = xyz.y / whitePoint.y;
    var l = (y > 0.008856 ? 
             116 * Math.pow(y, 1.0/3.0) - 16 :
             903.3 * y);
    return table.luv.create(l, 
                            13 * l * (t1[0] - whitePointUv[0]),
                            13 * l * (t1[1] - whitePointUv[1]));
};
// now I can define these
table.rgb.luv = compose(table.xyz.luv, table.rgb.xyz);
table.srgb.luv = compose(table.rgb.luv, table.srgb.rgb);

table.xyz.rgb = function(xyz)
{
    var yn = whitePoint.y;
    return table.rgb.create(
        ( 3.240479 * xyz.x - 1.537150 * xyz.y - 0.498535 * xyz.z) / yn,
        (-0.969256 * xyz.x + 1.875992 * xyz.y + 0.041556 * xyz.z) / yn,
        ( 0.055648 * xyz.x - 0.204043 * xyz.y + 1.057311 * xyz.z) / yn
    );
};
table.xyz.hls = compose(table.rgb.hls, table.xyz.rgb);
table.xyz.hsv = compose(table.rgb.hsv, table.xyz.rgb);

table.xyz.srgb = function(xyz)
{
    var yn = whitePoint.y;
    return table.srgb.create(
        gtrans(( 3.240479 * xyz.x - 1.537150 * xyz.y - 0.498535 * xyz.z) / yn, 2.4),
        gtrans((-0.969256 * xyz.x + 1.875992 * xyz.y + 0.041556 * xyz.z) / yn, 2.4),
        gtrans(( 0.055648 * xyz.x - 0.204043 * xyz.y + 1.057311 * xyz.z) / yn, 2.4)
    );
};

// table.xyz.hcl = compose(table.rgb.hcl, table.xyz.rgb);

//////////////////////////////////////////////////////////////////////////////
// table.luv.*

table.luv.hcl = function(luv)
{
    var c = Math.sqrt(luv.u * luv.u + luv.v * luv.v);    
    var h = Math.atan2(luv.v, luv.u);
    while (h > Math.PI * 2) { h -= Math.PI * 2; }
    while (h < 0) { h += Math.PI * 2; }
    return table.hcl.create(h, c, luv.l);
};
table.rgb.hcl  = compose(table.luv.hcl,  table.rgb.luv);
table.srgb.hcl = compose(table.luv.hcl,  table.srgb.luv);
table.xyz.hcl  = compose(table.rgb.hcl, table.xyz.rgb);

table.luv.xyz = function(luv)
{
    var x = 0, y = 0, z = 0;
    if (!(luv.l <= 0 && luv.u == 0 && luv.v == 0)) {
        y = whitePoint.y * ((luv.l > 7.999592) ? 
                             Math.pow((luv.l + 16)/116, 3) : 
                             luv.l / 903.3);
        // var t = xyzToUv(xn, yn, zn);
        // var un = t[0], vn = t[1];
        var resultU = luv.u / (13 * luv.l) + whitePointUv[0];
        var resultV = luv.v / (13 * luv.l) + whitePointUv[1];
        x = 9 * y * resultU / (4 * resultV);
        z = -x / 3 - 5 * y + 3 * y / resultV;
    }
    return table.xyz.create(x, y, z);
};
table.luv.rgb  = compose(table.xyz.rgb,  table.luv.xyz);
table.luv.hls  = compose(table.rgb.hls,  table.luv.rgb);
table.luv.hsv  = compose(table.rgb.hsv,  table.luv.rgb);
table.luv.srgb = compose(table.rgb.srgb, table.luv.rgb);


//////////////////////////////////////////////////////////////////////////////
// table.hcl.*

table.hcl.luv = function(hcl)
{
    return table.luv.create(
        hcl.l, hcl.c * Math.cos(hcl.h), hcl.c * Math.sin(hcl.h));
};

table.hcl.rgb  = compose(table.luv.rgb,  table.hcl.luv);
table.hcl.srgb = compose(table.luv.srgb, table.hcl.luv);
table.hcl.hsv  = compose(table.luv.hsv,  table.hcl.luv);
table.hcl.hls  = compose(table.luv.hls,  table.hcl.luv);
table.hcl.xyz  = compose(table.luv.xyz,  table.hcl.luv);

//////////////////////////////////////////////////////////////////////////////
// table.hls.*

table.hls.rgb = function(hls)
{
    var p1, p2;
    if (hls.l <= 0.5)
        p2 = hls.l * (1 + hls.s);
    else
        p2 = hls.l + hls.s - (hls.l * hls.s);
    p1 = 2 * hls.l - p2;
    if (hls.s === 0) {
        return table.rgb.create(hls.l, hls.l, hls.l);
    } else {
        return table.rgb.create(
            qtrans(p1, p2, (hls.h + Math.PI * 2/3) / (Math.PI * 2)),
            qtrans(p1, p2, hls.h / (Math.PI * 2)),
            qtrans(p1, p2, (hls.h - Math.PI * 2/3) / (Math.PI * 2)));
    }
};

table.hls.srgb = compose(table.rgb.srgb, table.hls.rgb);
table.hls.hsv  = compose(table.rgb.hsv,  table.hls.rgb);
table.hls.xyz  = compose(table.rgb.xyz,  table.hls.rgb);
table.hls.luv  = compose(table.rgb.luv,  table.hls.rgb);
table.hls.hcl  = compose(table.rgb.hcl,  table.hls.rgb);

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
            throw new Error("internal error");
        };
    }
};

table.hsv.srgb = compose(table.rgb.srgb, table.hsv.rgb);
table.hsv.hls  = compose(table.rgb.hls,  table.hsv.rgb);
table.hsv.xyz  = compose(table.rgb.xyz,  table.hsv.rgb);
table.hsv.luv  = compose(table.rgb.luv,  table.hsv.rgb);
table.hsv.hcl  = compose(table.rgb.hcl,  table.hsv.rgb);

// currently we assume a D65 white point, but this could be configurable
var whitePoint = table.xyz.create(95.047, 100.000, 108.883);
var whitePointUv = xyzToUv(whitePoint);

Shade.Colors.jstable = table;

})();
