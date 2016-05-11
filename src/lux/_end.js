    if (typeof define === "function" && define.amd) {
        define(Lux);
    } else if (typeof module === "object" && module.exports) {
        module.exports = Lux;
    } else {
        this.Lux = Lux;
        this.Shade = Shade;
        this.vec = vec;
        this.vec2 = vec2;
        this.vec3 = vec3;
        this.vec4 = vec4;
        this.mat = mat;
        this.mat2 = mat2;
        this.mat3 = mat3;
        this.mat4 = mat4;
    }
}).apply(this);
