$().ready(function () {
    var gl = Lux.init({
        interactor: Lux.UI.centerZoomInteractor({ width: 720, height: 480 }),
        clearColor: [0,0,0,0.1]
    });

    Lux.Scene.add(Lux.Marks.globe2d());
});
