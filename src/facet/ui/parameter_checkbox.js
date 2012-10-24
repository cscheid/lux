Facet.UI.parameter_checkbox = function(opts)
{
    opts = _.defaults(opts, {
        toggle: function() {}
    });
    var element = opts.element;
    var parameter = opts.parameter;

    function on_click(event) {
        parameter.set(~~event.target.checked);
        console.log(parameter.get());
        opts.toggle(event);
        Facet.Scene.invalidate();
    }

    $(element).button().click(on_click);
};
