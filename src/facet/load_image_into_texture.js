Facet.load_image_into_texture = function(opts)
{
    opts = _.defaults(opts, {
        onload: function() {},
        x_offset: 0,
        y_offset: 0
    });

    var texture = opts.texture;
    var onload = opts.onload;
    var x_offset = opts.x_offset;
    var y_offset = opts.y_offset;
    var ctx = Facet._globals.ctx;

    function image_handler(image) {
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
        ctx.texSubImage2D(ctx.TEXTURE_2D, 0, x_offset, y_offset,
                          ctx.RGBA, ctx.UNSIGNED_BYTE, image);
        onload(image);
    }

    function buffer_handler()
    {
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
        ctx.texSubImage2D(ctx.TEXTURE_2D, 0, x_offset, y_offset,
                          opts.width, opts.height,
                          ctx.RGBA, ctx.UNSIGNED_BYTE, opts.buffer);
        onload();
    }

    if (opts.src) {
        var image = new Image();
        image.onload = function() {
            image_handler(image);
        };
        // CORS support
        if (opts.crossOrigin)
            image.crossOrigin = opts.crossOrigin;
        image.src = opts.src;
    } else if (opts.img) {
        if (opts.img.isComplete) {
            image_handler(opts.img);
        } else {
            var old_onload = texture.image.onload || function() {};
            opts.img.onload = function() {
                image_handler(opts.img);
                old_onload();
            };
        }
    } else {
        buffer_handler();        
    }
};
