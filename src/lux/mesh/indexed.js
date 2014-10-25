Lux.Mesh.indexed = function(vertices, elements)
{
    vertices = vertices.slice();
    elements = elements.slice();
    
    var model = Lux.model({
        type: "triangles",
        elements: elements,
        vertex: [vertices, 3]
    });

    var normals;

    function createNormals() {
        var normal = new Float32Array(vertices.length);
        var areas = new Float32Array(vertices.length / 3);

        for (var i=0; i<elements.length; i+=3) {
            var i1 = elements[i], i2 = elements[i+1], i3 = elements[i+2];
            var v1 = vec3.copy(vertices.slice(3 * i1, 3 * i1 + 3));
            var v2 = vec3.copy(vertices.slice(3 * i2, 3 * i2 + 3));
            var v3 = vec3.copy(vertices.slice(3 * i3, 3 * i3 + 3));
            var cp = vec3.cross(vec3.minus(v2, v1), vec3.minus(v3, v1));
            var area2 = vec3.length(cp);
            areas[i1] += area2;
            areas[i2] += area2;
            areas[i3] += area2;
            
            normal[3*i1]   += cp[0];
            normal[3*i1+1] += cp[1];
            normal[3*i1+2] += cp[2];
            normal[3*i2]   += cp[0];
            normal[3*i3+1] += cp[1];
            normal[3*i1+2] += cp[2];
            normal[3*i1]   += cp[0];
            normal[3*i2+1] += cp[1];
            normal[3*i3+2] += cp[2];
        }

        for (i=0; i<areas.length; ++i) {
            normal[3*i] /= areas[i];
            normal[3*i+1] /= areas[i];
            normal[3*i+2] /= areas[i];
        }
        return normal;
    }

    return {
        model: model,
        makeNormals: function() {
            if (!normals) {
                normals = createNormals();
                this.model.add("normal", [normals, 3]);
            }
            return normals;
        }
    };
};
