var G = Lux.glslGen;

var vSource = G.generateGLSL(G.vertexShader([
  G.versionDeclaration("300 es"),
  G.inDeclaration(G.variableDeclaration("vec4", "attribute1")),
  G.outDeclaration(G.variableDeclaration("vec4", "varying1")),
  G.functionDefinition(
    "vec4", "_luxCompiled_f1",
    [G.parameterDeclaration("vec4", "v")],
    [G.returnStatement(G.variableRef("v"))]),
  G.functionDefinition(
    "void", "main", [],
    [G.variableDeclaration(
      "vec4", "vout", G.functionCall("_luxCompiled_f1",
                                     [G.variableRef("attribute1")])),
     G.assignment("gl_Position", G.variableRef("vout")),
     G.assignment("varying1", G.variableRef("vout"))])]));

var fSource = `#version 300 es
precision highp float;
in vec4 varying1;
out vec4 fragColor;
vec4 _luxCompiled_f2(vec4 v)
{
  return vec4(1.0, 0.0, 0.0, 1.0);
}
void main() {
  fragColor = _luxCompiled_f2(varying1);
}
`;

function main()
{
  var canvas = document.getElementById("webgl");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    console.error("failed to initialize webgl2 context");
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
