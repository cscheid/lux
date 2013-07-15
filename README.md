# Lux: the DSL for WebGL Graphics

**Lux** provides a set of primitives that make WebGL programming
easier and cleaner.

(**Lux** used to be called Facet)

### Using Lux

Lux is under heavy development, so the current state of 
documentation is less than ideal. Still, I make a serious
effort to keep all the Lux demos working, and you can see them live
[here](http://cscheid.github.com/lux/demos).

If you cloned the Lux repo, you can find the demos in the `demos/`
directory. Because of AJAX security restrictions, you will probably want to run
a local webserver instead of accessing the files through the file://
scheme (files in the file:/// scheme are considered all as being
different domains, to prevent malicious scripts from trolling your
hard drive). The easiest way to do this if you run any modern Unix is to
chdir to the local Lux repository and run

    python -m SimpleHTTPServer 8888

Then simply point your browser at <http://localhost:8888/demos>.

### Development Setup

If you want to fix a bug on Lux or extend it somehow, you'll need
[node.js](http://nodejs.org) and [npm](http://npmjs.org). They're used
to build Lux. On Ubuntu 11.04 and later, you can say

    sudo apt-get install nodejs

to get node.js, but as far as I'm aware you're on your own to install
[npm](http://npmjs.org/). On OS X, I like [homebrew](http://mxcl.github.com/homebrew):

    brew install node
    brew install npm

After you have installed node and npm, chdir to the base lux directory and type

    npm install

You should now be able to use Lux's makefile to build lux.js,
lux.min.js, and data.js.

### Acknowledgments

The build infrastructure of Lux is completely based on Mike
Bostock's excellent [d3](http://github.com/mbostock/d3).
