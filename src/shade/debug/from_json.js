/*
 * fromJson produces a JSON object that satisfies the following property:
 * 
 * if j is a Shade expresssion,
 * 
 * Shade.Debug.fromJson(f.json()) equals f, up to guid renaming
 */
Shade.Debug.fromJson = function(json)
{
    var refs = {};
    function buildNode(jsonNode) {
        var parentNodes = _.map(jsonNode.parents, function(parent) {
            return refs[parent.guid];
        });
        switch (jsonNode.type) {
        case "constant": 
            return Shade.constant.apply(undefined, jsonNode.values);
        case "struct":
            return Shade.struct(_.build(_.zip(jsonNode.fields, jsonNode.parents)));
        case "parameter":
            return Shade.parameter(jsonNode.parameterType);
        case "attribute":
            return Shade.attribute(jsonNode.attributeType);
        case "varying":
            return Shade.varying(jsonNode.varyingName, jsonNode.varyingType);
        case "index":
            return parentNodes[0].at(parentNodes[1]);
        };

        // swizzle
        var m = jsonNode.type.match(/swizzle{(.+)}$/);
        if (m) return parentNodes[0].swizzle(m[1]);

        // field
        m = jsonNode.type.match(/struct-accessor{(.+)}$/);
        if (m) return parentNodes[0].field(m[1]);

        var f = Shade[jsonNode.type];
        if (_.isUndefined(f)) {
            throw new Error("fromJson: unimplemented type '" + jsonNode.type + "'");
        }
        return f.apply(undefined, parentNodes);
    }
    function walkJson(jsonNode) {
        if (jsonNode.type === 'reference')
            return refs[jsonNode.guid];
        _.each(jsonNode.parents, walkJson);
        var newNode = buildNode(jsonNode);
        refs[jsonNode.guid] = newNode;
        return newNode;
    }
    return walkJson(json);
};
