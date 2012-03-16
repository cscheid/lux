// FIXME rename this, it'll be really confusing.
Shade.is_program_parameter = function(key)
{
    return ["color", "position", "point_size",
            "gl_FragColor", "gl_Position", "gl_PointSize"].indexOf(key) != -1;
};
