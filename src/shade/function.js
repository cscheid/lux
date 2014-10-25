Shade.function = function(value)
{
    /* lifts the passed function to a "shade function".
     
     In other words, this creates a function that replaces every
     passed parameter p by Shade.make(p) This way, we save a lot of
     typing and errors. If a javascript function is expected to
     take shade values and produce shade expressions as a result,
     simply wrap that function around a call to Shade.make()


     Developer notes:

     FIXME: Document jsEvaluate appropriately. This is a cool feature!

     This is not a part of the valueExp object hierarchy because GLSL
     is not a functional language. These objects are allowed in
     Javascript, but must always be applied to something before being
     compiled.

     there might be a clean way of making this belong in exp.js, etc.
     but I don't see it yet.

     */

    var result = function() {
        var wrappedArguments = [];
        for (var i=0; i<arguments.length; ++i) {
            wrappedArguments.push(Shade.make(arguments[i]));
        }
        return Shade.make(value.apply(this, wrappedArguments));
    };
    result.type = Shade.Types.functionT;
    var argsTypeCache = {};
    var createParameterizedFunction = function(shadeFunction, types) {
        var parameters = _.map(types, function(t) {
            return Shade.parameter(t);
        });
        var expression = shadeFunction.apply(this, parameters);
        return function() {
            for (var i=0; i<arguments.length; ++i)
                parameters[i].set(arguments[i]);
            return expression.evaluate();
        };
    };

    result.jsEvaluate = function() {
        var argsTypes = [];
        var argsTypeString;
        for (var i=0; i<arguments.length; ++i) {
            argsTypes.push(Shade.Types.typeOf(arguments[i]));
        }
        argsTypeString = _.map(argsTypes, function(t) { return t.repr(); }).join(",");
        if (_.isUndefined(argsTypeCache[argsTypeString]))
            argsTypeCache[argsTypeString] = createParameterizedFunction(result, argsTypes);
        return argsTypeCache[argsTypeString].apply(result, arguments);
    };

    result.evaluate = function() {
        return value; // function() {
        //     return value.apply(result, arguments);
        //     // return result.jsEvaluate.apply(result, _.toArray(arguments));
        // };
    };

    result.add = function(other) {
        return Shade.add(this, other);
    };
    result.sub = function(other) {
        return Shade.sub(this, other);
    };
    result.mul = function(other) {
        return Shade.mul(this, other);
    };
    result.div = function(other) {
        return Shade.div(this, other);
    };

    return result;
};
