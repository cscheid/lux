var vSource = "                              \
attribute vec4 attribute1;                   \
varying   vec4 varying1;                     \
vec4 _luxCompiled_f1(vec4 v)                 \
{                                            \
  return v;                                  \
}                                            \
                                             \
void main() {                                \
  vec4 vout = _luxCompiled_f1(attribute1);   \
  gl_Position = vout;                        \
  varying1 = vout;                           \
}                                            \
";

var fSource = "                               \
precision highp float;                        \
varying vec4 varying1;                        \
vec4 _luxCompiled_f2(vec4 v)                  \
{                                             \
  return vec4(1.0, 0.0, 0.0, 1.0);            \
}                                             \
                                              \
void main() {                                 \
  gl_FragColor = _luxCompiled_f2(varying1);   \
}                                             \
";

function main()
{
  var canvas = document.getElementById("webgl");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    console.error("failed to initialize webgl context");
    return;
  }
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  var vs = gl.createShader(gl.VERTEX_SHADER);
  var fs = gl.createShader(gl.FRAGMENT_SHADER);

  function compileShader(shader, source) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return false;
    } else {
      return true;
    }
  }

  if (!compileShader(vs, vSource)) return;
  if (!compileShader(fs, fSource)) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Could not link prog");
    return;
  }

  gl.useProgram(prog);

  var vAttrib1 = gl.getAttribLocation(prog, "attribute1");
  gl.enableVertexAttribArray(prog, vAttrib1);

  var attribBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, attribBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.1, 0.1, 0.0,
                                                   0.5, 0.1, 0.0,
                                                   0.1, 0.5, 0.0]), gl.STATIC_DRAW);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.vertexAttribPointer(vAttrib1, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();
