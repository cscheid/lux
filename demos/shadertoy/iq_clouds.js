// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

//#define FULL_PROCEDURAL

/*
#ifdef FULL_PROCEDURAL
#endif



vec3 sundir = vec3(-1.0,0.0,0.0);


vec4 raymarch( in vec3 ro, in vec3 rd )
{
	vec4 sum = vec4(0, 0, 0, 0);

	float t = 0.0;
	for(int i=0; i<64; i++)
	{
		if( sum.a > 0.99 ) continue;

		vec3 pos = ro + t*rd;
		vec4 col = map( pos );
		
		float dif =  clamp((col.w - map(pos+0.3*sundir).w)/0.6, 0.0, 1.0 );

		vec3 lin = vec3(0.65,0.68,0.7)*1.35 + 0.45*vec3(0.7, 0.5, 0.3)*dif;
		col.xyz *= lin;
		
		col.a *= 0.35;
		col.rgb *= col.a;

		sum = sum + col*(1.0 - sum.a);	

		t += max(0.1,0.025*t);
	}

	sum.xyz /= (0.001+sum.w);

	return clamp( sum, 0.0, 1.0 );
}

void main(void)
{
	vec2 q = gl_FragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0*q;
    p.x *= iResolution.x/ iResolution.y;
    vec2 mo = -1.0 + 2.0*iMouse.xy / iResolution.xy;
    
    // camera
    vec3 ro = 4.0*normalize(vec3(cos(2.75-3.0*mo.x), 0.7+(mo.y+1.0), sin(2.75-3.0*mo.x)));
	vec3 ta = vec3(0.0, 1.0, 0.0);
    vec3 ww = normalize( ta - ro);
    vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));
    vec3 vv = normalize(cross(ww,uu));
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );


    vec4 res = raymarch( ro, rd );

	float sun = clamp( dot(sundir,rd), 0.0, 1.0 );
	vec3 col = vec3(0.6,0.71,0.75) - rd.y*0.2*vec3(1.0,0.5,1.0) + 0.15*0.5;
	col += 0.2*vec3(1.0,.6,0.1)*pow( sun, 8.0 );
	col *= 0.95;
	col = mix( col, res.xyz, res.w );
	col += 0.1*vec3(1.0,0.4,0.2)*pow( sun, 3.0 );
	    
    gl_FragColor = vec4( col, 1.0 );
}
*/

/*
vec4 map( in vec3 p )
{
	float d = 0.2 - p.y;

	vec3 q = p - vec3(1.0,0.1,0.0)*iGlobalTime;
	float f;
    f  = 0.5000*noise( q ); q = q*2.02;
    f += 0.2500*noise( q ); q = q*2.03;
    f += 0.1250*noise( q ); q = q*2.01;
    f += 0.0625*noise( q );

	d += 3.0 * f;

	d = clamp( d, 0.0, 1.0 );
	
	vec4 res = vec4( d );

	res.xyz = mix( 1.15*vec3(1.0,0.95,0.8), vec3(0.7,0.7,0.7), res.x );
	
	return res;
}*/

map = Shade(function (p)
{
    var d = Shade(0.2).sub(p.y());
    var q = p.sub(Shade.vec(1.0, 0.1, 0.0).mul(Shadertoy.globalTime));
    var f, f1, f2, f3, f4, noise = Shadertoy.iq.noise;
    f1 = noise(q).mul(0.5);    q = q.mul(2.02);
    f2 = noise(q).mul(0.25);   q = q.mul(2.03);
    f3 = noise(q).mul(0.125);  q = q.mul(2.01);
    f4 = noise(q).mul(0.0625); 
    f = f1.add(f2).add(f3).add(f4);
    
    d = d.add(f.mul(3)).clamp(0.0, 1.0);
    var res = Shade.vec(Shade.mix(Shade.vec(1.0, 0.95, 0.8).mul(1.15),
                                  Shade.vec(0.7, 0.7, 0.7), d),
                        d);
    return res;
});

sundir = Shade.vec(-1, 0, 0);

raymarch = Shade(function (ro, rd)
{
    var loop = Shade.range(0, 64);
    var state = loop.fold(function(state, i) {
        var sum = state.field("sum");
        var t = state.field("t");
        // FIXME how do I do early termination on state?

        var pos = ro.add(t.mul(rd));
        var col = map(pos);
        var dif = col.w().sub(map(pos.add(sundir.mul(0.3))).w()).div(0.6)
            .clamp(0,1);
        var lin = Shade.vec(0.65, 0.68, 0.7).mul(1.35)
            .add(Shade.vec(0.7, 0.5, 0.3).mul(dif).mul(0.45));
        col = Shade.vec(col.swizzle("rgb").mul(lin), col.a().mul(0.35));
        col = Shade.vec(col.swizzle("rgb").mul(col.a()), col.a());
        sum = sum.add(col.mul(Shade.sub(1, sum.a())));
        t = t.add(Shade.max(0.1, t.mul(0.025)));
        return Shade.struct({
            sum: sum,
            t: t
        });
    }, Shade.struct({
        sum: Shade.vec(0,0,0,0),
        t: 0
    }));
    var sum = state.field("sum");

    return Shade.vec(sum.swizzle("xyz").div(Shade(0.001).add(sum.w())),
                     sum.w()).clamp(0, 1);
});

Shadertoy.iq.clouds = function()
{
    // fixme imouse
    var mouse = Shade.vec(0,0,0,0);
    var resolution = Shadertoy.resolution;

    var q = Shade.fragCoord().swizzle("xy").div(resolution);
    var p = q.mul(2).sub(1);
    p = Shade.vec(p.x().mul(resolution.x().div(resolution.y())), p.y());
    var mo = mouse.swizzle("xy").mul(2.0).div(resolution).sub(1);


    var ro = Shade.vec(Shade.sub(2.75, mo.x().mul(3)).cos(),
                       mo.y().add(1.7),
                       Shade.sub(2.75, mo.x().mul(3)).sin()).normalize().mul(4);
    var ta = Shade.vec(0,1,0);
    var ww = ta.sub(ro).normalize();
    var uu = Shade.vec(0,1,0).cross(ww).normalize();
    var vv = ww.cross(uu).normalize();
    var rd = p.x().mul(uu).add(p.y().mul(vv)).add(ww.mul(1.5)).normalize();

    var res = raymarch(ro, rd);

    var sun = Shade.clamp(sundir.dot(rd), 0, 1);
    var col = Shade.vec(0.6, 0.71, 0.75).sub(rd.y().mul(0.2).mul(Shade.vec(1, 0.5, 1))).add(0.15*0.5);
    col = col.add(Shade.vec(1.0, 0.6, 0.1).mul(0.2).mul(sun.pow(8)));
    col = col.mul(0.95);
    col = Shade.mix(col, res.swizzle("xyz"), res.w());
    col = col.add(Shade.vec(1, 0.4, 0.2).mul(0.1).mul(sun.pow(3)));
    return Shade.vec(col, 1);
};

Shadertoy.main({
    channel0: "tex16",
    shader_function: Shadertoy.iq.clouds
});
