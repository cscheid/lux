Shadertoy = {};

Shadertoy.resolution = Shade.parameter("vec2");

Shadertoy.init = function(conf)
{
    var img_map = {
        "tex01": "img/tex01.jpg",
        "tex16": "img/tex16.png"
    };

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
                src: img_map[conf["channel" + i]],
                wrap_s: Lux.texture.repeat,
                wrap_t: Lux.texture.repeat,
                onload: bump_tex_load
            });
        }
    }

    function bump_tex_load() {
        total_textures--;
        if (total_textures === 0) {
            done_loading();
        }
    }

    function done_loading() {
        conf.on_load && conf.on_load();
        var square = Lux.Models.square();
        Lux.Scene.add(Lux.actor({
            model: square,
            appearance: {
                position: square.vertex.mul(2).sub(1),
                color: conf.shader_function()
            }
        }));
        Lux.Scene.animate(Shadertoy.tick);
    }

    if (total_textures === 0) {
        done_loading();
    }
};

Shadertoy.tick = function()
{
    var ctx = Lux._globals.ctx;
    Shadertoy.resolution.set(vec.make([ctx.viewportWidth, ctx.viewportHeight]));
};

Shadertoy.main = function(conf)
{
    $(function() {
        Lux.init({ highDPS: false });
        Shadertoy.init(conf);
    });
}
