/*
 * Lux.Net.ajax issues AJAX requests.
 * 
 * It takes as parameters
 * 
 *  url (string or list of strings): urls to fetch
 * 
 *  handler (function(buffer or dictionary of (url: buffer))): a callback
 *  which gets invoked when all requests finish. If a single URL was passed,
 *  the callback is called with the single response eturned. If a list of URLs
 *  were passed, then an object is returned, mapping the URLs as passed to
 *  the responses.
 *  
 * FIXME Lux.Net.ajax has no error handling.
 */

Lux.Net.ajax = function(url, handler)
{
    var current_context = Lux._globals.ctx;

    if (Lux.type_of(url) === "array")
        return handle_many(url, handler, Lux.Net.ajax);

    var xhr = new XMLHttpRequest;

    xhr.open("GET", url, true);

    var ready = false;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200 && !ready) {
            Lux.set_context(current_context);
            handler(xhr.response, url);
            ready = true;
        }
    };
    xhr.send(null);
    return undefined;
};
