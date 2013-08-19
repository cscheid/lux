Shadertoy = {};

Shadertoy.resolution = Shade.parameter("vec2");

Shadertoy.init = function(conf)
{
    var ctx = Lux._globals.ctx;
    Shadertoy.globalTime = ctx.parameters.now;
    Shadertoy.textures = {};

    conf = conf || {};
    var textures = {};
    var total_textures = 0;
    for (var i=0; i<4; ++i) {
        if (!_.isUndefined(conf["channel" + i])) {
            total_textures++;
            Shadertoy["channel" + i] = Lux.texture({
                src: "img/" + conf["channel" + i] + ".jpg",
                wrap_s: Lux.texture.repeat,
                wrap_t: Lux.texture.repeat,
                onload: bump_tex_load
            });
        }
    }

    function bump_tex_load() {
        total_textures--;
        if (total_textures === 0)
            conf.on_load && conf.on_load();
    }
};

Shadertoy.tick = function()
{
    var ctx = Lux._globals.ctx;
    Shadertoy.resolution.set(vec.make([ctx.viewportWidth, ctx.viewportHeight]));
};
