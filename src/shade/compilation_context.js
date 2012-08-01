Shade.VERTEX_PROGRAM_COMPILE = 1;
Shade.FRAGMENT_PROGRAM_COMPILE = 2;
Shade.UNSET_PROGRAM_COMPILE = 3;

function new_scope()
{
    return {
        declarations: [],
        initializations: [],
        add_declaration: function(exp) {
            this.declarations.push(exp);
        },
        add_initialization: function(exp) {
            this.initializations.push(exp);
        }
    };
};

Shade.CompilationContext = function(compile_type)
{
    return {
        freshest_glsl_name: 0,
        compile_type: compile_type || Shade.UNSET_PROGRAM_COMPILE,
        float_precision: "highp",
        strings: [],
        declarations: { uniform: {},
                        attribute: {},
                        varying: {}
                      },
        // min_version: -1,
        source: function() {
            return this.strings.join(" ");
        },
        request_fresh_glsl_name: function() {
            var int_name = this.freshest_glsl_name++;
            return "glsl_name_" + int_name;
        },
        // require_version: function(version) {
        //     this.min_version = Math.max(this.min_version, version);
        // },
        declare: function(decltype, glsl_name, type, declmap) {
            if (_.isUndefined(type)) {
                throw "must define type";                
            }
            if (!(glsl_name in declmap)) {
                declmap[glsl_name] = type;
                this.strings.push(decltype + " " + type.declare(glsl_name) + ";\n");
            } else {
                var existing_type = declmap[glsl_name];
                if (!existing_type.equals(type)) {
                    throw ("compile error: different expressions use "
                           + "conflicting types for '" + decltype + " " + glsl_name
                           + "': '" + existing_type.repr() + "', '"
                           + type.repr() + "'");
                }
            }
        },
        declare_uniform: function(glsl_name, type) {
            this.declare("uniform", glsl_name, type, this.declarations.uniform);
        },
        declare_varying: function(glsl_name, type) {
            this.declare("varying", glsl_name, type, this.declarations.varying);
        },
        declare_attribute: function(glsl_name, type) {
            this.declare("attribute", glsl_name, type, this.declarations.attribute);
        },
        compile: function(fun) {
            // for now, add_declaration works differently on global scope. When
            // we finish the inevitable route of creating a real GLSL AST, then this
            // will again change. 
            var that = this;

            this.global_scope = {
                initializations: [],
                add_declaration: function(exp) {
                    that.strings.push(exp, ";\n");
                },
                add_initialization: function(exp) {
                    this.initializations.push(exp);
                }
            };

            var topo_sort = fun.sorted_sub_expressions();
            var i;
            _.each(topo_sort, function(n) {
                n.children_count = 0;
                n.is_unconditional = false;
                n.glsl_name = that.request_fresh_glsl_name();
                n.set_requirements(this);
                for (var j=0; j<n.parents.length; ++j) {
                    n.parents[j].children_count++;
                    // adds base scope to objects which have them.
                    n.scope = n.has_scope ? new_scope() : undefined;
                }
            });

            // top-level node is always unconditional.
            topo_sort[topo_sort.length-1].is_unconditional = true;
            // top-level node has global scope.
            topo_sort[topo_sort.length-1].scope = this.global_scope;
            i = topo_sort.length;
            while (i--) {
                var n = topo_sort[i];
                n.propagate_conditions();
                for (var j=0; j<n.parents.length; ++j) {
                    if (!n.parents[j].scope) {
                        n.parents[j].scope = n.scope;
                    }
                }
            }
            var p = this.strings.push;
            this.strings.push("precision",this.float_precision,"float;\n");
            for (i=0; i<topo_sort.length; ++i) {
                topo_sort[i].compile(this);
            }
            this.strings.push("void main() {\n");
            _.each(this.global_scope.initializations, function(exp) {
                that.strings.push("    ", exp, ";\n");
            });
            this.strings.push("    ", fun.evaluate(), ";\n", "}\n");
            // for (i=0; i<this.initialization_exprs.length; ++i)
            //     this.strings.push("    ", this.initialization_exprs[i], ";\n");
            // this.strings.push("    ", fun.evaluate(), ";\n", "}\n");
        },
        add_initialization: function(expr) {
            this.global_scope.initializations.push(expr);
        },
        value_function: function() {
            this.strings.push(arguments[0].type.repr(),
                              arguments[0].glsl_name,
                              "(void) {\n",
                              "    return ");
            for (var i=1; i<arguments.length; ++i) {
                this.strings.push(arguments[i]);
            }
            this.strings.push(";\n}\n");
        },
        void_function: function() {
            this.strings.push("void",
                              arguments[0].glsl_name,
                              "(void) {\n",
                              "    ");
            for (var i=1; i<arguments.length; ++i) {
                this.strings.push(arguments[i]);
            }
            this.strings.push(";\n}\n");
        }
    };
};
