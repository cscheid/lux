# Developer documentation for the Shade expression language

## Overview

Shade is an expression language embedded in Javascript. It encodes a
subset of the OpenGL ES Shading Language, GLSL ES (From now on, I will
say "GLSL" when I mean "GLSL ES"). The fundamental difference between
full GLSL and Shade is that Shade expressions denote *values*, and are
(for the vast majority) side-effect free.

Because of this, Shade has very simple semantics which allow for
programmatic manipulation of Shade expressions. This enables, for
example, powerful constant folding and expression manipulation, which
are necessary components of a practical high-level which aims to be
efficiently compiled.

Shade does not compile GLSL itself. Instead, every Shade expression
denotes some value in GLSL. The Shade compiler works by transforming
Shade expressions into GLSL programs, but it is free to choose
different GLSL statements, as long as they all denote the same value.

For example, consider the following snippet:

    var a = Shade.uniform("float");
    var b = Shade.vec(a, a.sqrt(), 1.0);
    var c = Shade.sin(b).z();
    
The value denoted by `a` is a scalar whose value cannot be determined
at compile time (it's a [GLSL uniform][glslspec]). `b` denotes a
3-dimensional vector, of which some components depend on the values of
`a`.  Finally, `c` denotes the z-component of the sine of `b`. The
value of `c` *can* be computed at compile-time, but only if we know
the semantics of vector constructors, sine functions, etc. Shade knows
about these, and so can determine that `c` does not depend on `a` at
all. If no other parts of the program depend on `a`, Shade will
completely remove the uniform declaration from the final GLSL shader.
This allows users to write high-level libraries in Shade, without paying
many of the costs of abstraction.

[glslspec]: http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf "GLSL Spec"

## Shade Objects

Every expression in Shade is a javascript object of type `Exp`,
defined in `src/shade/exp.js`. The vast majority of these denote
values, and are of type `ValueExp`, defined in
`src/shade/value_exp.js`.  Every `ValueExp` has a *type*,
corresponding to one of the GLSL types, and can be compiled to a GLSL
expression that when evaluated, denotes the appropriate value (the
semantics will be given below).


## Shade Types


## Shade Program

A Shade program encodes a GLSL vertex shader and a GLSL fragment
shader. 

The Shade compiler will compute the necessary interfaces
automatically. This reduces much of the hassle of writing
maintainable, reusable shader libraries. For example, names of GLSL
`varying`, `uniform` and `attribute` variables must all be consistent,
and determined ahead of time. In addition, there exist restrictions of
which variables can be accessed on which shaders. The Shade compiler
will automatically create shader pairs which respect these
restrictions.

A Shade program is created by a call to `Shade.program`, in
`src/shade/program.js`. `Shade.program` takes as a parameter a
Javascript object with at least two keys: `color` and `position`. The
values associated to the keys denote, respectively, Shade expressions
for the color of the final fragment, and the position of the vertex in
homogeneous coordinates. Other key-value pairs are allowed, and are
ignored by `Shade.program`.




## Shade Grammar

Because Shade is an embedded language in Javascript, its grammar has
an almost one-to-one correspondence with functions in the `Shade`
object. Most of these have a direct interpretation in terms of GLSL
functions, methods or expressions.

You will note that there is some inconsistency in the case conventions
of the functions below. Generally speaking, GLSL conforms to camelCase
conventions. Shade functions and methods use underscore_conventions,
while Shade object prototypes and classes use CamelCase.

Value expressions:

* abs
* acos
* add
* all
* and
* any
* array
* asin
* atan
* attribute
* ceil
* clamp
* color
* cos
* cosh
* cross
* degrees
* discard_if
* distance
* div
* dot
* eq
* equal
* exp
* exp2
* faceforward
* floor
* fract
* fragCoord
* ge
* gl_fog
* gl_light
* greaterThan
* greaterThanEqual
* gt
* id
* inversesqrt
* le
* length
* lessThan
* lessThanEqual
* log
* log2
* look_at
* lt
* mat
* mat3
* matrixCompMult
* max
* min
* mix
* mod
* mul
* ne
* neg
* normalize
* not
* notEqual
* or
* per_vertex
* pointCoord
* pow
* radians
* reflect
* refract
* rotation
* round_dot
* selection
* sign
* sin
* sinh
* smoothstep
* sqrt
* step
* sub
* swizzle
* tan
* texture2D
* translation
* uniform
* vec
* xor

Internal use only:

* seq
* set
* varying

## Shade Semantics

Most of Shade has very simple denotational semantics. Simply put, we
will model the semantics of Shade as functions from the set of
(well-formed) Shade expressions, S, to sets of values which we care
about. (In case the phrase "denotational semantics" scares you: GLSL
does not allow recursive functions, so all the scary math of
lambda-calculus denotational semantics is not needed).  More
concretely, we will define there different semantic functions:
*constant semantics*, *value semantics*, *element constant semantics*
and *element value semantics*. The set corresponding to the range of
the semantics function will be known as the *target* of that
semantics. Our target for the constant semantics will be values in
boolean algebra. For the other remaining semantics, they will be
values in an algebra of scalars, vectors and matrices. A semantics and
its correspondent are closely related, and are used to model the fact
that we can construct vectors out of scalars, and that we can examine
particular components out of scalars.

We give here denotational semantics for the value-expression
portion of the Shade language. This is a *purely-functional* subset,
and expressions of this subset are referentially transparent: they
denote the same value regardless of where they appear in the full
program. This lets us write simple optimizers and analyzers for
this portion of the Shade language. When embedded in a high-level
language such as Javascript, this purely functional subsect is already
sufficient enough to create a rich EDSL.

Even within this restricted subset of GLSL, the actual denote by some
Shade expressions cannot be determined entirely statically: they will
depend on the WebGL state machine (for example, the values of uniform
parameters and the results of texture fetches). In that case, we will
use a special value `Unknown` to denote the result. We assume that the
target algebras have been enriched such that, *unless otherwise
specified*, any operation involving `Unknown` returns `Unknown`. In
that way, `Unknown` values are propagated through the semantics.

Notice that 



### Constant semantics

The constant semantic function, `Const[expression]: S -> {true,false}` 
is defined such that when `Const[e] == true`, the expression `e`
expressions in Shade have values that can be shown to be independent
of the surrounding WebGL state, and , computed explicitly.

### Value semantics

The value semantic function, `Val[expression]: S -> GLSL_value` is
defined
