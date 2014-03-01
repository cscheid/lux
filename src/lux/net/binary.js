/*
 * Lux.Net.binary issues binary AJAX requests, which can be
 * used to load data into Lux more efficiently than through the
 * regular text or JSON AJAX interfaces. It returns ArrayBuffer objects.
 * 
 * It takes as parameters
 * 
 *  url (string or list of strings): urls to fetch
 * 
 *  handler (function(ArrayBuffer or dictionary of (url: ArrayBuffer))): a callback
 *  which gets invoked when all requests finish. If a single URL was passed,
 *  the callback is called with the single buffer returned. If a list of URLs
 *  were passed, then an object is returned, mapping the URLs as passed to
 *  the buffers.
 *  
 * FIXME Lux.Net.binary has no error handling.
 */

// based on http://calumnymmo.wordpress.com/2010/12/22/so-i-decided-to-wait/
// Update 2013-04-24; Firefox now seems to behave in the same way as Chrome.

Lux.Net.binary = function(url, handler)
{
    var current_context = Lux._globals.ctx;

    if (Lux.type_of(url) === "array")
        return handle_many(url, handler, Lux.Net.binary);

    var xhr = new window.XMLHttpRequest();
    var ready = false;
    xhr.onreadystatechange = function() {
        Lux.set_context(current_context);
        if (xhr.readyState === 4 && xhr.status === 200
            && ready !== true) {
            if (xhr.responseType === "arraybuffer") {
                handler(xhr.response, url);
            } else if (xhr.mozResponseArrayBuffer !== null) {
                handler(xhr.mozResponseArrayBuffer, url);
            } else if (xhr.responseText !== null) {
                var data = String(xhr.responseText);
                var ary = new Array(data.length);
                for (var i = 0; i <data.length; i++) {
                    ary[i] = data.charCodeAt(i) & 0xff;
                }
                var uint8ay = new Uint8Array(ary);
                handler(uint8ay.buffer, url);
            }
            ready = true;
        }
    };
    xhr.open("GET", url, true);
    xhr.responseType="arraybuffer";
    xhr.send();
};
