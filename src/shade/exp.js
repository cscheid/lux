Shade.Exp = {
    glslExpression: function() {
        return this.glslName + "()";
    },
    parentIsUnconditional: function(i) {
        return true;
    },
    propagateConditions: function() {
        // the condition for an execution of a node is the
        // disjunction of the conjunction of all its children and their respective
        // edge conditions
        for (var i=0; i<this.parents.length; ++i)
            this.parents[i].isUnconditional = (
                this.parents[i].isUnconditional ||
                    (this.isUnconditional && 
                     this.parentIsUnconditional(i)));

    },
    setRequirements: function() {},

    // returns all sub-expressions in topologically-sorted order
    sortedSubExpressions: Shade.memoizeOnField("_sortedSubExpressions", function() {
        var soFar = [];
        var visitedGuids = [];
        var topologicalSortInternal = function(exp) {
            var guid = exp.guid;
            if (visitedGuids[guid]) {
                return;
            }
            var parents = exp.parents;
            var i = parents.length;
            while (i--) {
                topologicalSortInternal(parents[i]);
            }
            soFar.push(exp);
            visitedGuids[guid] = true;
        };
        topologicalSortInternal(this);
        return soFar;
    }),

    //////////////////////////////////////////////////////////////////////////
    // javascript-side evaluation of Shade expressions

    evaluate: function() {
        throw new Error("internal error: evaluate undefined for " + this.expressionType);
    },
    isConstant: function() {
        return false;
    },
    constantValue: Shade.memoizeOnField("_constantValue", function() {
        if (!this.isConstant())
            throw new Error("constantValue called on non-constant expression");
        return this.evaluate();
    }),
    elementIsConstant: function(i) {
        return false;
    },
    elementConstantValue: function(i) {
        throw new Error("invalid call: no constant elements");
    },

    //////////////////////////////////////////////////////////////////////////
    // element access for compound expressions

    element: function(i) {
        // FIXME. Why doesn't this check for isPod and use this.at()?
        throw new Error("invalid call: atomic expression");
    },

    //////////////////////////////////////////////////////////////////////////
    // some sugar

    add: function(op) {
        return Shade.add(this, op);
    },
    mul: function(op) {
        return Shade.mul(this, op);
    },
    div: function(op) {
        return Shade.div(this, op);
    },
    mod: function(op) {
        return Shade.mod(this, op);
    },
    sub: function(op) {
        return Shade.sub(this, op);
    },
    norm: function() {
        return Shade.norm(this);
    },
    distance: function(other) {
        return Shade.distance(this, other);
    },
    dot: function(other) {
        return Shade.dot(this, other);
    },
    cross: function(other) {
        return Shade.cross(this, other);
    },
    normalize: function() {
        return Shade.normalize(this);
    },
    reflect: function(other) {
        return Shade.reflect(this, other);
    },
    refract: function(o1, o2) {
        return Shade.refract(this, o1, o2);
    },
    texture2D: function(coords) {
        return Shade.texture2D(this, coords);
    },
    clamp: function(mn, mx) {
        return Shade.clamp(this, mn, mx);
    },
    min: function(other) {
        return Shade.min(this, other);
    },
    max: function(other) {
        return Shade.max(this, other);
    },

    perVertex: function() {
        return Shade.perVertex(this);
    },
    discardIf: function(condition) {
        return Shade.discardIf(this, condition);
    },

    // overload this to overload exp(foo)
    callOperator: function() {
        if (this.type.isStruct()) {
            return this.field(arguments[0]);
        }
        if (this.type.isFunction()) {
            return this.evaluate().apply(this, arguments);
        }
        return this.mul.apply(this, arguments);
    },

    // all sugar for funcs1op is defined later on in the source

    //////////////////////////////////////////////////////////////////////////

    asInt: function() {
        if (this.type.equals(Shade.Types.intT))
            return this;
        var parent = this;
        return Shade._createConcreteValueExp({
            parents: [parent],
            type: Shade.Types.intT,
            value: function() { return "int(" + this.parents[0].glslExpression() + ")"; },
            isConstant: function() { return this.parents[0].isConstant(); },
            evaluate: Shade.memoizeOnGuidDict(function(cache) {
                var v = this.parents[0].evaluate(cache);
                return Math.floor(v);
            }),
            expressionType: "cast(int)"
        });
    },
    asBool: function() {
        if (this.type.equals(Shade.Types.boolT))
            return this;
        var parent = this;
        return Shade._createConcreteValueExp({
            parents: [parent],
            type: Shade.Types.boolT,
            value: function() { return "bool(" + this.parents[0].glslExpression() + ")"; },
            isConstant: function() { return this.parents[0].isConstant(); },
            evaluate: Shade.memoizeOnGuidDict(function(cache) {
                var v = this.parents[0].evaluate(cache);
                return ~~v;
            }),
            expressionType: "cast(bool)"
        });
    },
    asFloat: function() {
        if (this.type.equals(Shade.Types.floatT))
            return this;
        var parent = this;
        return Shade._createConcreteValueExp({
            parents: [parent],
            type: Shade.Types.floatT,
            value: function() { return "float(" + this.parents[0].glslExpression() + ")"; },
            isConstant: function() { return this.parents[0].isConstant(); },
            evaluate: Shade.memoizeOnGuidDict(function(cache) {
                var v = this.parents[0].evaluate(cache);
                return Number(v);
            }),
            expressionType: "cast(float)"
        });
    },
    swizzle: function(pattern) {
        function swizzlePatternToIndices(pattern) {
            function toIndex(v) {
                switch (v.toLowerCase()) {
                case 'r': return 0;
                case 'g': return 1;
                case 'b': return 2;
                case 'a': return 3;
                case 'x': return 0;
                case 'y': return 1;
                case 'z': return 2;
                case 'w': return 3;
                case 's': return 0;
                case 't': return 1;
                case 'p': return 2;
                case 'q': return 3;
                default: throw new Error("invalid swizzle pattern");
                }
            }
            var result = [];
            for (var i=0; i<pattern.length; ++i) {
                result.push(toIndex(pattern[i]));
            }
            return result;
        }
        
        var parent = this;
        var indices = swizzlePatternToIndices(pattern);
        return Shade._createConcreteExp( {
            parents: [parent],
            type: parent.type.swizzle(pattern),
            expressionType: "swizzle{" + pattern + "}",
            glslExpression: function() {
                if (this._mustBeFunctionCall)
                    return this.glslName + "()";
                else
                    return this.parents[0].glslExpression() + "." + pattern; 
            },
            isConstant: Shade.memoizeOnField("_isConstant", function () {
                var that = this;
                return _.all(indices, function(i) {
                    return that.parents[0].elementIsConstant(i);
                });
            }),
            constantValue: Shade.memoizeOnField("_constantValue", function() {
                var that = this;
                var ar = _.map(indices, function(i) {
                    return that.parents[0].elementConstantValue(i);
                });
                if (ar.length === 1)
                    return ar[0];
                var d = this.type.vecDimension();
                var ctor = vec[d];
                if (_.isUndefined(ctor))
                    throw new Error("bad vec dimension " + d);
                return ctor.make(ar);
            }),
            evaluate: Shade.memoizeOnGuidDict(function(cache) {
                if (this.isConstant())
                    return this.constantValue();
                if (this.type.isPod()) {
                    return this.parents[0].element(indices[0]).evaluate(cache);
                } else {
                    var that = this;
                    var ar = _.map(indices, function(index) {
                        return that.parents[0].element(index).evaluate(cache);
                    });
                    var d = this.type.vecDimension();
                    var ctor = vec[d];
                    if (_.isUndefined(ctor))
                        throw new Error("bad vec dimension " + d);
                    return ctor.make(ar);
                }
            }),
            element: function(i) {
                return this.parents[0].element(indices[i]);
            },
            elementIsConstant: Shade.memoizeOnField("_elementIsConstant", function(i) {
                return this.parents[0].elementIsConstant(indices[i]);
            }),
            elementConstantValue: Shade.memoizeOnField("_elementConstantValue", function(i) {
                return this.parents[0].elementConstantValue(indices[i]);
            }),
            compile: function(ctx) {
                if (this._mustBeFunctionCall) {
                    this.precomputedValueGlslName = ctx.requestFreshGlslName();
                    ctx.strings.push(this.type.declare(this.precomputedValueGlslName), ";\n");
                    ctx.addInitialization(this.precomputedValueGlslName + " = " + 
                                           this.parents[0].glslExpression() + "." + pattern);
                    ctx.valueFunction(this, this.precomputedValueGlslName);
                }
            }
        });
    },
    at: function(index) {
        var parent = this;
        index = Shade.make(index);
        // this "works around" current constant index restrictions in webgl
        // look for it to get broken in the future as this hole is plugged.
        index._mustBeFunctionCall = true;
        if (!index.type.equals(Shade.Types.floatT) &&
            !index.type.equals(Shade.Types.intT)) {
            throw new Error("at expects int or float, got '" + 
                            index.type.repr() + "' instead");
        }
        return Shade._createConcreteExp( {
            parents: [parent, index],
            type: parent.type.arrayBase(),
            expressionType: "index",
            glslExpression: function() {
                if (this.parents[1].type.isIntegral()) {
                    return this.parents[0].glslExpression() + 
                        "[" + this.parents[1].glslExpression() + "]"; 
                } else {
                    return this.parents[0].glslExpression() + 
                        "[int(" + this.parents[1].glslExpression() + ")]"; 
                }
            },
            isConstant: function() {
                if (!this.parents[1].isConstant())
                    return false;
                var ix = Math.floor(this.parents[1].constantValue());
                return (this.parents[1].isConstant() &&
                        this.parents[0].elementIsConstant(ix));
            },
            evaluate: Shade.memoizeOnGuidDict(function(cache) {
                var ix = Math.floor(this.parents[1].evaluate(cache));
                var parentValue = this.parents[0].evaluate();
                return parentValue[ix];
                // return this.parents[0].element(ix).evaluate(cache);
            }),

            element: Shade.memoizeOnField("_element", function(i) {
                // FIXME I suspect that a bug here might still arise
                // out of some interaction between the two conditions
                // described below. The right fix will require rewriting the whole
                // constant-folding system :) so it will be a while.

                var array = this.parents[0], 
                    index = this.parents[1];

                if (!index.isConstant()) {
                    // If index is not constant, then we use the following equation:
                    // element(Array(a1 .. aN).at(ix), i) ==
                    // Array(element(a1, i) .. element(aN, i)).at(ix)
                    var elts = _.map(array.parents, function(parent) {
                        return parent.element(i);
                    });
                    return Shade.array(elts).at(index);
                }
                var indexValue = this.parents[1].constantValue();
                var x = this.parents[0].element(indexValue);

                // the reason for the (if x === this) checks here is that sometimes
                // the only appropriate description of an element() of an
                // opaque object (uniforms and attributes, notably) is an at() call.
                // This means that (this.parents[0].element(ix) === this) is
                // sometimes true, and we're stuck in an infinite loop.
                if (x === this) {
                    return x.at(i);
                } else
                    return x.element(i);
            }),
            elementIsConstant: Shade.memoizeOnField("_elementIsConstant", function(i) {
                if (!this.parents[1].isConstant()) {
                    return false;
                }
                var ix = this.parents[1].constantValue();
                var x = this.parents[0].element(ix);
                if (x === this) {
                    return false;
                } else
                    return x.elementIsConstant(i);
            }),
            elementConstantValue: Shade.memoizeOnField("_elementConstantValue", function(i) {
                var ix = this.parents[1].constantValue();
                var x = this.parents[0].element(ix);
                if (x === this) {
                    throw new Error("internal error: would have gone into an infinite loop here.");
                }
                return x.elementConstantValue(i);
            }),
            compile: function() {}
        });
    },
    field: function(fieldName) {
        if (!this.type.isStruct()) {
            throw new Error("field() only valid on struct types");
        }
        var index = this.type.fieldIndex[fieldName];
        if (_.isUndefined(index)) {
            throw new Error("field " + fieldName + " not existent");
        }

        return Shade._createConcreteValueExp({
            parents: [this],
            type: this.type.fields[fieldName],
            expressionType: "struct-accessor{" + fieldName + "}",
            value: function() {
                return "(" + this.parents[0].glslExpression() + "." + fieldName + ")";
            },
            evaluate: Shade.memoizeOnGuidDict(function(cache) {
                var structValue = this.parents[0].evaluate(cache);
                return structValue[fieldName];
            }),
            isConstant: Shade.memoizeOnField("_isConstant", function() {
                // this is conservative for many situations, but hey.
                return this.parents[0].isConstant();
            }),
            element: function(i) {
                return this.at(i);
            }
        });
    },
    _luxExpression: true, // used by Lux.typeOf
    expressionType: "other",
    _uniforms: [],

    //////////////////////////////////////////////////////////////////////////

    attributeBuffers: function() {
        return _.flatten(this.sortedSubExpressions().map(function(v) { 
            return v.expressionType === 'attribute' ? [v] : [];
        }));
    },
    uniforms: function() {
        return _.flatten(this.sortedSubExpressions().map(function(v) { 
            return v._uniforms; 
        }));
    },

    //////////////////////////////////////////////////////////////////////////
    // simple re-writing of shaders, useful for moving expressions
    // around, such as the things we move around when attributes are 
    // referenced in fragment programs
    // 
    // NB: it's easy to create bad expressions with these.
    //
    // The general rule is that types should be preserved (although
    // that might not *always* be the case)
    findIf: function(check) {
        return _.select(this.sortedSubExpressions(), check);
    },

    replaceIf: function(check, replacement) {
        // this code is not particularly clear, but this is a compiler
        // hot-path, bear with me.
        var subexprs = this.sortedSubExpressions();
        var replacedPairs = {};
        function parentReplacement(x) {
            if (!(x.guid in replacedPairs)) {
                return x;
            } else
                return replacedPairs[x.guid];
        }
        var latestReplacement, replaced;
        for (var i=0; i<subexprs.length; ++i) {
            var exp = subexprs[i];
            if (check(exp)) {
                latestReplacement = replacement(exp);
                replacedPairs[exp.guid] = latestReplacement;
            } else {
                replaced = false;
                for (var j=0; j<exp.parents.length; ++j) {
                    if (exp.parents[j].guid in replacedPairs) {
                        latestReplacement = Shade._create(exp, {
                            parents: _.map(exp.parents, parentReplacement)
                        });
                        replacedPairs[exp.guid] = latestReplacement;
                        replaced = true;
                        break;
                    }
                }
                if (!replaced) {
                    latestReplacement = exp;
                }
            }
        }
        return latestReplacement;
    },

    //////////////////////////////////////////////////////////////////////////
    // debugging infrastructure

    json: function() {
        function helperF(node, parents, refs) { return node._jsonHelper(parents, refs); };
        var refs = Shade.Debug.walk(this, helperF, helperF);
        return refs[this.guid];
    },
    _jsonHelper: Shade.Debug._jsonBuilder(),    
    _jsonKey: function() { return this.expressionType; },
    
    debugPrint: function(doWhat) {
        var lst = [];
        var refs = {};
        function _debugPrint(which, indent) {
            var i;
            var str = new Array(indent+2).join(" "); // This is python's '" " * indent'
            // var str = "";
            // for (var i=0; i<indent; ++i) { str = str + ' '; }
            if (which.parents.length === 0) 
                lst.push(str + "[" + which.expressionType + ":" + which.guid + "]"
                            // + "[isConstant: " + which.isConstant() + "]"
                            + " ()");
            else {
                lst.push(str + "[" + which.expressionType + ":" + which.guid + "]"
                            // + "[isConstant: " + which.isConstant() + "]"
                            + " (");
                for (i=0; i<which.parents.length; ++i) {
                    if (refs[which.parents[i].guid])
                        lst.push(str + "  {{" + which.parents[i].guid + "}}");
                    else {
                        _debugPrint(which.parents[i], indent + 2);
                        refs[which.parents[i].guid] = 1;
                    }
                }
                lst.push(str + ')');
            }
        };
        _debugPrint(this, 0);
        doWhat = doWhat || function(l) {
            return l.join("\n");
        };
        return doWhat(lst);
    },

    locate: function(predicate) {
        var subExprs = this.sortedSubExpressions();
        for (var i=0; i<subExprs.length; ++i) {
            if (predicate(subExprs[i]))
                return subExprs[i];
        }
        return undefined;
    },

    //////////////////////////////////////////////////////////////////////////
    // fields
    
    // if stage is "vertex" then this expression will be hoisted to the vertex shader
    stage: null,

    // if hasScope is true, then the expression has its own scope
    // (like for-loops)
    hasScope: false,
    patchScope: function () {},
    loopVariableDependencies: Shade.memoizeOnField("_loopVariableDependencies", function () {
        var parentDeps = _.map(this.parents, function(v) {
            return v.loopVariableDependencies();
        });
        if (parentDeps.length === 0)
            return [];
        else {
            var resultWithDuplicates = parentDeps[0].concat.apply(parentDeps[0], parentDeps.slice(1));
            var guids = [];
            var result = [];
            _.each(resultWithDuplicates, function(n) {
                if (!guids[n.guid]) {
                    guids[n.guid] = true;
                    result.push(n);
                }
            });
            return result;
        }
    })
};

_.each(["r", "g", "b", "a",
        "x", "y", "z", "w",
        "s", "t", "p", "q"], function(v) {
            Shade.Exp[v] = function() {
                return this.swizzle(v);
            };
        });

Shade._createConcreteExp = Shade._createConcrete(Shade.Exp, ["parents", "compile", "type"]);
