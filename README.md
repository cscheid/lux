# Facet: an EDSL for WebGL Graphics

**Facet** is a Javascript library which provides a set of primitives
to make WebGL programming easier and cleaner.

### Using Facet

The current state of Facet's documentation is poor. Some demos are
available on the demos/ directory. Because of AJAX restrictions, you
will probably want to run a local webserver instead of accessing the
files through the file:// interface. That is, chdir to the local Facet
repository and run

    python -m SimpleHTTPServer 8888

Then simply point your browser at <http://localhost:8888/demos>.

### Development Setup

You'll need node.js (and npm) to build Facet. After you have installed
those, chdir to your facet directory and type

    npm install

You should be able to use Facet's makefile after this to build
facet.js and facet.min.js.
