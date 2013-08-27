// DEPRECATED, possibly useless. actor_many is what you're probably looking for,
// but that has a horrible name. There's got to be a better API for this kind of thing.

Lux.bake_many = function(model_list, 
                         appearance_function,
                         model_callback)
{
    var scratch_model = _.clone(model_list[0]);
    var batch = Lux.bake(scratch_model, appearance_function(scratch_model));
    return model_callback ? {
        draw: function() {
            _.each(model_list, function(model, i) {
                _.each(scratch_model.attributes, function(v, k) {
                    v.set(model[k].get());
                });
                scratch_model.elements.set(model.elements.array);
                model_callback(model, i);
                batch.draw();
            });
        }
    }:{
        draw: function() {
            _.each(model_list, function(model, i) {
                _.each(scratch_model.attributes, function(v, k) {
                    v.set(model[k].get());
                });
                scratch_model.elements.set(model.elements.array);
                batch.draw();
            });
        }
    };
};
