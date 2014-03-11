/*
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

mat3 m3 = mat3( 0.00,  0.80,  0.60,
               -0.80,  0.36, -0.48,
               -0.60, -0.48,  0.64 );

float fbm( vec3 p )
{
    float f = 0.0;

    f += 0.5000*noise( p ); p = m3*p*2.02;
    f += 0.2500*noise( p ); p = m3*p*2.03;
    f += 0.1250*noise( p ); p = m3*p*2.01;
    f += 0.0625*noise( p );

    return f/0.9375;
}



float dbox( vec3 p, vec3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r;
}

float freqs[4];

vec3 map( in vec3 pos )
{

	vec2 fpos = fract( pos.xz ); 
	vec2 ipos = floor( pos.xz );
	
	//ipos.x += floor(10.0*sin( iGlobalTime + 0.1*ipos.y));
	
    float f = 0.0;	
	float id = hash( ipos.x + ipos.y*57.0 );
	#if 1
	f  = freqs[0] * clamp(1.0 - abs(id-0.20)/0.30, 0.0, 1.0 );
	f += freqs[1] * clamp(1.0 - abs(id-0.40)/0.30, 0.0, 1.0 );
	f += freqs[2] * clamp(1.0 - abs(id-0.60)/0.30, 0.0, 1.0 );
	f += freqs[3] * clamp(1.0 - abs(id-0.80)/0.30, 0.0, 1.0 );
	f = pow( clamp( f*0.75, 0.0, 1.0 ), 2.0 );
	#endif
    float h = 0.01 + 4.0*f;
	float dis = dbox( vec3(fpos.x-0.5,pos.y-0.5*h,fpos.y-0.5), vec3(0.3,h*0.5,0.3), 0.1 );

    return vec3( dis,id, f );
}


const float surface = 0.001;

vec3 trace( in vec3 ro, in vec3 rd, in float startf, in float maxd )
{ 
    float s = surface*2.0;
    float t = startf;

    float sid = -1.0;
	float alt = 0.0;
    for( int i=0; i<128; i++ )
    {
        if( s<surface || t>maxd ) break;
        t += 0.15*s;
	    vec3 res = map( ro + rd*t );
        s   = res.x;
	    sid = res.y;
		alt = res.z;
    }
    if( t>maxd ) sid = -1.0;
    return vec3( t, sid, alt );
}

float softshadow( in vec3 ro, in vec3 rd, in float mint, in float maxt, in float k )
{
    float res = 1.0;
    float dt = 0.02;
    float t = mint;
    for( int i=0; i<64; i++ )
    {
        float h = map( ro + rd*t ).x;
        res = min( res, k*h/t );
        t += max( 0.05, dt );
    }
    return clamp( res, 0.0, 1.0 );
}

vec3 calcNormal( in vec3 pos )
{
	vec3 eps = vec3(surface*0.5,0.0,0.0);
	vec3 nor;
	nor.x = map(pos+eps.xyy).x - map(pos-eps.xyy).x;
	nor.y = map(pos+eps.yxy).x - map(pos-eps.yxy).x;
	nor.z = map(pos+eps.yyx).x - map(pos-eps.yyx).x;
	return normalize(nor);
}


void main( void )
{
    vec2 xy = -1.0 + 2.0*gl_FragCoord.xy / iResolution.xy;
    xy.x *= iResolution.x/iResolution.y;
	
    float time = 5.0 + 0.2*iGlobalTime + 20.0*iMouse.x/iResolution.x;

	freqs[0] = texture2D( iChannel0, vec2( 0.01, 0.25 ) ).x;
	freqs[1] = texture2D( iChannel0, vec2( 0.07, 0.25 ) ).x;
	freqs[2] = texture2D( iChannel0, vec2( 0.15, 0.25 ) ).x;
	freqs[3] = texture2D( iChannel0, vec2( 0.30, 0.25 ) ).x;

    // camera	
	vec3 ro = vec3( 8.5*cos(0.2+.33*time), 5.0+2.0*cos(0.1*time), 8.5*sin(0.1+0.37*time) );
	vec3 ta = vec3( -2.5+3.0*cos(1.2+.41*time), 0.0, 2.0+3.0*sin(2.0+0.38*time) );
	float roll = 0.2*sin(0.1*time);
	
	// camera tx
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(roll), cos(roll),0.0);
	vec3 cu = normalize(cross(cw,cp));
	vec3 cv = normalize(cross(cu,cw));
	vec3 rd = normalize( xy.x*cu + xy.y*cv + 1.75*cw );
	
    // image
    vec3 col = vec3( 0.0 );
	
    vec3 res = trace( ro, rd, 0.025, 40.0 );
    float t = res.x;
    float sid = res.y;


	vec3 light1 = vec3(  0.577, 0.577, -0.577 );
    vec3 light2 = vec3( -0.707, 0.000,  0.707 );
    vec3 lpos = vec3(0.0) + 6.0*light1;
	
    if (sid>-0.5)
    {
    vec3 pos = ro + t*rd;
    vec3 nor = calcNormal( pos );
	    
	  
    // lighting
    vec3  ldif = pos - lpos;
    float llen = length( ldif );
    ldif /= llen;
	float con = dot(-light1,ldif);
	float occ = mix( clamp( pos.y/4.0, 0.0, 1.0 ), 1.0, max(0.0,nor.y) );
	float sha =  softshadow( pos, -ldif, 0.01, 5.0, 32.0 );;
		
    float bb = smoothstep( 0.5, 0.8, con );
    float lkey = clamp( dot(nor,-ldif), 0.0, 1.0 );
	vec3  lkat = vec3(1.0);
          lkat *= vec3(bb*bb*0.6+0.4*bb,bb*0.5+0.5*bb*bb,bb).zyx;
          lkat /= 1.0+0.25*llen*llen;		
		  lkat *= 25.0;
          lkat *= sha;
    float lbac = clamp( 0.1 + 0.9*dot( light2, nor ), 0.0, 1.0 );
          lbac *= smoothstep( 0.0, 0.8, con );
		  lbac /= 1.0+0.2*llen*llen;		
		  lbac *= 4.0;
	float lamb = 1.0 - 0.5*nor.y;
          lamb *= 1.0-smoothstep( 10.0, 25.0, length(pos.xz) );
		  lamb *= 0.25 + 0.75*smoothstep( 0.0, 0.8, con );
		  lamb *= 0.25;
		
    vec3 lin  = 1.0*vec3(0.20,0.05,0.02)*lamb*occ;
         lin += 1.0*vec3(1.60,0.70,0.30)*lkey*lkat*(0.5+0.5*occ);
         lin += 1.0*vec3(0.70,0.20,0.08)*lbac*occ;
         lin *= vec3(1.3,1.1,1.0);

		
    // material	
	col = 0.5 + 0.5*vec3( cos(0.0+6.2831*sid),		
                          cos(0.4+6.2831*sid),
                          cos(0.8+6.2831*sid) );
    float ff = fbm( 10.0*vec3(pos.x,4.0*res.z-pos.y,pos.z)*vec3(1.0,0.1,1.0) );	
    col *= 0.2 + 0.8*ff;
		
	col = col*lin;

    vec3 spe = vec3(1.0)*occ*lkat*pow( clamp(dot( reflect(rd,nor), -ldif  ),0.0,1.0), 4.0 );
	col += (0.5+0.5*ff)*0.5*spe*vec3(1.0,0.9,0.7);
    }

	
	col = sqrt( col );
	

    // vigneting
	vec2 q = gl_FragCoord.xy/iResolution.xy;
    col *= 0.2 + 0.8*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );

    gl_FragColor=vec4( col, 1.0 );
}
*/

