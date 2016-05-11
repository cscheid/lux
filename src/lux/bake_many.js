// DEPRECATED, possibly useless. actorMany is what you're probably looking for,
// but that has a horrible name. There's got to be a better API for this kind of thing.

Lux.bakeMany = function(modelList, 
                        appearanceFunction,
                        modelCallback)
{
    var scratchModel = _.clone(modelList[0]);
    var batch = Lux.bake(scratchModel, appearanceFunction(scratchModel));
    return modelCallback ? {
        draw: function() {
            _.each(modelList, function(model, i) {
                _.each(scratchModel.attributes, function(v, k) {
                    v.set(model[k].get());
                });
                scratchModel.elements.set(model.elements.array);
                modelCallback(model, i);
                batch.draw();
            });
        }
    }:{
        draw: function() {
            _.each(modelList, function(model, i) {
                _.each(scratchModel.attributes, function(v, k) {
                    v.set(model[k].get());
                });
                scratchModel.elements.set(model.elements.array);
                batch.draw();
            });
        }
    };
};
