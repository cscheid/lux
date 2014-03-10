Shade.function = function(value)
{
    /* lifts the passed function to a "shade function".
     
     In other words, this creates a function that replaces every
     passed parameter p by Shade.make(p) This way, we save a lot of
     typing and errors. If a javascript function is expected to
     take shade values and produce shade expressions as a result,
     simply wrap that function around a call to Shade.make()


     Developer notes:

     FIXME: Document js_evaluate appropriately. This is a cool feature!

     This is not a part of the value_exp object hierarchy because GLSL
     is not a functional language. These objects are allowed in
     Javascript, but must always be applied to something before being
     compiled.

     there might be a clean way of making this belong in exp.js, etc.
     but I don't see it yet.

     */

    var result = function() {
        var wrapped_arguments = [];
        for (var i=0; i<arguments.length; ++i) {
            wrapped_arguments.push(Shade.make(arguments[i]));
        }
        return Shade.make(value.apply(this, wrapped_arguments));
    };
    result.type = Shade.Types.function_t;
    var args_type_cache = {};
    var create_parameterized_function = function(shade_function, types) {
        var parameters = _.map(types, function(t) {
            return Shade.parameter(t);
        });
        var expression = shade_function.apply(this, parameters);
        return function() {
            for (var i=0; i<arguments.length; ++i)
                parameters[i].set(arguments[i]);
            return expression.evaluate();
        };
    };

    result.js_evaluate = function() {
        var args_types = [];
        var args_type_string;
        for (var i=0; i<arguments.length; ++i) {
            args_types.push(Shade.Types.type_of(arguments[i]));
        }
        args_type_string = _.map(args_types, function(t) { return t.repr(); }).join(",");
        if (_.isUndefined(args_type_cache[args_type_string]))
            args_type_cache[args_type_string] = create_parameterized_function(result, args_types);
        return args_type_cache[args_type_string].apply(result, arguments);
    };

    result.evaluate = function() {
        return function() {
            return result.js_evaluate.apply(result, _.toArray(arguments));
        };
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
