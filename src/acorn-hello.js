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

exports.testIt = testIt;
exports.fancier = fancier;
exports.acorn = acorn;
