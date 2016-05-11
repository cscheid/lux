/*
 * Lux.UI.parameterSlider is a function to help create UI elements
 * that control Shade.parameter objects. 
 *
 * The result of calling Lux.UI.parameterSlider is a Shade.parameter,
 * either freshly created, or the one passed as input.
 *
 * Lux.UI.parameterSlider requires the "element" field in its options.
 * 
 * opts.element is the HTML element used by jquery-ui to create the slider. That
 *   object needs to have the correct CSS class assigned to it ahead of calling
 *   this function.
 * 
 * opts.parameter is the Shade.parameter object under control. if opts.parameter
 *   is undefined, Lux.UI.parameterSlider creates the Shade.parameter.
 * 
 * opts.change is a user-defined callback to the slider change event.
 * opts.slide is a user-defined callback to the slider slide event.
 * 
 *   Both event handlers are passed the HTML element, the parameter object, 
 *   and the new value, in that order.
 * 
 * opts.min is the minimum value allowed by the slider
 * opts.max is the maximum value allowed by the slider
 * opts.value is the starting value of the slider and parameter
 * opts.orientation is the slider's orientation, either "horizontal" or "vertical"
 *
 * Lux.UI.parameterSlider uses jquery-ui sliders, and so assumes
 * jquery-ui in addition to jquery.  If you know of a better
 * lightweight gui library, let me know as well.
 */

Lux.UI.parameterSlider = function(opts)
{
    opts = _.defaults(opts, {
        min: 0,
        max: 1,
        orientation: "horizontal",
        slide: function() {},
        change: function() {}
    });
    var element = opts.element;
    if (_.isUndefined(opts.element)) {
        throw new Error("parameterSlider requires an element option");
    }
    if (_.isUndefined(opts.parameter)) {
        opts.parameter = Shade.parameter("float", opts.min);
    }
    if (!_.isUndefined(opts.value)) {
        opts.parameter.set(opts.value);
    }
    var parameter  = opts.parameter,
        sliderMin = 0, 
        sliderMax = 1000;

    function toSlider(v) {
        return (v-opts.min) / (opts.max - opts.min) * 
            (sliderMax - sliderMin) + sliderMin;
    }
    function toParameter(v) {
        return (v-sliderMin) / (sliderMax - sliderMin) *
            (opts.max - opts.min) + opts.min;
    }
    $(element).slider({
        min: sliderMin,
        max: sliderMax,
        value: toSlider(parameter.get()),
        orientation: opts.orientation,
        slide: function() {
            var v = toParameter($(element).slider("value"));
            parameter.set(v);
            opts.slide(element, parameter, v);
            Lux.Scene.invalidate();
        },
        change: function() {
            var v = toParameter($(element).slider("value"));
            parameter.set(v);
            opts.change(element, parameter, v);
            Lux.Scene.invalidate();
        }
    });
    return parameter;
};
