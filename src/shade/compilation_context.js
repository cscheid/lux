Shade.VERTEX_PROGRAM_COMPILE = 1;
Shade.FRAGMENT_PROGRAM_COMPILE = 2;
Shade.UNSET_PROGRAM_COMPILE = 3;

function newScope()
{
    return {
        declarations: [],
        initializations: [],
        enclosingScope: undefined,
        
        // make all declarations 
        // global since names are unique anyway
        addDeclaration: function(exp) {
            // this.declarations.push(exp);
            this.enclosingScope.addDeclaration(exp);
        },
        addInitialization: function(exp) {
            this.initializations.push(exp);
        },
        show: function() {
            return "(Scope decls " 
                + String(this.declarations)
                + " inits "
                + String(this.initializations)
                + " enclosing "
                + this.enclosingScope.show()
                + " )";
        }
    };
};

Shade.CompilationContext = function(compileType)
{
    return {
        freshestGlslName: 0,
        compileType: compileType || Shade.UNSET_PROGRAM_COMPILE,
        floatPrecision: "highp",
        strings: [],
        globalDecls: [],
        declarations: { uniform: {},
                        attribute: {},
                        varying: {}
                      },
        declaredStructTypes: {},
        // minVersion: -1,
        source: function() {
            return this.strings.join(" ");
        },
        requestFreshGlslName: function() {
            var intName = this.freshestGlslName++;
            return "glslName" + intName;
        },
        declare: function(decltype, glslName, type, declmap) {
            if (_.isUndefined(type)) {
                throw new Error("must define type");
            }
            if (!(glslName in declmap)) {
                declmap[glslName] = type;
                this.strings.push(decltype + " " + type.declare(glslName) + ";\n");
            } else {
                var existingType = declmap[glslName];
                if (!existingType.equals(type)) {
                    throw new Error("compile error: different expressions use "
                           + "conflicting types for '" + decltype + " " + glslName
                           + "': '" + existingType.repr() + "', '"
                           + type.repr() + "'");
                }
            }
        },
        declareUniform: function(glslName, type) {
            this.declare("uniform", glslName, type, this.declarations.uniform);
        },
        declareVarying: function(glslName, type) {
            this.declare("varying", glslName, type, this.declarations.varying);
        },
        declareAttribute: function(glslName, type) {
            this.declare("attribute", glslName, type, this.declarations.attribute);
        },
        declareStruct: function(type) {
            var that = this;
            if (!_.isUndefined(this.declaredStructTypes[type.internalTypeName]))
                return;
            _.each(type.fields, function(v) {
                if (v.isStruct() && 
                    _.isUndefined(this.declaredStructTypes[type.internalTypeName])) {
                    throw new Error("internal error; declareStruct found undeclared internal struct");
                }
            });
            this.globalDecls.push("struct", type.internalTypeName, "{\n");
            var internalDecls = [];
            _.each(type.fieldIndex, function(i, k) {
                internalDecls[i] = type.fields[k].declare(k);
            });
            _.each(internalDecls, function(v) {
                that.globalDecls.push("    ",v, ";\n");
            });
            this.globalDecls.push("};\n");
            this.declaredStructTypes[type.internalTypeName] = true;
        },
        compile: function(fun) {
            var that = this;
            this.globalDecls = [];

            this.globalScope = {
                initializations: [],
                addDeclaration: function(exp) {
                    that.globalDecls.push(exp, ";\n");
                },
                addInitialization: function(exp) {
                    this.initializations.push(exp);
                },
                show: function() {
                    return "(Global scope)";
                }
            };

            var topoSort = fun.sortedSubExpressions();
            var i;
            var p = this.strings.push;
            _.each(topoSort, function(n) {
                n.childrenCount = 0;
                n.isUnconditional = false;
                n.glslName = that.requestFreshGlslName();
                n.setRequirements(this);
                if (n.type.isStruct()) {
                    that.declareStruct(n.type);
                }
                for (var j=0; j<n.parents.length; ++j) {
                    n.parents[j].childrenCount++;
                    // adds base scope to objects which have them.
                    // FIXME currently all scope objects point directly to global scope
                    n.scope = n.hasScope ? newScope() : that.globalScope;
                }
            });
            // top-level node is always unconditional.
            topoSort[topoSort.length-1].isUnconditional = true;
            // top-level node has global scope.
            topoSort[topoSort.length-1].scope = this.globalScope;
            i = topoSort.length;
            while (i--) {
                var n = topoSort[i];
                n.propagateConditions();
                for (var j=0; j<n.parents.length; ++j) {
                    if (n.parents[j].hasScope)
                        n.parents[j].scope.enclosingScope = n.scope;
                }
                n.patchScope();
            }
            for (i=0; i<topoSort.length; ++i) {
                topoSort[i].compile(this);
            }

            var args = [0, 0];
            args.push.apply(args, this.globalDecls);
            this.strings.splice.apply(this.strings, args);
            this.strings.splice(0, 0, "precision",this.floatPrecision,"float;\n");
            this.strings.splice(0, 0, "#extension GL_OES_standard_derivatives : enable\n");
            this.strings.push("void main() {\n");
            _.each(this.globalScope.initializations, function(exp) {
                that.strings.push("    ", exp, ";\n");
            });
            this.strings.push("    ", fun.glslExpression(), ";\n", "}\n");
            // for (i=0; i<this.initializationExprs.length; ++i)
            //     this.strings.push("    ", this.initializationExprs[i], ";\n");
            // this.strings.push("    ", fun.glslExpression(), ";\n", "}\n");
        },
        addInitialization: function(expr) {
            this.globalScope.initializations.push(expr);
        },
        valueFunction: function() {
            var that = this;
            this.strings.push(arguments[0].type.repr(),
                              arguments[0].glslName,
                              "(");
            _.each(arguments[0].loopVariableDependencies(), function(exp, i) {
                if (i > 0)
                    that.strings.push(',');
                that.strings.push('int', exp.glslName);
            });
            this.strings.push(") {\n",
                              "    return ");
            for (var i=1; i<arguments.length; ++i) {
                this.strings.push(arguments[i]);
            }
            this.strings.push(";\n}\n");
        },
        voidFunction: function() {
            this.strings.push("void",
                              arguments[0].glslName,
                              "() {\n",
                              "    ");
            for (var i=1; i<arguments.length; ++i) {
                this.strings.push(arguments[i]);
            }
            this.strings.push(";\n}\n");
        }
    };
};
