//////////////////////////////////////////////////////////////////////////////
// load texture from DOM element or URL. 
// BEWARE SAME-DOMAIN POLICY!

Facet.texture = function(opts)
{
    var ctx = Facet._globals.ctx;
    var texture = ctx.createTexture();
    texture._shade_type = 'texture';

    texture.init = function(opts) {
        var ctx = Facet._globals.ctx;
        opts = _.defaults(opts, {
            onload: function() {},
            mipmaps: false,
            mag_filter: ctx.LINEAR,
            min_filter: ctx.LINEAR,
            wrap_s: ctx.CLAMP_TO_EDGE,
            wrap_t: ctx.CLAMP_TO_EDGE,
            format: ctx.RGBA,
            type: ctx.UNSIGNED_BYTE
        });
        this.width = opts.width;
        this.height = opts.height;

        var that = this;
        function handler() {
            var ctx = Facet._globals.ctx;
            ctx.bindTexture(ctx.TEXTURE_2D, that);
            ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
            if (that.image) {
                ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
                ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, 
                                ctx.BROWSER_DEFAULT_WEBGL);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, opts.format, opts.format,
                               opts.type, that.image);
            } else {
                ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
                ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.NONE);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, opts.format,
                               that.width, that.height,
                               0, opts.format, opts.type, that.buffer);
            }
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, opts.mag_filter);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, opts.min_filter);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, opts.wrap_s);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, opts.wrap_t);
            if (opts.mipmaps)
                ctx.generateMipmap(ctx.TEXTURE_2D);
            ctx.bindTexture(ctx.TEXTURE_2D, null);
            opts.onload(that);
            // to ensure that all textures are bound correctly,
            // we unload the current batch, forcing all uniforms to be re-evaluated.
            Facet.unload_batch();
        }

        delete this.buffer;
        delete this.image;

        if (opts.src) {
            var image = new Image();
            image.onload = function() {
                that.width = image.width;
                that.height = image.height;
                handler();
            };
            this.image = image;
            if (opts.crossOrigin)
                image.crossOrigin = opts.crossOrigin; // CORS support
            image.src = opts.src;
        } else if (opts.img) {
            this.image = opts.img;
            if (this.image.isComplete) {
                this.width = this.image.width;
                this.height = this.image.height;
                handler();
            } else {
                this.image.onload = function() {
                    that.width = that.image.width;
                    that.height = that.image.height;
                    handler();
                };
            }
        } else {
            this.buffer = opts.buffer || null;
            handler();        
        }
    };
    texture.init(opts);

    return texture;
};
