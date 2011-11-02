# Facet: the EDSL for WebGL Graphics

**Facet** provides a set of primitives that make WebGL programming
  easier and cleaner.

### Using Facet

Facet is under heavy development, so the current state of 
documentation is, ahem, less than ideal. Still, I make a serious
effort to keep all the Facet demos working, and you can see them live
[here](http://cscheid.github.com/facet/demos).

If you cloned the Facet repo, you can find the demos in the `demos/`
directory. Because of AJAX restrictions, you will probably want to run
a local webserver instead of accessing the files through the file://
scheme. The easiest way to do this if you run any modern Unix is to
chdir to the local Facet repository and run

    python -m SimpleHTTPServer 8888

Then simply point your browser at <http://localhost:8888/demos>.

### Development Setup

If you want to fix a bug on Facet or extend it somehow, you'll need
[node.js](http://nodejs.org) and [npm](http://npmjs.org). They're used
to build Facet. On Ubuntu 11.04 and later, you can say

    sudo apt-get install nodejs

to get node.js, but as far as I'm aware you're on your own to install
npm. On OS X, I like [homebrew](http://mxcl.github.com/homebrew):

    brew install node
    brew install npm

After you have installed node and npm, chdir to the base facet directory and type

    npm install

You should now be able to use Facet's makefile to build facet.js,
facet.min.js, and data.js.

### Acknowledgments

The build infrastructure of Facet is completely based on Mike
Bostock's excellent [d3](http://github.com/mbostock/d3).
