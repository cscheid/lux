// Shade.ThreeD.bump returns a normal perturbed by bump mapping.

Shade.ThreeD.bump = function(opts) {
    // Via Three.JS, and
    // http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html
    var uv         = opts.uv;
    var bump_map   = opts.map;
    var bump_scale = opts.scale;
    var surf_pos   = opts.position;
    var surf_norm  = opts.normal;

    var dSTdx      = Shade.dFdx(uv);
    var dSTdy      = Shade.dFdy(uv);
    var Hll        = Shade.texture2D(bump_map, uv).x();
    var dBx        = Shade.texture2D(bump_map, uv.add(dSTdx)).x().sub(Hll);
    var dBy        = Shade.texture2D(bump_map, uv.add(dSTdy)).x().sub(Hll);
    var dHdxy      = Shade.vec(dBx, dBy).mul(bump_scale);
    var sigmaX     = Shade.dFdx(surf_pos);
    var sigmaY     = Shade.dFdy(surf_pos);
    var R1         = Shade.cross(sigmaY, surf_norm);
    var R2         = Shade.cross(surf_norm, sigmaX);
    var det        = sigmaX.dot(R1);
    var vGrad      = det.sign().mul(dHdxy.x().mul(R1).add(dHdxy.y().mul(R2)));
    return det.abs().mul(surf_norm).sub(vGrad).normalize();
};
