// replicates OpenGL's fog functionality

(function() {

var defaultColor = Shade.vec(0,0,0,0);

Shade.glFog = function(opts)
{
    opts = _.defaults(opts, { mode: "exp",
                              density: 1,
                              start: 0,
                              end: 1,
                              fogColor: defaultColor,
                              perVertex: false
                            });
    var mode = opts.mode || "exp";
    var fogColor = Shade.make(opts.fogColor);
    var color = opts.color;
    var z = Shade.make(opts.z);
    var f, density, start;

    if (opts.mode === "exp") {
        density = Shade.make(opts.density);
        start = Shade.make(opts.start);
        f = z.sub(start).mul(density).exp();
    } else if (mode === "exp2") {
        density = Shade.make(opts.density);
        start = Shade.make(opts.start);
        f = z.sub(start).min(0).mul(density);
        f = f.mul(f);
        f = f.neg().exp();
    } else if (mode === "linear") {
        start = Shade.make(opts.start);
        var end = Shade.make(opts.end);
        end = Shade.make(end);
        start = Shade.make(start);
        f = end.sub(z).div(end.sub(start));
    }
    f = f.clamp(0, 1);
    if (opts.perVertex)
        f = f.perVertex();
    return Shade.mix(fogColor, color, f);
};

})();
