// vec2 map( vec2 p )
// {
// 	p.x += 0.1*sin( iGlobalTime + 2.0*p.y ) ;
// 	p.y += 0.1*sin( iGlobalTime + 2.0*p.x ) ;
// 	float a = noise(p*1.5 + sin(0.1*iGlobalTime))*6.2831;
// 	a -= iGlobalTime + gl_FragCoord.x/iResolution.x;
// 	return vec2( cos(a), sin(a) );
// }

function map(p)
{
    var globalTime = Shadertoy.globalTime;
    var px = p.x();
    var py = p.y();

    px = px.add(globalTime.add(py.mul(2)).sin().mul(0.1));
    py = py.add(globalTime.add(px.mul(2)).sin().mul(0.1));
    p = Shade.vec(px, py);

    var a = Shadertoy.iq.noise(p.mul(1.5).add(globalTime.mul(0.1).sin())).mul(6.2831);
    a = a.sub(globalTime.add(Shade.fragCoord().x().div(Shadertoy.resolution.x())));
    return Shade.vec(a.cos(), a.sin());
};

Shadertoy.iq.noise_blur = function()
{
    var resolution = Shadertoy.resolution;
    var p = Shade.fragCoord().swizzle("xy").div(resolution);
    var uv = p.mul(2).sub(1);
    uv = Shade.vec(uv.x().mul(resolution.x()).div(resolution.y()), uv.y());

    var loop = Shade.range(0, 32);
    var result = loop.fold(function(state, i) {
        var uv = state.field("uv");
        var col = state.field("col");
        var acc = state.field("acc");
        var dir = map(uv);
        var h = i.as_float().div(32),
            w = Shade.mul(4, h.mul(Shade.sub(1, h))),
            ttt = w.mul(Shade.texture2D(Shadertoy.channel0, uv).swizzle("xyz"));
        ttt = ttt.mul(Shade.mix(Shade.vec(0.6, 0.7, 0.7),
                                Shade.vec(1.0, 0.95, 0.9),
                                Shade.sub(0.5, Shade.dot(Shade.reflect(Shade.vec(dir, 0),
                                                                       Shade.vec(1,0,0)).swizzle("xy"),
                                                         Shade.vec(0.707, 0.707)).mul(0.5))));
        col = col.add(w.mul(ttt));
        acc = acc.add(w);
        uv = uv.add(dir.mul(0.008));

        return Shade.struct({
            uv: uv,
            col: col,
            acc: acc
        });
    }, Shade.struct({
        uv: uv,
        col: Shade.vec(0,0,0),
        acc: 0
    }));

    uv = result.field("uv");
    var col = result.field("col");
    var acc = result.field("acc");

    col = col.div(acc);
    var gg = Shade.dot(col, Shade.vec(0.333, 0.333, 0.333));
    var nor = Shade.normalize(Shade.vec(Shade.dFdx(gg), 0.5, Shade.dFdy(gg)));
    col = col.add(Shade.vec(0.4, 0.4, 0.4).mul(Shade.dot(nor, Shade.vec(0.7, 0.01, 0.7))));

    var di = map(uv);
    col = col.mul(Shade.add(0.65, Shade.dot(di, Shade.vec(0.707, 0.707)).mul(0.35)));
    col = col.mul(Shade.add(0.20, Shade.pow(Shade(4).mul(p.x()).mul(Shade.sub(1, p.x())), 0.1).mul(0.80)));
    col = col.mul(1.7);

    return Shade.vec(col, 1.0);
};

/// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
/*
void main( void )
{
	vec2 p = gl_FragCoord.xy / iResolution.xy;
	vec2 uv = -1.0 + 2.0*p;
	uv.x *= iResolution.x / iResolution.y;
		
	float acc = 0.0;
	vec3  col = vec3(0.0);
	for( int i=0; i<32; i++ )
	{
		vec2 dir = map( uv );
		
		float h = float(i)/32.0;
		float w = 4.0*h*(1.0-h);
		
		vec3 ttt = w*texture2D( iChannel0, uv ).xyz;
		ttt *= mix( vec3(0.6,0.7,0.7), vec3(1.0,0.95,0.9), 0.5 - 0.5*dot( reflect(vec3(dir,0.0), vec3(1.0,0.0,0.0)).xy, vec2(0.707) ) );
		col += w*ttt;
		acc += w;
		
		uv += 0.008*dir;
	}
	col /= acc;
    
	float gg = dot( col, vec3(0.333) );
	vec3 nor = normalize( vec3( dFdx(gg), 0.5, dFdy(gg) ) );
	col += vec3(0.4)*dot( nor, vec3(0.7,0.01,0.7) );

	vec2 di = map( uv );
	col *= 0.65 + 0.35*dot( di, vec2(0.707) );
	col *= 0.20 + 0.80*pow( 4.0*p.x*(1.0-p.x), 0.1 );
	col *= 1.7;

	gl_FragColor = vec4( col, 1.0 );
}
*/

$(function() {
    Lux.init();
    Shadertoy.init({
        channel0: "tex01",
        on_load: function() {
            var square = Lux.Models.square();

            Lux.Scene.add(Lux.actor({
                model: square,
                appearance: {
                    position: square.vertex.mul(2).sub(1),
                    color: Shadertoy.iq.noise_blur()
                }
            }));

            Lux.Scene.animate(Shadertoy.tick);
        }
    });
});
