/*
 * Lux.UI.parameter_slider is a function to help create UI elements
 * that control Shade.parameter objects. 
 * 
 * It uses jquery-ui sliders, and so assumes jquery-ui in addition to jquery.
 * 
 * I hear jquery-ui is about as cool as pocket protectors, but hey, 
 * it does the job.
 * 
 */

/*
 * Lux.UI.parameter_slider requires "element" and "parameter" options.
 * 
 * opts.element is the HTML element used by jquery-ui to create the slider. That
 *   object needs to have the correct CSS class assigned to it ahead of calling
 *   this function.
 * 
 * opts.parameter is the Shade.parameter object under control.
 * 
 * opts.change is a user-defined callback to the slider change event.
 * opts.slide is a user-defined callback to the slider slide event.
 * 
 *   Both event handlers are passed the HTML element, the parameter object, 
 *   and the new value, in that order.
 * 
 * opts.min is the minimum value allowed by the slider
 * opts.max is the maximum value allowed by the slider
 * opts.orientation is the slider's orientation, either "horizontal" or "vertical"
 */

Lux.UI.parameter_slider = function(opts)
{
    opts = _.defaults(opts, {
        min: 0,
        max: 1,
        orientation: "horizontal",
        slide: function() {},
        change: function() {}
    });
    var element = opts.element;
    var parameter =  opts.parameter;

    var slider_min = 0, slider_max = 1000;

    function to_slider(v) {
        return (v-opts.min) / (opts.max - opts.min) * 
            (slider_max - slider_min) + slider_min;
    }
    function to_parameter(v) {
        return (v-slider_min) / (slider_max - slider_min) *
            (opts.max - opts.min) + opts.min;
    }
    $(element).slider({
        min: slider_min,
        max: slider_max,
        value: to_slider(parameter.get()),
        orientation: opts.orientation,
        slide: function() {
            var v = to_parameter($(element).slider("value"));
            parameter.set(v);
            opts.slide(element, parameter, v);
            Lux.Scene.invalidate();
        },
        change: function() {
            var v = to_parameter($(element).slider("value"));
            parameter.set(v);
            opts.change(element, parameter, v);
            Lux.Scene.invalidate();
        }
    });
};
