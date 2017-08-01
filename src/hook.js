import 'babel-polyfill';
import { Lux, Shade } from './main.js';
import { vec } from './linalg/vec.js';
import vec2 from './linalg/vec2.js';
import vec3 from './linalg/vec3.js';
import vec4 from './linalg/vec4.js';
import { mat } from './linalg/mat.js';
import mat2 from './linalg/mat2.js';
import mat3 from './linalg/mat3.js';
import mat4 from './linalg/mat4.js';

// Expose our API, but not anywhere close to anything that might need to be
// tested in node land.

window.Lux = Lux;
window.Shade = Shade;
window.vec = vec;
window.vec2 = vec2;
window.vec3 = vec3;
window.vec4 = vec4;
window.mat = mat;
window.mat2 = mat2;
window.mat3 = mat3;
window.mat4 = mat4;
