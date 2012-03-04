Shade.round = Shade.make(function(v) {
    return v.add(0.5).floor();
});
Shade.Exp.round = function() { return Shade.round(this); };
