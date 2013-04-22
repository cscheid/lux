Lux.Debug.post = function(key, value)
{
    Lux.Debug.init();
    var str = '<td>' + key + '</td><td>' + value + '</td>';
    if (Lux._globals.debug_dict[key]) {
        Lux._globals.debug_dict[key].html(str);
    } else {
        Lux._globals.debug_dict[key] = $('<tr>' + str + '</tr>');
        Lux._globals.debug_table.append(Lux._globals.debug_dict[key]);
    }
};
