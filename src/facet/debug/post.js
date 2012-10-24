Facet.Debug.post = function(key, value)
{
    Facet.Debug.init();
    var str = '<td>' + key + '</td><td>' + value + '</td>';
    if (Facet._globals.debug_dict[key]) {
        Facet._globals.debug_dict[key].html(str);
    } else {
        Facet._globals.debug_dict[key] = $('<tr>' + str + '</tr>');
        Facet._globals.debug_table.append(Facet._globals.debug_dict[key]);
    }
};
