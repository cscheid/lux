/*
 * from_json produces a JSON object that satisfies the following property:
 * 
 * if j is a Shade expresssion,
 * 
 * Shade.Debug.from_json(f.json()) equals f, up to guid renaming
 */
Shade.Debug.from_json = function(json)
{
    var refs = {};
    function build_node(json_node) {
        var parent_nodes = _.map(json_node.parents, function(parent) {
            return refs[parent.guid];
        });
        switch (json_node.type) {
        case "constant": 
            return Shade.constant.apply(undefined, json_node.values);
        case "struct":
            return Shade.struct(_.build(_.zip(json_node.fields, json_node.parents)));
        case "parameter":
            return Shade.parameter(json_node.parameter_type);
        case "attribute":
            return Shade.attribute(json_node.attribute_type);
        case "varying":
            return Shade.varying(json_node.varying_name, json_node.varying_type);
        case "index":
            return parent_nodes[0].at(parent_nodes[1]);
        };

        // swizzle
        var m = json_node.type.match(/swizzle{(.+)}$/);
        if (m) return parent_nodes[0].swizzle(m[1]);

        // field
        m = json_node.type.match(/struct-accessor{(.+)}$/);
        if (m) return parent_nodes[0].field(m[1]);

        var f = Shade[json_node.type];
        if (_.isUndefined(f)) {
            throw new Error("from_json: unimplemented type '" + json_node.type + "'");
        }
        return f.apply(undefined, parent_nodes);
    }
    function walk_json(json_node) {
        if (json_node.type === 'reference')
            return refs[json_node.guid];
        _.each(json_node.parents, walk_json);
        var new_node = build_node(json_node);
        refs[json_node.guid] = new_node;
        return new_node;
    }
    return walk_json(json);
};
