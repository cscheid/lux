Shade.uniqueName = function() {
    var counter = 0;
    return function() {
        counter = counter + 1;
        return "_uniqueName" + counter;
    };
}();
