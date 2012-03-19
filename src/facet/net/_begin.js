Facet.Net = {};

(function() {

var handle_many = function(url, handler, self_call) {
    var obj = {};
    var done = _.after(url.length, handler);
    function piecemeal_handler(result, internal_url) {
        obj[internal_url] = result;
        done(obj);
    }
    _.each(url, function(internal_url) {
        self_call(internal_url, piecemeal_handler);
    });
};


