// based on http://calumnymmo.wordpress.com/2010/12/22/so-i-decided-to-wait/
Facet.Net.buffer_ajax = function(url, handler)
{
    var xhr = new window.XMLHttpRequest();
    var ready = false;
    xhr.onreadystatechange = function() {
	if (xhr.readyState == 4 && xhr.status == 200
	    && ready!=true) {
	    if (xhr.responseType=="arraybuffer") {
                handler(xhr.response, url);
            } else if (xhr.mozResponseArrayBuffer != null) {
                handler(xhr.mozResponseArrayBuffer, url);
            } else if (xhr.responseText != null) {
	        var data = new String(xhr.responseText);
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
    if(xhr.hasOwnProperty("responseType")) {
        xhr.responseType="arraybuffer";
    } else {
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
    }
    xhr.send();
};
