var gl;
var pointsActor;
var rb;
var pointsize, pointweight;
var interactor;

//////////////////////////////////////////////////////////////////////////////

function makePointsActor(x, y, width, height)
{
    var pointsModel = Lux.model({
        x: x,
        y: y,
        type: "points"
    });
    var pt = Shade.vec(pointsModel.x, pointsModel.y);

    rb = Lux.renderBuffer({ width: width, height: height, type: gl.FLOAT });

    var internalPointsActor = Lux.actor({
        model: pointsModel, 
        appearance: {
            position: pt,
            mode: Lux.DrawingMode.additive,
            color: Shade.pointCoord().sub(Shade.vec(0.5, 0.5))
                .norm().pow(2).neg()
                .mul(20)
                .exp()
                .mul(pointweight)
                .mul(interactor.zoom.pow(0.33))
                .mul(Shade.color("white")),
            pointSize: interactor.zoom.pow(0.5).mul(pointsize)}});

    rb.scene.add(internalPointsActor);

    return Lux.actorList([rb.scene, rb.screenActor({
        texelFunction: function(texelAccessor) {
            return Shade.vec(1,1,1,2)
                .sub(Shade.Utils.lerp([
                    Shade.color("white"),
                    Shade.color("#d29152"),
                    Shade.color("sienna"),
                    Shade.color("black")])(texelAccessor().at(0).add(1).log()));
        }
    })]);
}

function initGui()
{
    Lux.UI.parameterSlider({ element: "#pointsize",   parameter: pointsize,   min: 0, max: 10 });
    Lux.UI.parameterSlider({ element: "#pointweight", parameter: pointweight, min: 0, max: 1  });

    $("#set_center").click(function() {
        var x = Number($("#realvalue").val()),
            y = Number($("#imagvalue").val());
        if (!isNaN(x) && !isNaN(y)) {
            interactor.transitionTo(vec.make([x, y]), interactor.zoom.get(), 3);
        }
    });
    $(window).resize(function(eventObject) {
        if (!rb)
            return;
        var w = window.innerWidth;
        var h = window.innerHeight;
        rb.resize(w, h);
    });
    $("#greeting").click(function() {
        $("#greeting").fadeOut(500);
    });
    window.setTimeout(function() {
        $("#greeting").fadeOut(500);
    }, 15000);
}

$().ready(function() {
    pointsize = Shade.parameter("float", 2.5);
    pointweight = Shade.parameter("float", 0.5);
    initGui();

    var canvas = document.getElementById("webgl");
    var width = window.innerWidth, height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    interactor = Lux.UI.centerZoomInteractor({
        width: width, height: height, zoom: 2/3
    });

    $("#overview").click(function() { interactor.transitionTo(vec.make([0, 0]), 0.8333, 3); });
    $("#fractal1").click(function() { interactor.transitionTo(vec.make([-0.4501, -0.5069]), 15, 3); });
    $("#fractal2").click(function() { interactor.transitionTo(vec.make([0.6601, -0.1711]), 9, 3); });
    $("#fractal3").click(function() { interactor.transitionTo(vec.make([-1.5333, 0.2376]), 6, 3); });
    $("#fractal4").click(function() { interactor.transitionTo(vec.make([-0.9129, 1.298]), 4, 3); });
    $("#squares").click(function() { interactor.transitionTo(vec.make([0, 0.73]), 7, 3); });
    $("#eye1").click(function() { interactor.transitionTo(vec.make([-1, 0]), 7, 3); });
    $("#eye2").click(function() { interactor.transitionTo(vec.make([0, -1]), 20, 3); });
    $("#eye3").click(function() { interactor.transitionTo(vec.make([-0.5, 0.8666]), 15, 3); });
    $("#eye4").click(function() { interactor.transitionTo(vec.make([0.7071, -0.7071]), 15, 3); });

    interactor.center.watch(function(c) {
        $("#current-real").text(Math.round(c[0] * 10000) / 10000);
        $("#current-imag").text(Math.round(c[1] * 10000) / 10000);
        $("#plus-sign").css("display", c[1] >= 0 ? "" : "none");
    });

    gl = Lux.init({
        clearDepth: 1.0,
        clearColor: [0,0,0,1],
        interactor: interactor,
        highDPS: false
    });

    Lux.Net.binary(["data/roots_real.raw", "data/roots_imag.raw"], function (obj) {
        var x = Lux.attributeBuffer({ vertexArray: new Float32Array(obj["data/roots_real.raw"]), itemSize: 1});
        var y = Lux.attributeBuffer({ vertexArray: new Float32Array(obj["data/roots_imag.raw"]), itemSize: 1});
        pointsActor = makePointsActor(x, y, width, height);

        $("#loading").fadeOut(500);
        Lux.Scene.add(pointsActor);
        Lux.Scene.invalidate();
    });
});
