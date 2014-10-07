/*
 * Shade.Debug._json_builder is a helper function used internally by
 * the Shade infrastructure to build JSON objects through
 * Shade.Debug.walk visitors.
 * 
 */
Shade.Debug._json_builder = function(type, parent_reprs_fun) {
    parent_reprs_fun = parent_reprs_fun || function (i) { return i; };
    return function(parent_reprs, refs) {
        if (!_.isUndefined(refs[this.guid]))
            return { type: "reference",
                     guid: this.guid };
        else {
            var result = { type: type || this._json_key(),
                           guid: this.guid,
                           parents: parent_reprs };
            return parent_reprs_fun.call(this, result);
        }
    };
};
