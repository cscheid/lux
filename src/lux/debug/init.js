import { Lux } from '../../lux.js';
import _ from 'lodash';

exports.init = function(div)
{
  if (Lux._globals.debugTable)
    return;
  if (_.isUndefined(div)) {
    div = document.createElement('div');
    div.setAttribute('style', 'position:absolute;left:1em;top:1em');
    document.body.appendChild(div);
  }
  var table = document.createElement('div');
  div.appendChild(table);
  Lux._globals.debugTable = table;
  Lux._globals.debugDict = {};
};

/* Local Variables:  */
/* mode: js2         */
/* js2-basic-offset: 2 */
/* End:              */

