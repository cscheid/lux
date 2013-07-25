/*
 * Shade.Debug.walk walks an expression dag and calls 'visit' on each
 * expression in a bottom-up order. The return values of 'visit' are
 * passed to the higher-level invocations of 'visit', and so is the
 * dictionary of references that is used to resolve multiple node
 * references. Shade.Debug.walk will only call 'visit' once per node,
 * even if visit can be reached by many different paths in the dag.
 * 
 * If 'revisit' is passed, then it is called every time a node is 
 * revisited. 
 * 
 * Shade.Debug.walk returns the dictionary of references.
 */

Shade.Debug.walk = function(exp, visit, revisit) {
    var refs = {};
    function internal_walk_no_revisit(node) {
        if (!_.isUndefined(refs[node.guid])) {
            return refs[node.guid];
        }
        var parent_results = _.map(node.parents, internal_walk_no_revisit);
        var result = visit(node, parent_results, refs);
        refs[node.guid] = result;
        return result;
    };
    function internal_walk_revisit(node) {
        if (!_.isUndefined(refs[node.guid])) {
            return revisit(node, _.map(node.parents, function(exp) {
                return refs[exp.guid];
            }), refs);
        }
        var parent_results = _.map(node.parents, internal_walk_revisit);
        var result = visit(node, parent_results, refs);
        refs[node.guid] = result;
        return result;
    }
    if (!_.isUndefined(revisit))
        internal_walk_revisit(exp);
    else
        internal_walk_no_revisit(exp);
    return refs;
};
