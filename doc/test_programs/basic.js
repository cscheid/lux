function main()
{
  function perspective(opts) {
    const { fovy, aspect, near, far } = opts;
    function frustum(left, right, bottom, top, near, far) {
      var rl = right - left;
      var tb = top - bottom;
      var fn = far - near;
      return Lux.matrix(near * 2 / rl, 0, 0, 0,
                        0, near * 2 / tb, 0, 0,
                        (right + left) / rl, (top + bottom) / tb, (far + near) / fn, -1,
                        0, 0, -far * near * 2 * fn, 0);
    }
    function transform(vertex) {
      var top = near * Math.tan(fovy * Math.PI / 360);
      var right = top * aspect;
      return frustum(-right, right, -top, top, near, far);
    }
    return Lux.closeOver(transform, { fovy, aspect, near, far });
  }

  function lookAt(eye, center, up) {
    var z = (eye - center).normalize();
    var x = up.cross(z).normalize();
    var y = up.normalize();

    return Lux.matrix(
      Lux.vec(x, 0),
      Lux.vec(y, 0),
      Lux.vec(z, 0),
      Lux.vec(-x.dot(eye),
              -y.dot(eye),
              -z.dot(eye),
              1));
  }

  var sphere = Lux.model({
    vertices: sphereVertices,
    elements: sphereElements,
    primitive: Lux.triangleStrip
  });

  var camera = perspective({
    fovy: 45,
    aspect: 2,
    near: 0.1,
    far: 1
  });

  var view = Lux.rotation(Lux.parameters.now(), Lux.vec(0,1,0));

  var sphereActor = Lux.actor({
    model: sphere,
    appearance: Lux.closeOver(function(v) {
      return camera(view(v));
    }, { camera, view })
  });

  Lux.Scene.add(sphereActor);
}
