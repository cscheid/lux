Facet.Marks.polygon = function(opts)
{
    opts = _.defaults(opts, {
        fill_color: Shade.vec(0,0,0,1),
        mode: Facet.DrawingMode.over_with_depth,
   });

    if (!opts.x)
        throw "missing required parameter 'x'";
    if (!opts.y)
        throw "missing required parameter 'y'";
    if (!opts.elements)
        throw "missing required parameter 'elements'";



    function to_opengl(x) { return (x * 2) - 1; }
    var position = [], elements;

	for(var i=0;i<opts.x.length;i++){
       position.push(to_opengl(opts.x[i])); 
       position.push(to_opengl(opts.y[i]));
	}

	return polygon_model = Facet.Models.polygon({
		position: position,
		elements: opts.elements,
		style: style,
		fill_color: opts.fill_color,
		mode: opts.mode
	});

};
