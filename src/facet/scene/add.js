Facet.Scene.add = function(obj)
{
    var scene = Facet._globals.ctx._facet_globals.scene;

    if (_.isUndefined(obj.batch_id)) {
        throw "Expected a batch, got an object without a batch_id";
    }
    var batch_id = obj.batch_id;
    scene.push(obj);
    Facet.Scene.invalidate();
};
