function build_navigation()
{
    // yeah, yeah, I know, this is horrible.
    var which = window.location.href.match(/.*lesson([0-9]+).html/)[1];
    var nlessons = 6;
    document.write('<div style="float: right">View the <a href="lesson' + which + '.js">full source</a>.</div><div style="float: left">Jump to lesson:');
    for (var i=1; i<=nlessons; ++i) {
        if (i !== Number(which)) {
            document.write(' <a href="lesson' + i + '.html">' + i + '</a>');
        } else
            document.write(' ' + i);
    }
    document.write('</div><div style="clear: both"></div><hr>');
}
