Lux.Promises.texture = function(opts) {
    opts = _.clone(opts);
    return new Promise(function (resolve, reject) {
        var texture;
        opts.onload = function() {
            resolve(texture);
        };
        texture = Lux.texture(opts);
    });
};
