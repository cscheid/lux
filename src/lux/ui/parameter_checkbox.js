Lux.UI.parameterCheckbox = function(opts)
{
    opts = _.defaults(opts, {
        toggle: function() {}
    });
    var element = opts.element;
    var parameter = opts.parameter;

    function onClick(event) {
        parameter.set(~~event.target.checked);
        console.log(parameter.get());
        opts.toggle(event);
        Lux.Scene.invalidate();
    }

    $(element).button().click(onClick);
};
