import { init } from './init.js';
import { Lux } from '../../lux.js';

exports.post = function(key, value)
{
  init();
  if (Lux._globals.debugDict[key]) {
    Lux._globals.debugDict[key].innerText = value;
  } else {
    var row = document.createElement("tr");
    var keyNode = document.createElement("td");
    keyNode.innerText = key;
    var valueNode = document.createElement("td");
    valueNode.innerText = key;
    Lux._globals.debugDict[key] = valueNode;
    row.appendChild(keyNode);
    row.appendChild(valueNode);
    Lux._globals.debugTable.appendChild(row);
  }
};

/* Local Variables:  */
/* mode: js2         */
/* js2-basic-offset: 2 */
/* End:              */
