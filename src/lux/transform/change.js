Lux.Transform.change = function(field, f)
{
    return function(appearance) {
        var result = _.clone(appearance);
        result[field] = f(appearance[field]);
        return result;
    };
};
