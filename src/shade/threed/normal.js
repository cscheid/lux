/*
 * Given a position expression, computes screen-space normals using
 * pixel derivatives
 */
Shade.ThreeD.normal = function(position)
{
    if (position.type.equals(Shade.Types.vec4))
        position = position.swizzle("xyz").div(position.w());
    var dposDpixelx = Shade.dFdx(position);
    var dposDpixely = Shade.dFdy(position);
    return Shade.normalize(Shade.cross(dposDpixelx, dposDpixely));
};
