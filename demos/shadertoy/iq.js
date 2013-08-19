Shadertoy.iq = {};

/*
  float hash( float n )
  {
      return fract(sin(n)*43758.5453);
  }

  float noise( in vec2 x )
  {
      vec2 p = floor(x);
      vec2 f = fract(x);
      f = f*f*(3.0-2.0*f);
      float n = p.x + p.y*57.0;
      return mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                 mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
  }
*/

Shadertoy.iq.hash = Shade(function(n)
{
    return n.sin().mul(43578.5453).fract();
});

Shadertoy.iq.noise = Shade(function(x)
{
    var hash = Shadertoy.iq.hash;
    var p = x.floor();
    var f = x.fract();
    f = f.mul(f).mul(Shade.sub(3, Shade.mul(2, f)));
    var n = p.x().add(p.y().mul(57));
    return Shade.mix(Shade.mix(hash(n),         hash(n.add(1)), f.x()),
                     Shade.mix(hash(n.add(57)), hash(n.add(58)), f.x()), f.y());
});

