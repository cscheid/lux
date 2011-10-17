Shade.translation = function(t)
{
    return Shade.mat(Shade.vec(1,0,0,0),
                     Shade.vec(0,1,0,0),
                     Shade.vec(0,0,1,0),
                     Shade.vec(t, 1));
};