var m3 = Shade.mat(0,      0.8,   0.6,
                   -0.8,   0.36, -0.48,
                   -0.60, -0.48,  0.64);

fbm = Shade(function(p)
{
    var noise = Shadertoy.iq.noise, f;
    f = noise(p).mul(0.5); p = m3(p).mul(2.02);
    f = f.add(noise(p).mul(0.25)); p = m3(p).mul(2.03);
    f = f.add(noise(p).mul(0.1250)); p = m3(p).mul(2.01);
    f = f.add(noise(p).mul(0.0625));
    return f.div(0.9375);
});

dbox = Shade(function(p, b, r)
{
    return Shade.max(p.abs().sub(b), 0).norm().sub(r);
});

var freqs;

map = Shade(function(pos)
{
    var fpos = pos.swizzle("xz").fract(),
        ipos = pos.swizzle("xz").floor();

    var id = Shadertoy.iq.hash(ipos.x() + ipos.y().mul(57));
    var f1 = freqs.at(0).mul(Shade.sub(1, id.sub(0.2).abs().div(0.3)).clamp(0, 1));
    var f2 = freqs.at(1).mul(Shade.sub(1, id.sub(0.4).abs().div(0.3)).clamp(0, 1));
    var f3 = freqs.at(2).mul(Shade.sub(1, id.sub(0.6).abs().div(0.3)).clamp(0, 1));
    var f4 = freqs.at(3).mul(Shade.sub(1, id.sub(0.8).abs().div(0.3)).clamp(0, 1));
    var f = f1.add(f2).add(f3).add(f4);
    f = f.mul(0.75).clamp(0, 1).pow(2);
    var h = Shade.add(0.01, f.mul(4));
    var dis = dbox(Shade.vec(fpos.x().sub(0.5),
                             pos.y().sub(h.mul(0.5)),
                             fpos.y().sub(0.5)),
                   Shade.vec(0.3, h.mul(0.5), 0.3), 0.1);
    return Shade.vec(dis, id, f);
});

