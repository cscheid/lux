import * as acorn from 'acorn';

function testIt() {
  var comments = [], tokens = [];

  var ast = acorn.parse('var x = 42; // answer', {
    // collect ranges for each node
    ranges: true,
    // collect comments in Esprima's format
    onComment: comments,
    // collect token ranges
    onToken: tokens
  });
  return ast;
}

function fancier() {
  function foo(a, b) {
    return a + b;
  }
  return foo;
}

function frustum(left, right, bottom, top, near, far) {
  var rl = right - left;
  var tb = top - bottom;
  var fn = far - near;
  return Lux.matrix(near * 2 / rl, 0, 0, 0,
                    0, near * 2 / tb, 0, 0,
                    (right + left) / rl, (top + bottom) / tb, (far + near) / fn, -1,
                    0, 0, -far * near * 2 * fn, 0);
}

function parseFunction(f) {
  var comments = [], tokens = [];
  var ast = acorn.parse(frustum.toString(), {
    ranges: true,
    onComment: comments,
    onToken: tokens
  });
  return ast;
}

function test2() {
  var ast = parseFunction(frustum);
  debugger;
}

exports.testIt = testIt;
exports.fancier = fancier;
exports.acorn = acorn;
exports.test2 = test2;
