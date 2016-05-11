Lux.Debug.post = function(key, value)
{
    Lux.Debug.init();
    var str = '<td>' + key + '</td><td>' + value + '</td>';
    if (Lux._globals.debugDict[key]) {
        Lux._globals.debugDict[key].html(str);
    } else {
        Lux._globals.debugDict[key] = $('<tr>' + str + '</tr>');
        Lux._globals.debugTable.append(Lux._globals.debugDict[key]);
    }
};
