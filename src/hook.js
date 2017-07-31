import 'babel-polyfill';
import { Lux } from './main';

// Expose our API, but not anywhere close to anything that might need to be
// tested in node land.
window.Lux = Lux;
