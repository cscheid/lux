function main()
{
  Lux.init({ canvas: document.getElementById("webgl") });
  var triangle = Lux.model({
    attributes: {
      position: [[0.1, 0.1, 0.0], [0.5, 0.1, 0.0], [0.1, 0.5, 0.0]]
    },
    primitive: Lux.triangles
  });

  var actor = Lux.actor({
    model: triangle,
    appearance: function(model) {
      return {
        position: model.position,
        color: Lux.vec(1, 0, 0, 1)
      };
    }
  });

  Lux.Scene.add(actor);
}

debugger;
Lux.glslGen.basicTest();
main();
