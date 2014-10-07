Lux.profile = function(name, seconds, onstart, onend) {
    if (onstart) onstart();
    console.profile(name);
    setTimeout(function() {
        console.profileEnd();
        if (onend) onend();
    }, seconds * 1000);
};
