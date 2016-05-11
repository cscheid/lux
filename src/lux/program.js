Lux.program = function(vsSrc, fsSrc)
{
    var ctx = Lux._globals.ctx;
    function getShader(shaderType, str)
    {
        var shader = ctx.createShader(shaderType);
        ctx.shaderSource(shader, str);
        ctx.compileShader(shader);
        if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
            alert(ctx.getShaderInfoLog(shader));
            console.log("Error message: ");
            console.log(ctx.getShaderInfoLog(shader));
            console.log("Failing shader: ");
            console.log(str);
            throw new Error("failed compilation");
        }
        return shader;
    }

    var vertexShader = getShader(ctx.VERTEX_SHADER, vsSrc), 
        fragmentShader = getShader(ctx.FRAGMENT_SHADER, fsSrc);

    var shaderProgram = ctx.createProgram();
    ctx.attachShader(shaderProgram, vertexShader);
    ctx.attachShader(shaderProgram, fragmentShader);
    ctx.linkProgram(shaderProgram);
    
    if (!ctx.getProgramParameter(shaderProgram, ctx.LINK_STATUS)) {
        alert("Could not link program");
        console.log("Error message: ");
        console.log(ctx.getProgramInfoLog(shaderProgram));
        console.log("Failing shader pair:");
        console.log("Vertex shader");
        console.log(vsSrc);
        console.log("Fragment shader");
        console.log(fsSrc);
        throw new Error("failed link");
    }

    var activeParameters = ctx.getProgramParameter(shaderProgram, ctx.ACTIVE_UNIFORMS);
    var arrayNameRegexp = /.*\[0\]/;
    var info;
    for (var i=0; i<activeParameters; ++i) {
        info = ctx.getActiveUniform(shaderProgram, i);
        if (arrayNameRegexp.test(info.name)) {
            var arrayName = info.name.substr(0, info.name.length-3);
            shaderProgram[arrayName] = ctx.getUniformLocation(shaderProgram, arrayName);
        } else {
            shaderProgram[info.name] = ctx.getUniformLocation(shaderProgram, info.name);
        }
    }
    var activeAttributes = ctx.getProgramParameter(shaderProgram, ctx.ACTIVE_ATTRIBUTES);
    for (i=0; i<activeAttributes; ++i) {
        info = ctx.getActiveAttrib(shaderProgram, i);
        shaderProgram[info.name] = ctx.getAttribLocation(shaderProgram, info.name);
    }
    return shaderProgram;    
};
