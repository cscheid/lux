// yucky globals used throughout Lux. I guess this means I lost.
//
////////////////////////////////////////////////////////////////////////////////

var _globals = {
  // stores the active webgl context
  ctx: undefined

  // In addition, Lux stores per-context globals inside the
  // WebGL context variable itself, on the field _luxGlobals.
};

exports._globals = _globals;

/* Local Variables:  */
/* mode: js2         */
/* js2-basic-offset: 2 */
/* End:              */
