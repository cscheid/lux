Facet.Debug.init = function(div)
{
    if (Facet._globals.debug_table)
        return;
    if (_.isUndefined(div)) {
        div = $('<div style="position:absolute;left:1em;top:1em"></div>');
        $('body').append(div);
    }
    var table = $("<table></table>");
    div.append(table);
    Facet._globals.debug_table = table;
    Facet._globals.debug_dict = {};
};
