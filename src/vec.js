function vec2(x, y)
{
  return new Float32Array([x, y]);
}

function vec3(x, y, z)
{
  return new Float32Array([x, y, z]);
}

function vec4(x, y, z, w)
{
  return new Float32Array([x, y, z, w]);
}

exports.vec2 = vec2;
exports.vec3 = vec3;
exports.vec4 = vec4;
