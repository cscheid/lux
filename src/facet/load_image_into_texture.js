/*
 * Facet.load_image_into_texture:
 * 
 *   Replaces a rectangle of a Facet texture with a given image.
 * 
 *   This is useful to store a large set of rectangular images into a single texture, for example.
 * 
 *   Example usage:
 * 
 *   * Load an image from a URL:
 * 
 *     Facet.load_image_into_texture({ 
 *       texture: texture,
 *       src: "http://www.example.com/image.png"
 *     })
 * 
 *   * Invoke a callback when image is successfully loaded:
 * 
 *     Facet.load_image_into_texture({ 
 *       texture: texture,
 *       src: "http://www.example.com/image.png",
 *       onload: function() { alert("image has now loaded!") }
 *     })
 * 
 *   * Specify an offset:
 * 
 *     Facet.load_image_into_texture({ 
 *       texture: texture,
 *       src: "http://www.example.com/image.png",
 *       x_offset: 64,
 *       y_offset: 32
 *     })
 * 
 *   * Load an image from an existing element in the DOM:
 * 
 *     Facet.load_image_into_texture({
 *       texture: texture,
 *       img: document.getElementById("image-element")
 *     });
 *
 *     Facet.load_image_into_texture({
 *       texture: texture,
 *       canvas: document.getElementById("canvas-element")
 *     });
 * 
 *   * Load an image from a TypedArray buffer (currently only supports 8-bit RGBA):
 * 
 *     Facet.load_image_into_texture({
 *       texture: texture,
 *       width: 128,
 *       height: 128,
 *       buffer: new Uint8Array(128 * 128 * 4)
 *     });
 */

// FIXME: move all of this code so that it's a method in Facet.texture.

Facet.load_image_into_texture = function(opts)
{
    opts = _.defaults(opts, {
        onload: function() {},
        x_offset: 0,
        y_offset: 0,
        transform_image: function(i) { return i; }
    });

    var texture = opts.texture;
    var onload = opts.onload;
    var x_offset = opts.x_offset;
    var y_offset = opts.y_offset;

    function image_handler(image) {
        image = opts.transform_image(image);
        var ctx = texture._ctx;
        Facet.set_context(texture._ctx);
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
        ctx.texSubImage2D(ctx.TEXTURE_2D, 0, x_offset, y_offset,
                          ctx.RGBA, ctx.UNSIGNED_BYTE, image);
        Facet.unload_batch();
        onload(image);
    }

    function buffer_handler()
    {
        var ctx = texture._ctx;
        Facet.set_context(texture._ctx);
        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
        ctx.texSubImage2D(ctx.TEXTURE_2D, 0, x_offset, y_offset,
                          opts.width, opts.height,
                          ctx.RGBA, ctx.UNSIGNED_BYTE, opts.buffer);
        Facet.unload_batch();
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
    } else if (opts.canvas) {
        image_handler(opts.canvas);
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
