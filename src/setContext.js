import Lux from './lux.js';

function setContext(theCtx)
{
  Lux._globals.ctx = theCtx;
}

exports.setContext = setContext;
