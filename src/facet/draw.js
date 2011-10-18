(function() {
var previous_batch = {};
Facet.unload_batch = function()
{
    var ctx = Facet.ctx;
    if (previous_batch.attributes) {
        for (var key in previous_batch.attributes) {
            ctx.disableVertexAttribArray(previous_batch.program[key]);
        }
        _.each(previous_batch.program.uniforms, function (uniform) {
            delete uniform._facet_active_uniform;
        });
    }
    previous_batch = {};

    // reset opengl capabilities determined by Facet.DrawingMode.*
    ctx.disable(ctx.DEPTH_TEST);
    ctx.disable(ctx.BLEND);
};

// FIXME: This is an ugly call. Don't call this directly; 
// use Facet.model and Facet.bake instead
Facet.draw = function(batch)
{
    var ctx = Facet.ctx;
    if (batch.batch_id !== previous_batch.batch_id) {
        var attributes = batch.attributes || {};
        var uniforms = batch.uniforms || {};
        var program = batch.program;
        var primitives = batch.primitives;
        var key;

        Facet.unload_batch();
        previous_batch = batch;
        batch.drawing_mode.set_caps();

        ctx.useProgram(program);

        for (key in attributes) {
            var attr = program[key];
            if (typeof attr !== 'undefined') {
                ctx.enableVertexAttribArray(attr);
                attributes[key].bind(attr);
            }
        }
        
        var currentActiveTexture = 0;
        _.each(program.uniforms, function(uniform) {
            var key = uniform.uniform_name;
            var call = uniform.uniform_call,
                value = uniform.get();
            if (typeOf(value) === 'undefined') {
                throw "uniform " + key + " has not been set.";
            }
            var t = constant_type(value);
            if (t === "other") {
                uniform._facet_active_uniform = (function(uid, cat) {
                    return function(v) {
                        ctx.activeTexture(ctx.TEXTURE0 + cat);
                        ctx.bindTexture(ctx.TEXTURE_2D, v);
                        ctx.uniform1i(uid, cat);
                    };
                })(program[key], currentActiveTexture);
                currentActiveTexture++;
            } else if (t === "number" || t == "vector") {
                uniform._facet_active_uniform = (function(call, uid) {
                    return function(v) {
                        call.call(ctx, uid, v);
                    };
                })(ctx[call], program[key]);
            } else if (t === "matrix") {
                uniform._facet_active_uniform = (function(call, uid) {
                    return function(v) {
                        ctx[call](uid, false, v);
                    };
                })(call, program[key]);
            }
            uniform._facet_active_uniform(value);
        });
    }

    batch.draw_chunk();
};

})();
