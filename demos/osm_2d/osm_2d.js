$().ready(function () {
    var gl = Lux.init({
        interactor: Lux.UI.center_zoom_interactor({ width: 720, height: 480 }),
        clearColor: [0,0,0,0.1]
    });

    Lux.Scene.add(Lux.Marks.globe_2d());
});
