import Lux from './lux.js';

function setConstants(gl)
{
  // primitives
  Lux.points = gl.POINTS;
  Lux.lines = gl.LINES;
  Lux.lineLoop = gl.LINE_LOOP;
  Lux.lineStrip = gl.LINE_STRIP;
  Lux.triangles = gl.TRIANGLES;
  Lux.triangleStrip = gl.TRIANGLE_STRIP;
  Lux.triangleFan = gl.TRIANGLE_FAN;
}

exports.setConstants = setConstants;
