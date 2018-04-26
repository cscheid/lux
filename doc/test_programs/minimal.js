function main()
{
  Lux.init({ canvas: document.getElementById("webgl") });
  var triangle = Lux.model({
    vertices: [[0.1, 0.1, 0.0], [0.5, 0.1, 0.0], [0.1, 0.5, 0.0]],
    // elements: sphereElements
    primitive: Lux.triangles
  });

  var actor = Lux.actor({
    model: triangle,
    appearance: {
      position: function(v) { return v; },
      color: function(v) { return Lux.vec(1, 0, 0, 1); }
    }
  });

  Lux.Scene.add(actor);
}

main();
