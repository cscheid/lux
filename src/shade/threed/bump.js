// Shade.ThreeD.bump returns a normal perturbed by bump mapping.

Shade.ThreeD.bump = function(opts) {
    // Via Three.JS, and
    // http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html
    var uv        = opts.uv;
    var bumpMap   = opts.map;
    var bumpScale = opts.scale;
    var surfPos   = opts.position;
    var surfNorm  = opts.normal;

    var dSTdx     = Shade.dFdx(uv);
    var dSTdy     = Shade.dFdy(uv);
    var Hll       = Shade.texture2D(bumpMap, uv).x();
    var dBx       = Shade.texture2D(bumpMap, uv.add(dSTdx)).x().sub(Hll);
    var dBy       = Shade.texture2D(bumpMap, uv.add(dSTdy)).x().sub(Hll);
    var dHdxy     = Shade.vec(dBx, dBy).mul(bumpScale);
    var sigmaX    = Shade.dFdx(surfPos);
    var sigmaY    = Shade.dFdy(surfPos);
    var R1        = Shade.cross(sigmaY, surfNorm);
    var R2        = Shade.cross(surfNorm, sigmaX);
    var det       = sigmaX.dot(R1);
    var vGrad     = det.sign().mul(dHdxy.x().mul(R1).add(dHdxy.y().mul(R2)));
    return det.abs().mul(surfNorm).sub(vGrad).normalize();
};
