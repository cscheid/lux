Facet.program = function(vs_src, fs_src)
{
    var ctx = Facet._globals.ctx;
    function getShader(shader_type, str)
    {
        var shader = ctx.createShader(shader_type);
        ctx.shaderSource(shader, str);
        ctx.compileShader(shader);
        if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
            alert(ctx.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    var vertex_shader = getShader(ctx.VERTEX_SHADER, vs_src), 
        fragment_shader = getShader(ctx.FRAGMENT_SHADER, fs_src);

    var shaderProgram = ctx.createProgram();
    ctx.attachShader(shaderProgram, vertex_shader);
    ctx.attachShader(shaderProgram, fragment_shader);
    ctx.linkProgram(shaderProgram);
    
    if (!ctx.getProgramParameter(shaderProgram, ctx.LINK_STATUS)) {
        alert("Could not initialise shaders");
        return null;
    }

    var active_uniforms = ctx.getProgramParameter(shaderProgram, ctx.ACTIVE_UNIFORMS);
    var array_name_regexp = /.*\[0\]/;
    for (var i=0; i<active_uniforms; ++i) {
        var info = ctx.getActiveUniform(shaderProgram, i);
        if (array_name_regexp.test(info.name)) {
            var array_name = info.name.substr(0, info.name.length-3);
            shaderProgram[array_name] = ctx.getUniformLocation(shaderProgram, array_name);
        } else {
            shaderProgram[info.name] = ctx.getUniformLocation(shaderProgram, info.name);
        }
    }
    var active_attributes = ctx.getProgramParameter(shaderProgram, ctx.ACTIVE_ATTRIBUTES);
    for (i=0; i<active_attributes; ++i) {
        var info = ctx.getActiveAttrib(shaderProgram, i);
        shaderProgram[info.name] = ctx.getAttribLocation(shaderProgram, info.name);
    }
    return shaderProgram;    
};
