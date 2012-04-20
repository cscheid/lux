Facet.Models.teapot = function()
{
    var elements = teapot_elements;
    var coords = teapot_coords;

    var mesh = Facet.Mesh.indexed(coords, elements);
    mesh.make_normals();
    return mesh.model;
};
