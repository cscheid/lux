/*
 * Shade.Debug._jsonBuilder is a helper function used internally by
 * the Shade infrastructure to build JSON objects through
 * Shade.Debug.walk visitors.
 * 
 */
Shade.Debug._jsonBuilder = function(type, parentReprsFun) {
    parentReprsFun = parentReprsFun || function (i) { return i; };
    return function(parentReprs, refs) {
        if (!_.isUndefined(refs[this.guid]))
            return { type: "reference",
                     guid: this.guid };
        else {
            var result = { type: type || this._jsonKey(),
                           guid: this.guid,
                           parents: parentReprs };
            return parentReprsFun.call(this, result);
        }
    };
};
