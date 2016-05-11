Lux.buffer = function(opts)
{
    var ctx = Lux._globals.ctx;
    opts = _.defaults(opts, {
        usage: ctx.STATIC_DRAW,
        keepArray: false
    });

    if (_.isUndefined(opts.array)) {
        throw new Error("opts.array must be defined");
    }

    var usage = opts.usage;
    if ([ctx.STATIC_DRAW, ctx.DYNAMIC_DRAW, ctx.STREAM_DRAW].indexOf(usage) === -1) {
        throw new Error("opts.usage must be one of STATIC_DRAW, DYNAMIC_DRAW, STREAM_DRAW");
    }

    var result = ctx.createBuffer();
    result.usage = usage;
    result.set = function(array) {
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this);
        ctx.bufferData(ctx.ARRAY_BUFFER, array, this.usage);
        if (opts.keepArray) {
            this.array = array;
        }
        this.byteLength = array.byteLength;
    };
    result.set(opts.array);
    result.setRegion = function() {
        throw new Error("currently unimplemented");
    };

    return result;
};
