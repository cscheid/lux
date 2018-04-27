import * as acorn from 'acorn';
import { LuxError } from './luxError.js';

function program(obj)
{
  debugger;
}

// currently, this expects the appearanceFunction to have a return
// statement which returns an object literal, the keys of which we
// will currently use to determine the need for a canonicalization
// pass
function analyzeAppearanceFunction(appearanceFun)
{
  var comments = [], tokens = [];
  var ast = acorn.parseExpressionAt(appearanceFun.toString(), 0, {
    ranges: true,
    onComment: comments,
    onToken: tokens
  });

  // expectFunction(fun =>
  //                       expectFunctionWithOne

  if (ast.type !== "FunctionExpression")
    throw new LuxError("Expected appearance to be a function, got "
                       + ast.node.type + " instead.");
  if (ast.params.length !== 1)
    throw new LuxError(
      "Expected appearance function to take one parameter, but it "
        + "takes " + ast.params.length + " instead.");

  var body = ast.body.body;
  if (body.length === 0)
    throw new LuxError(
      "Expected appearance function to have at least one expression,"
        + " but has no expressions");

  var lastStatement = body[body.length - 1];

  if (lastStatement.type !== "ReturnStatement")
    throw new LuxError(
      "Expected last statement to be a ReturnStatement, got "
        + lastStatement.type + " instead.");

  var returnExpression = lastStatement.argument;

  if (returnExpression.type !== "ObjectExpression")
    throw new LuxError(
      "Expected expression to be an ObjectExpression, got "
        + lastStatement.type + " instead.");

  var properties = returnExpression.properties;

  var keys = properties.map(node => node.key.name);

  debugger;
  return {
    ast: ast,
    returnExpression: returnExpression,
    returnKeys: keys
  };
}

// function expectFunctionNode() {
//   return function(node) {
//     if (node.type !== "FunctionExpression")
//       throw new LuxError(
//         "Expected expression to be FunctionExpression, got "
//           + node.type + " instead.");
//     return node;
//   };
// }
// function expectFunctionWithParams(n) {
//   return function(node) {
//     if (node.params.length !== 1)
//       throw new LuxError(
//         "Expected appearance function to take one parameter, but it "
//           + "takes " + node.params.length + " instead.");
//   };
// }

// function
exports.program = program;
exports.analyzeAppearanceFunction = analyzeAppearanceFunction;
