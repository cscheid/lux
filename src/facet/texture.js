//////////////////////////////////////////////////////////////////////////////
// load texture from DOM element or URL. 
// BEWARE SAME-DOMAIN POLICY!

Facet.texture = function(opts)
{
    var ctx = Facet._globals.ctx;
    opts = _.defaults(opts, {
        onload: function() {},
        mipmaps: false,
        mag_filter: ctx.LINEAR,
        min_filter: ctx.LINEAR,
        wrap_s: ctx.CLAMP_TO_EDGE,
        wrap_t: ctx.CLAMP_TO_EDGE
    });
    var onload = opts.onload || function() {};
    var mipmaps = opts.mipmaps || false;
    var width = opts.width;
    var height = opts.height;

    function handler(texture) {
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
        if (texture.image) {
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, 
                           ctx.UNSIGNED_BYTE, texture.image);
        } else {
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, 
                           texture.width, texture.height,
                           0, ctx.RGBA, ctx.UNSIGNED_BYTE, texture.buffer);
        }
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, opts.mag_filter);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, opts.min_filter);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, opts.wrap_s);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, opts.wrap_t);
        if (mipmaps)
            ctx.generateMipmap(ctx.TEXTURE_2D);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
        onload(texture);

        // to ensure that all textures are bound correctly,
        // we unload the current batch, forcing all uniforms to be re-evaluated.
        Facet.unload_batch();
    }
    var texture = ctx.createTexture();
    texture._shade_type = 'texture';
    texture.width = opts.width;
    texture.height = opts.height;
    if (opts.src) {
        var image = new Image();
        image.onload = function() {
            texture.width = image.width;
            texture.height = image.height;
            handler(texture);
        };
        texture.image = image;
        if (opts.crossOrigin)
            image.crossOrigin = opts.crossOrigin; // CORS support
        image.src = opts.src;
    } else if (opts.img) {
        texture.image = opts.img;
        if (texture.image.isComplete) {
            texture.width = texture.image.width;
            texture.height = texture.image.height;
            handler(texture);
        } else {
            texture.image.onload = function() {
                texture.width = texture.image.width;
                texture.height = texture.image.height;
                handler(texture);
            };
        }
    } else {
        texture.buffer = opts.buffer || null;
        handler(texture);        
    }
    return texture;
};
