Lux.Net = {};

(function() {

var handleMany = function(url, handler, selfCall) {
    var obj = {};
    var done = _.after(url.length, handler);
    function piecemealHandler(result, internalUrl) {
        obj[internalUrl] = result;
        done(obj);
    }
    _.each(url, function(internalUrl) {
        selfCall(internalUrl, piecemealHandler);
    });
};


