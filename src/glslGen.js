//////////////////////////////////////////////////////////////////////////////
// astContext

function indentSpace(indent) {
  return " ".repeat(indent);
}

function createAstContext()
{
  return {
    strings: [],
    indent: 0,
    break: function() {
      this.strings.push("\n", indentSpace(this.indent));
    },
    emit: function() {
      _.toArray(arguments).forEach(arg => {
        if (typeof arg === "string") {
          this.strings.push(arg);
        } else {
          arg.astGenerate(this);
        }
      });
    },
    emitList: function(lst, itemFun, sepFun) {
      itemFun = itemFun || (param => param.astGenerate(this));
      sepFun = sepFun || (() => { this.emit(","); });
      lst.forEach((item, i) => {
        itemFun(item);
        if (i < lst.length - 1)
          sepFun(item);
      });
    },
    block: function(f) {
      this.break();

      this.indent += 4;
      this.strings.push("{");
      this.break();
      f();
      this.strings.push("}");
      this.indent -= 4;
      this.break();
    }
  };
}

// some definitions don't like semicolons as separators (sigh)
function wantsSemiColon(node)
{
  return ["function-definition",
          "version-declaration"].indexOf(node.astNodeType) === -1;
}

//////////////////////////////////////////////////////////////////////////////

function functionDefinition(
  returnType, functionName, parameters, statements)
{
  return {
    astNodeType: "function-definition",
    returnType: returnType,
    functionName: functionName,
    parameters: parameters,
    statements: statements,
    astGenerate: function(astCtx) {
      astCtx.emit(returnType, functionName, "(");
      astCtx.emitList(this.parameters);
      astCtx.emit(")");
      astCtx.block(() => {
        statements.forEach(statement => {
          statement.astGenerate(astCtx);
          astCtx.emit(";");
          astCtx.break();
        });
      });
    }
  };
}

function generateGLSL(node)
{
  var ast = createAstContext();
  node.astGenerate(ast);
  return ast.strings.join(" ");
}

function parameterDeclaration(parameterType, parameterName)
{
  return {
    astNodeType: "function-declaration",
    parameterType: parameterType,
    parameterName: parameterName,
    astGenerate: function(astCtx) {
      astCtx.emit(this.parameterType, this.parameterName);
    }
  };
}

function inDeclaration(parameter)
{
  return {
    astNodeType: "parameter-in",
    parameter: parameter,
    astGenerate: function(astCtx) {
      astCtx.emit("in", this.parameter);
    }
  };
}

function outDeclaration(parameter)
{
  return {
    astNodeType: "parameter-out",
    parameter: parameter,
    astGenerate: function(astCtx) {
      astCtx.emit("out", this.parameter);
    }
  };
}

function uniformDeclaration(parameter)
{
  return {
    astNodeType: "parameter-uniform",
    parameter: parameter,
    astGenerate: function(astCtx) {
      astCtx.emit("uniform", this.parameter);
    }
  };
}

function precisionDeclaration(precision, type)
{
  return {
    astNodeType: "precision-declaration",
    precision: precision,
    type: type,
    astGenerate: function(astCtx) {
      astCtx.emit("precision", this.precision, this.type);
    }
  };
}

function returnStatement(expression)
{
  return {
    astNodeType: "return-statement",
    expression: expression,
    astGenerate: function(astCtx) {
      astCtx.emit("return", this.expression);
    }
  };
}

function floatLiteral(val)
{
  return {
    astNodeType: "float-literal",
    value: val,
    astGenerate: function(astCtx) {
      if (this.value === ~~this.value) {
        astCtx.emit(this.value.toFixed(1));
      } else {
        astCtx.emit(this.value);
      }
    }
  };
}

function intLiteral(val)
{
  return {
    astNodeType: "float-literal",
    value: val,
    astGenerate: function(astCtx) {
      astCtx.emit(this.value.toFixed());
    }
  };
}

function variableRef(variableName)
{
  return {
    astNodeType: "variable-reference",
    name: variableName,
    astGenerate: function(astCtx) {
      astCtx.emit(this.name);
    }
  };
}

function functionCall(name, parameters)
{
  return {
    astNodeType: "function-call",
    name: name,
    parameters: parameters,
    astGenerate: function(astCtx) {
      astCtx.emit(this.name, "(");
      astCtx.emitList(this.parameters);
      astCtx.emit(")");
    }
  };
}

function variableDeclaration(type, name, initializer)
{
  return {
    astNodeType: "variable-declaration",
    name: name,
    type: type,
    initializer: initializer,
    astGenerate: function(astCtx) {
      astCtx.emit(this.type, this.name);
      if (!_.isUndefined(this.initializer)) {
        astCtx.emit("=", this.initializer);
      }
    }
  };
}

function assignment(lValue, rValue)
{
  return {
    astNodeType: "assignment-expression",
    lValue: lValue,
    rValue: rValue,
    astGenerate: function(astCtx) {
      astCtx.emit(lValue, "=", rValue);
    }
  };
}

function vertexShader(stmts)
{
  return {
    astNodeType: "vertex-shader",
    statements: stmts,
    astGenerate: function(astCtx) {
      astCtx.emitList(this.statements, undefined,
                      item => {
                        if (wantsSemiColon(item)) {
                          astCtx.emit(";");
                        }
                        astCtx.break();
                      });
    }
  };
}

function fragmentShader(stmts)
{
  return {
    astNodeType: "fragment-shader",
    statements: stmts,
    astGenerate: function(astCtx) {
      astCtx.emitList(this.statements, undefined,
                      item => {
                        if (wantsSemiColon(item)) {
                          astCtx.emit(";");
                        }
                        astCtx.break();
                      });
    }
  };
}

function versionDeclaration(version)
{
  return {
    astNodeType: "version-declaration",
    version: version,
    astGenerate: function(astCtx) {
      astCtx.emit("#version");
      astCtx.emit(this.version + "\n");
    }
  };
}

function basicTest()
{
  debugger;

  function vs1() {
    var f = functionDefinition(
      "vec4", "_luxCompiled_f1",
      [parameterDeclaration("vec4", "v")],
      [returnStatement(variableRef("v"))]);

    var m = functionDefinition(
      "void", "main", [],
      [variableDeclaration("vec4", "vout", functionCall("_luxCompiled_f1",
                                                        [variableRef("attribute1")])),
       assignment("gl_Position", variableRef("vout")),
       assignment("varying1", variableRef("vout"))]);

    return vertexShader([
      versionDeclaration("300 es"),
      inDeclaration(variableDeclaration("vec4", "attribute1")),
      outDeclaration(variableDeclaration("vec4", "varying1")),
      f,
      m
    ]);
  }

  console.log(generateGLSL(vs1()));
}

exports.basicTest = basicTest;

exports.assignment = assignment;
exports.createAstContext = createAstContext;
exports.floatLiteral = floatLiteral;
exports.fragmentShader = fragmentShader;
exports.functionCall = functionCall;
exports.functionDefinition = functionDefinition;
exports.generateGLSL = generateGLSL;
exports.inDeclaration = inDeclaration;
exports.intLiteral = intLiteral;
exports.outDeclaration = outDeclaration;
exports.parameterDeclaration = parameterDeclaration;
exports.precisionDeclaration = precisionDeclaration;
exports.returnStatement = returnStatement;
exports.uniformDeclaration = uniformDeclaration;
exports.variableDeclaration = variableDeclaration;
exports.variableRef = variableRef;
exports.versionDeclaration = versionDeclaration;
exports.vertexShader = vertexShader;
exports.wantsSemiColon = wantsSemiColon;