var surface = Shade(0.001);

trace = Shade(function(ro, rd, startf, maxd)
{
    var s = surface.mul(2);
    var t = startf;
    var sid = -1;
    var alt = 0;
    var loop = Shade.range(0, 128);
    var state = loop.fold(function(state, i) {
        var s = state.field("s");
        var t = state.field("t");
        var sid = state.field("sid");
        var alt = state.field("alt");
        var done = s.lt(surface).or(t.gt(maxd));
        t = t.add(s.mul(0.15));
        var res = done.ifelse(
            Shade.vec(s, sid, alt),
            map(ro.add(t.mul(rd))));
        return Shade.struct({
            s: res.x(),
            sid: res.y(),
            alt: res.z(),
            t: t
        });
    }, Shade.struct({
        s: s,
        sid: sid,
        alt: alt,
        t: t
    }));
    s = state.field("s");
    t = state.field("t");
    sid = state.field("sid");
    alt = state.field("alt");
    sid = sid.ifelse(t.gt(maxd), -1.0, sid);
    return Shade.vec(t, sid, alt);
});

softshadow = Shade(function(ro, rd, mint, maxt, k)
{
    var dt = 0.02;
    var result = Shade.range(0,64)
        .fold(function(state, i) {
            var t = state.field("t");
            var res = state.field("res");
            var dt = state.field("dt");
            var h = map(ro.add(rd.mul(t))).x();
            res = Shade.min(res, k.mul(h).div(t));
            t = t.add(Shade.max(0.05, dt));
            return Shade.struct({
                res: res,
                t: t
            });
        }, Shade.struct({
            res: 1,
            t: mint
        }));
    return result.field("res").clamp(0, 1);
});

calcNormal = Shade(function(pos) {
    var eps = Shade.vec(surface.mul(0.5), 0, 0);
    var nor = Shade.vec(
        Shade.sub(map(pos.add(eps.swizzle("xyy"))).x(), map(pos.sub(eps.swizzle("xyy"))).x()),
        Shade.sub(map(pos.add(eps.swizzle("yxy"))).x(), map(pos.sub(eps.swizzle("yxy"))).x()),
        Shade.sub(map(pos.add(eps.swizzle("yyx"))).x(), map(pos.sub(eps.swizzle("yyx"))).x()));
    return nor.normalize();
});

Shadertoy.iq.cubescape = function()
{
    var resolution = Shadertoy.resolution;
    var xy = Shade.fragCoord().swizzle("xy").mul(2).div(resolution).sub(1);
    xy = Shade.vec(xy.x().mul(resolution.x()).div(resolution.y()), xy.y());
    
};

