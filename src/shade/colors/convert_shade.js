/*
 * FIXME The API in Shade.Colors is a disgusting mess. My apologies.
 * 
 */

(function() {

function compose(g, f)
{
    if (_.isUndefined(f) || _.isUndefined(g))
        throw new Error("Undefined!");
    return function(x) {
        return g(f(x));
    };
}

var _if = Shade.ifelse;

var table = {};
var colorspaces = ["rgb", "srgb", "luv", "hcl", "hls", "hsv", "xyz"];
_.each(colorspaces, function(space) {
    Shade.Colors[space] = function(v1, v2, v3, alpha) {
        if (_.isUndefined(alpha))
            alpha = 1;
        return Shade.Colors.shadetable[space].create(v1, v2, v3).as_shade(alpha);
    };
    table[space] = {};
    table[space][space] = function(x) { return x; };
    table[space].create = function() {
        var vec;
        if (arguments.length === 1) {
            vec = arguments[0];
            if (!vec.type.equals(Shade.Types.vec3))
                throw new Error("create with 1 parameter requires a vec3");
        } else if (arguments.length === 3) {
            vec = Shade.vec(arguments[0], arguments[1], arguments[2]);
            if (!vec.type.equals(Shade.Types.vec3))
                throw new Error("create with 3 parameter requires 3 floats");
        } else
            throw new Error("create requires either 1 vec3 or 3 floats");
        // this function is carefully designed to work for the above
        // color space names. if those change, this probably changes
        // too.
        var l = space.length;
        var field_0 = space[l-3],
            field_1 = space[l-2],
            field_2 = space[l-1];
        var result = {
            space: space,
            vec: vec,
            values: function() {
                return [this[field_0].constant_value(), 
                        this[field_1].constant_value(), 
                        this[field_2].constant_value()];
            },
            as_shade: function(alpha) {
                if (_.isUndefined(alpha))
                    alpha = Shade.make(1);
                var result = this.rgb().vec;
                return Shade.vec(this.rgb().vec, alpha);
            }
        };
        result[field_0] = vec.swizzle("r");
        result[field_1] = vec.swizzle("g");
        result[field_2] = vec.swizzle("b");
        _.each(colorspaces, function(other_space) {
            result[other_space] = function() { return table[space][other_space](result); };
        });
        return result;
    };
});

function xyz_to_uv(xyz)
{
    var t, x, y;
    t = xyz.x.add(xyz.y).add(xyz.z);
    x = xyz.x.div(t);
    y = xyz.y.div(t);
    return Shade.vec(x.mul(2).div(y.mul(6).sub(x).add(1.5)),
                     y.mul(4.5).div(y.mul(6).sub(x).add(1.5)));
};

// qtrans takes hue varying from 0 to 1!
function qtrans(q1, q2, hue)
{
    hue = _if(hue.gt(1), hue.sub(1), hue);
    hue = _if(hue.lt(0), hue.add(1), hue);
    return _if(hue.lt(1/6), q1.add(q2.sub(q1).mul(hue.mul(6))),
           _if(hue.lt(1/2), q2,
           _if(hue.lt(2/3), q1.add(q2.sub(q1).mul(Shade.make(2/3)
                                                  .sub(hue).mul(6))),
               q1)));
};

function gtrans(u, gamma)
{
    return _if(u.gt(0.00304),
               Shade.mul(1.055, Shade.pow(u, Shade.div(1, gamma))).sub(0.055),
               u.mul(12.92));
}

function ftrans(u, gamma)
{
    return _if(u.gt(0.03928),
               Shade.pow(u.add(0.055).div(1.055), gamma),
               u.div(12.92));
}

//////////////////////////////////////////////////////////////////////////////
// table.rgb.*

function min3(v)
{
    return Shade.min(v.r, Shade.min(v.g, v.b));
}

function max3(v)
{
    return Shade.max(v.r, Shade.max(v.g, v.b));
}

table.rgb.hsv = function(rgb)
{
    var x = min3(rgb);
    var y = max3(rgb);
    
    var f = _if(rgb.r.eq(x), rgb.g.sub(rgb.b),
            _if(rgb.g.eq(x), rgb.b.sub(rgb.r),
                             rgb.r.sub(rgb.g)));
    var i = _if(rgb.r.eq(x), 3, _if(rgb.g.eq(x), 5, 1));
    return table.hsv.create(_if(
        y.eq(x), 
        Shade.vec(0,0,y),
        Shade.vec(Shade.mul(Math.PI/3, i.sub(f.div(y.sub(x)))),
                  y.sub(x).div(y),
                  y)));
};

table.rgb.hls = function(rgb)
{
    var min = min3(rgb);
    var max = max3(rgb);
    var l = max.add(min).div(2), s, h;
    var mx_ne_mn = max.ne(min);
    
    s = _if(mx_ne_mn,
            _if(l.lt(0.5), 
                max.sub(min).div(max.add(min)),
                max.sub(min).div(Shade.sub(2.0, max).sub(min))),
            0);
    h = _if(mx_ne_mn,
            _if(rgb.r.eq(max),                rgb.g.sub(rgb.b).div(max.sub(min)),
            _if(rgb.g.eq(max), Shade.add(2.0, rgb.b.sub(rgb.r).div(max.sub(min))),
                               Shade.add(4.0, rgb.r.sub(rgb.g).div(max.sub(min))))),
            0);
    h = h.mul(Math.PI / 3);
    h = _if(h.lt(0),           h.add(Math.PI * 2),
        _if(h.gt(Math.PI * 2), h.sub(Math.PI * 2), 
                               h));
    return table.hls.create(h, l, s);
};

table.rgb.xyz = function(rgb)
{
    var yn = white_point.y;
    return table.xyz.create(
        yn.mul(rgb.r.mul(0.412453).add(rgb.g.mul(0.357580)).add(rgb.b.mul(0.180423))),
        yn.mul(rgb.r.mul(0.212671).add(rgb.g.mul(0.715160)).add(rgb.b.mul(0.072169))),
        yn.mul(rgb.r.mul(0.019334).add(rgb.g.mul(0.119193)).add(rgb.b.mul(0.950227))));
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
    var yn = white_point.y;
    var r = ftrans(srgb.r, 2.4),
        g = ftrans(srgb.g, 2.4),
        b = ftrans(srgb.b, 2.4);
    return table.xyz.create(
        yn.mul(r.mul(0.412453).add(g.mul(0.357580)).add(b.mul(0.180423))),
        yn.mul(r.mul(0.212671).add(g.mul(0.715160)).add(b.mul(0.072169))),
        yn.mul(r.mul(0.019334).add(g.mul(0.119193)).add(b.mul(0.950227))));
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
    var t1 = xyz_to_uv(xyz);
    y = xyz.y.div(white_point.y);
    var l = _if(y.gt(0.008856), 
                Shade.mul(116, Shade.pow(y, 1.0/3.0)).sub(16),
                Shade.mul(903.3, y));
    return table.luv.create(Shade.vec(l, l.mul(t1.sub(white_point_uv)).mul(13)));
};
// now I can define these
table.rgb.luv = compose(table.xyz.luv, table.rgb.xyz);
table.srgb.luv = compose(table.rgb.luv, table.srgb.rgb);

table.xyz.rgb = function(xyz)
{
    var yn = white_point.y;
    return table.rgb.create(
        (xyz.x.mul( 3.240479).sub(xyz.y.mul(1.537150)).sub(xyz.z.mul(0.498535))).div(yn),
        (xyz.x.mul(-0.969256).add(xyz.y.mul(1.875992)).add(xyz.z.mul(0.041556))).div(yn),
        (xyz.x.mul( 0.055648).sub(xyz.y.mul(0.204043)).add(xyz.z.mul(1.057311))).div(yn)
    );
};
table.xyz.hls = compose(table.rgb.hls, table.xyz.rgb);
table.xyz.hsv = compose(table.rgb.hsv, table.xyz.rgb);

table.xyz.srgb = function(xyz)
{
    var yn = white_point.y;
    return table.srgb.create(
        gtrans((xyz.x.mul( 3.240479).sub(xyz.y.mul(1.537150)).sub(xyz.z.mul(0.498535))).div(yn), 2.4),
        gtrans((xyz.x.mul(-0.969256).add(xyz.y.mul(1.875992)).add(xyz.z.mul(0.041556))).div(yn), 2.4),
        gtrans((xyz.x.mul( 0.055648).sub(xyz.y.mul(0.204043)).add(xyz.z.mul(1.057311))).div(yn), 2.4)
    );
};

// table.xyz.hcl = compose(table.rgb.hcl, table.xyz.rgb);

//////////////////////////////////////////////////////////////////////////////
// table.luv.*

table.luv.hcl = function(luv)
{
    var c = Shade.norm(luv.vec.swizzle("gb"));
    var h = Shade.atan(luv.v, luv.u);
    h = _if(h.gt(Math.PI*2), h.sub(Math.PI*2),
        _if(h.lt(0), h.add(Math.PI*2), h));
    while (h > Math.PI * 2) { h -= Math.PI * 2; }
    while (h < 0) { h += Math.PI * 2; }
    return table.hcl.create(h, c, luv.l);
};
table.rgb.hcl  = compose(table.luv.hcl,  table.rgb.luv);
table.srgb.hcl = compose(table.luv.hcl,  table.srgb.luv);
table.xyz.hcl  = compose(table.rgb.hcl, table.xyz.rgb);

table.luv.xyz = function(luv)
{
    var uv = luv.vec.swizzle("gb").div(luv.l.mul(13)).add(white_point_uv);
    var u = uv.swizzle("r"), v = uv.swizzle("g");
    var y = white_point.y.mul(_if(luv.l.gt(7.999592),
                                  Shade.pow(luv.l.add(16).div(116), 3),
                                  luv.l.div(903.3)));
    var x = y.mul(9).mul(u).div(v.mul(4));
    var z = x.div(-3).sub(y.mul(5)).add(y.mul(3).div(v));
    return table.xyz.create(_if(luv.l.le(0).and(luv.u.eq(0).and(luv.v.eq(0))),
                                Shade.vec(0,0,0),
                                Shade.vec(x,y,z)));
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
        hcl.l, hcl.c.mul(hcl.h.cos()), hcl.c.mul(hcl.h.sin()));
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
    var p2 = _if(hls.l.le(0.5),
                 hls.l.mul(hls.s.add(1)),
                 hls.l.add(hls.s).sub(hls.l.mul(hls.s)));
    var p1 = hls.l.mul(2).sub(p2);
    return table.rgb.create(
        _if(hls.s.eq(0),
            Shade.vec(hls.vec.swizzle("ggg")),
            Shade.vec(qtrans(p1, p2, hls.h.add(Math.PI * 2/3).div(Math.PI * 2)),
                      qtrans(p1, p2, hls.h.div(Math.PI * 2)),
                      qtrans(p1, p2, hls.h.sub(Math.PI * 2/3).div(Math.PI * 2)))));
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
    var v = hsv.v;
    var h = hsv.h.div(Math.PI).mul(3);
    var i = h.floor();
    var f = h.sub(i);
    f = _if(i.div(2).floor().eq(i.div(2)),
            Shade.sub(1, f),
            f);
    var m = v.mul(Shade.sub(1, hsv.s));
    var n = v.mul(Shade.sub(1, hsv.s.mul(f)));
    return table.rgb.create(_if(i.eq(0), Shade.vec(v, n, m),
                            _if(i.eq(1), Shade.vec(n, v, m),
                            _if(i.eq(2), Shade.vec(m, v, n),
                            _if(i.eq(3), Shade.vec(m, n, v),
                            _if(i.eq(4), Shade.vec(n, m, v),
                            _if(i.eq(5), Shade.vec(v, m, n),
                                         Shade.vec(v, n, m))))))));
};

table.hsv.srgb = compose(table.rgb.srgb, table.hsv.rgb);
table.hsv.hls  = compose(table.rgb.hls,  table.hsv.rgb);
table.hsv.xyz  = compose(table.rgb.xyz,  table.hsv.rgb);
table.hsv.luv  = compose(table.rgb.luv,  table.hsv.rgb);
table.hsv.hcl  = compose(table.rgb.hcl,  table.hsv.rgb);

// currently we assume a D65 white point, but this could be configurable
var white_point = table.xyz.create(95.047, 100.000, 108.883);
var white_point_uv = xyz_to_uv(white_point);

Shade.Colors.shadetable = table;

//////////////////////////////////////////////////////////////////////////////
// Color utility functions

// FIXME Ideally, I would like these to not depend on the 'table' variable,
// which is a gigantic mess. But for now, they do.

function flip(v) { return Shade(1).sub(v); }

Shade.Colors.desaturate = Shade(function(amount) {
    return function(color) {
        var rgb = table.rgb.create(color.r(), color.g(), color.b());
        var hsv = table.rgb.hsv(rgb);
        return table.hsv.create(hsv.h, hsv.s.mul(flip(amount)), hsv.v).as_shade(color.a());
    };
});

Shade.Colors.brighten = Shade(function(amount) {
    return function(color) {
        var rgb = table.rgb.create(color.r(), color.g(), color.b());
        var hls = table.rgb.hls(rgb);
        var darkness = flip(hls.l);
        amount = flip(amount);
        var resulting_darkness = darkness.mul(amount);
        return table.hls.create(hls.h, flip(resulting_darkness), hls.s).as_shade(color.a());
    };
});

Shade.Colors.darken = Shade(function(amount) {
    return function(color) {
        var rgb = table.rgb.create(color.r(), color.g(), color.b());
        var hls = table.rgb.hls(rgb);
        var darkness = flip(hls.l);
        amount = flip(amount);
        var resulting_darkness = darkness.mul(amount);
        return table.hls.create(hls.h, resulting_darkness, hls.s).as_shade(color.a());
    };
});

Shade.Colors.invert = Shade(function(c) {
    var rgb = table.rgb.create(c.r(), c.g(), c.b());
    var hls = table.rgb.hls(rgb);
    return table.hls.create(hls.h, flip(hls.l), hls.s).as_shade(c.a()); 
});

})();
