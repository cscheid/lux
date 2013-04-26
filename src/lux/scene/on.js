Lux.Scene.on = function(ename) {
    return function(event) {
        var scene = Lux._globals.ctx._lux_globals.scene;
        for (var i=0; i < scene.length; ++i) {
            if (scene[i].on && scene[i].on[ename]) {
                if (!scene[i].on[ename](event))
                    return false;
            }
        }
        return true;
    };
};
