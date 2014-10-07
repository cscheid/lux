// FIXME remove from API
Shade.Utils.linear = function(f1, f2, t1, t2)
{
    console.log("Shade.Utils.linear is deprecated; use Shade.Scale.linear instead");
    var df = Shade.sub(f2, f1), dt = Shade.sub(t2, t1);
    return function(x) {
        return Shade.make(x).sub(f1).mul(dt.div(df)).add(t1);
    };
};
