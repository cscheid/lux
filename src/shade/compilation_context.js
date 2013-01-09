Shade.VERTEX_PROGRAM_COMPILE = 1;
Shade.FRAGMENT_PROGRAM_COMPILE = 2;
Shade.UNSET_PROGRAM_COMPILE = 3;

function new_scope()
{
    return {
        declarations: [],
        initializations: [],
        enclosing_scope: undefined,
        
        // make all declarations 
        // global since names are unique anyway
        add_declaration: function(exp) {
            // this.declarations.push(exp);
            this.enclosing_scope.add_declaration(exp);
        },
        add_initialization: function(exp) {
            this.initializations.push(exp);
        },
        show: function() {
            return "(Scope decls " 
                + String(this.declarations)
                + " inits "
                + String(this.initializations)
                + " enclosing "
                + this.enclosing_scope.show()
                + " )";
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
        global_decls: [],
        declarations: { uniform: {},
                        attribute: {},
                        varying: {}
                      },
        declared_struct_types: {},
        // min_version: -1,
        source: function() {
            return this.strings.join(" ");
        },
        request_fresh_glsl_name: function() {
            var int_name = this.freshest_glsl_name++;
            return "glsl_name_" + int_name;
        },
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
        declare_struct: function(type) {
            var that = this;
            if (!_.isUndefined(this.declared_struct_types[type.internal_type_name]))
                return;
            _.each(type.fields, function(v) {
                if (v.is_struct() && 
                    _.isUndefined(this.declared_struct_types[type.internal_type_name])) {
                    throw "internal error; declare_struct found undeclared internal struct";
                }
            });
            this.global_decls.push("struct", type.internal_type_name, "{\n");
            var internal_decls = [];
            _.each(type.field_index, function(i, k) {
                internal_decls[i] = type.fields[k].declare(k);
            });
            _.each(internal_decls, function(v) {
                that.global_decls.push("    ",v, ";\n");
            });
            this.global_decls.push("};\n");
            this.declared_struct_types[type.internal_type_name] = true;
        },
        compile: function(fun) {
            var that = this;
            this.global_decls = [];

            this.global_scope = {
                initializations: [],
                add_declaration: function(exp) {
                    that.global_decls.push(exp, ";\n");
                },
                add_initialization: function(exp) {
                    this.initializations.push(exp);
                },
                show: function() {
                    return "(Global scope)";
                }
            };

            var topo_sort = fun.sorted_sub_expressions();
            var i;
            var p = this.strings.push;
            _.each(topo_sort, function(n) {
                n.children_count = 0;
                n.is_unconditional = false;
                n.glsl_name = that.request_fresh_glsl_name();
                n.set_requirements(this);
                if (n.type.is_struct()) {
                    that.declare_struct(n.type);
                }
                for (var j=0; j<n.parents.length; ++j) {
                    n.parents[j].children_count++;
                    // adds base scope to objects which have them.
                    // FIXME currently all scope objects point directly to global scope
                    n.scope = n.has_scope ? new_scope() : that.global_scope;
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
                    if (n.parents[j].has_scope)
                        n.parents[j].scope.enclosing_scope = n.scope;
                }
                n.patch_scope();
            }
            for (i=0; i<topo_sort.length; ++i) {
                topo_sort[i].compile(this);
            }

            var args = [0, 0];
            args.push.apply(args, this.global_decls);
            this.strings.splice.apply(this.strings, args);
            this.strings.splice(0, 0, "precision",this.float_precision,"float;\n");
            this.strings.splice(0, 0, "#extension GL_OES_standard_derivatives : enable\n");
            this.strings.push("void main() {\n");
            _.each(this.global_scope.initializations, function(exp) {
                that.strings.push("    ", exp, ";\n");
            });
            this.strings.push("    ", fun.glsl_expression(), ";\n", "}\n");
            // for (i=0; i<this.initialization_exprs.length; ++i)
            //     this.strings.push("    ", this.initialization_exprs[i], ";\n");
            // this.strings.push("    ", fun.glsl_expression(), ";\n", "}\n");
        },
        add_initialization: function(expr) {
            this.global_scope.initializations.push(expr);
        },
        value_function: function() {
            var that = this;
            this.strings.push(arguments[0].type.repr(),
                              arguments[0].glsl_name,
                              "(");
            _.each(arguments[0].loop_variable_dependencies(), function(exp, i) {
                if (i > 0)
                    that.strings.push(',');
                that.strings.push('int', exp.glsl_name);
            });
            this.strings.push(") {\n",
                              "    return ");
            for (var i=1; i<arguments.length; ++i) {
                this.strings.push(arguments[i]);
            }
            this.strings.push(";\n}\n");
        },
        void_function: function() {
            this.strings.push("void",
                              arguments[0].glsl_name,
                              "() {\n",
                              "    ");
            for (var i=1; i<arguments.length; ++i) {
                this.strings.push(arguments[i]);
            }
            this.strings.push(";\n}\n");
        }
    };
};
