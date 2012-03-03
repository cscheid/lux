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

## GLSL Values

We use the following GLSL types and expressions:

* `float`: atomic floating-point value
* `int`: atomic integer value
* `bool`: atomic boolean value
* `vec2`, `vec3`, `vec4`: fixed-size floating point vectors
* `ivec2`, `ivec3`, `ivec4`: fixed-size integer vectors
* `bvec2`, `bvec3`, `bvec4`: fixed-size integer vectors
* `mat2`, `mat3`, `mat4`: fixed-size floating point square matrices

Values of type `vec[234]` and `mat[234]` are denoted as `vec3(a, b,
c)`, `mat2(vec2(a, b), vec2(c, d))`, and so on. If `v` is of type
`vec[234]`, then `v[i]` is of type float, and denotes the i-th
component of the vector. If `m` is of type `mat[234]`, then `m[i]` is
of type `vec[234]`, and denotes the i-th column of the matrix


## Shade Grammar

Because Shade is an embedded language in Javascript, its grammar has
an almost one-to-one correspondence with functions in the `Shade`
object. Most of these have a direct interpretation in terms of GLSL
functions, methods or expressions.

You will note that there is some inconsistency in the case conventions
of the functions below. Generally speaking, GLSL conforms to camelCase
conventions. Shade functions and methods use underscore_conventions,
while Shade object prototypes and classes use CamelCase.

In the list of value constructors below, we use `f(t1, t2, t3)` to
mean that there exists a Shade constructor of the object `f` which
takes three parameters of types `t1`, `t2` and `t3` respectively. To
give a particular semantics for Shade, all we have to do is provide
functions for each of these types.

### abs
* `abs(float)`
* `abs(vecX)`, X in [2, 3, 4]

### acos
* `acos(float)`
* `acos(vecX)`, X in [2, 3, 4]

### add
* `add(float, float)`
* `add(vecX, vecX)`, X in [2, 3, 4]
* `add(matX, matX)`, X in [2, 3, 4]
* `add(vecX, float)`, X in [2, 3, 4]
* `add(matX, float)`, X in [2, 3, 4]
* `add(float, vecX)`, X in [2, 3, 4]
* `add(float, matX)`, X in [2, 3, 4]

### all
* `all(bool)`
* `all(bvecX)`, X in [2, 3, 4]

### and
* `and(bool, bool)`

### any
* `any(bool)`
* `any(bvecX)`, X in [2, 3, 4]

### array
* `array([list of float])
* `array([list of bool])
* `array([list of vecX]), X in [2, 3, 4]
* `array([list of bvecX]), X in [2, 3, 4]
* `array([list of ivecX]), X in [2, 3, 4]
* `array([list of matX]), X in [2, 3, 4]

### asin
* `asin(float)`
* `asin(vecX)`, X in [2, 3, 4]

### atan
* `atan(float, float)`
* `atan(vecX, vecX)`, X in [2, 3, 4]

### attribute

### ceil
* `ceil(float)`
* `ceil(vecX)`, X in [2, 3, 4]

### clamp
* `clamp(float, float, float)`
* `clamp(vecX, vecX, float)`, X in [2, 3, 4]
* `clamp(matX, matX, float)`, X in [2, 3, 4]

### color

### cos
* `cos(float)`
* `cos(matX)`, X in [2, 3, 4]

### cosh
* `cosh(float)`
* `cosh(matX)`, X in [2, 3, 4]

### cross
* `cross(vec3, vec3)`

### degrees
* `degrees(float)`

### discard_if
* `discard_if(ANY, bool)`

### distance
* `distance(float, float)`
* `distance(vecX, vecX)`, X in [2, 3, 4]

### div
* `div(float, float)`
* `div(vecX, vecX)`, X in [2, 3, 4]
* `div(matX, matX)`, X in [2, 3, 4]
* `div(vecX, float)`, X in [2, 3, 4]
* `div(matX, float)`, X in [2, 3, 4]
* `div(float, vecX)`, X in [2, 3, 4]
* `div(float, matX)`, X in [2, 3, 4]

### dot
* `dot(float, float)`
* `dot(vecX, vecX)`, X in [2, 3, 4]

### eq
* `eq(float, float)`
* `eq(int, int)`
* `eq(bool, bool)`
* `eq(vecX, vecX)`, X in [2, 3, 4]
* `eq(bvecX, bvecX)`, X in [2, 3, 4]
* `eq(ivecX, ivecX)`, X in [2, 3, 4]
* `eq(matX, matX)`, X in [2, 3, 4]

### equal
* `equal(vecX, vecX)`
* `equal(bvecX, bvecX)`
* `equal(ivecX, ivecX)`

### exp
* `exp(float, float)`
* `exp(vecX, vecX)`, X in [2, 3, 4]

### exp2
* `exp2(float, float)`
* `exp2(vecX, vecX)`, X in [2, 3, 4]

### faceforward
* `faceforward(float, float, float)`
* `faceforward(vecX, vecX, vecX)`, X in [2, 3, 4]

### floor
* `floor(float, float)`
* `floor(vecX, vecX)`, X in [2, 3, 4]

### fract
* `fract(float, float)`
* `fract(vecX, vecX)`, X in [2, 3, 4]

### fragCoord
* `fragCoord`

### ge
* `ge(float, float)`
* `ge(int, int)`
* `ge(bool, bool)`
* `ge(vecX, vecX)`, X in [2, 3, 4]
* `ge(bvecX, bvecX)`, X in [2, 3, 4]
* `ge(ivecX, ivecX)`, X in [2, 3, 4]
* `ge(matX, matX)`, X in [2, 3, 4]

### greaterThan
* `greaterThan(vecX, vecX)`, X in [2, 3, 4]
* `greaterThan(ivecX, ivecX)`, X in [2, 3, 4]

### greaterThanEqual
* `greaterThanEqual(vecX, vecX)`, X in [2, 3, 4]
* `greaterThanEqual(ivecX, ivecX)`, X in [2, 3, 4]

### gt
* `gt(float, float)`
* `gt(int, int)`
* `gt(bool, bool)`
* `gt(vecX, vecX)`, X in [2, 3, 4]
* `gt(bvecX, bvecX)`, X in [2, 3, 4]
* `gt(ivecX, ivecX)`, X in [2, 3, 4]
* `gt(matX, matX)`, X in [2, 3, 4]

### inversesqrt
* `inversesqrt(float, float)`
* `inversesqrt(vecX, vecX)`, X in [2, 3, 4]

### le
* `le(float, float)`
* `le(int, int)`
* `le(bool, bool)`
* `le(vecX, vecX)`, X in [2, 3, 4]
* `le(bvecX, bvecX)`, X in [2, 3, 4]
* `le(ivecX, ivecX)`, X in [2, 3, 4]
* `le(matX, matX)`, X in [2, 3, 4]

### length
* `length(float)`
* `length(vecX)`, X in [2, 3, 4]

### lessThan
* `lessThan(vecX, vecX)`, X in [2, 3, 4]
* `lessThan(ivecX, ivecX)`, X in [2, 3, 4]

### lessThanEqual
* `lessThanEqual(vecX, vecX)`, X in [2, 3, 4]
* `lessThanEqual(ivecX, ivecX)`, X in [2, 3, 4]

### log
* `log(float)`
* `log(vecX)`, X in [2, 3, 4]

### log2
* `log2(float)`
* `log2(vecX)`, X in [2, 3, 4]

### look_at
* `look_at(vec3, vec3, vec3)`

### lt
* `lt(float, float)`
* `lt(int, int)`
* `lt(bool, bool)`
* `lt(vecX, vecX)`, X in [2, 3, 4]
* `lt(bvecX, bvecX)`, X in [2, 3, 4]
* `lt(ivecX, ivecX)`, X in [2, 3, 4]
* `lt(matX, matX)`, X in [2, 3, 4]

### mat
* `mat(float, float, float, float)`
* `mat(float, ..., float)` (9 parameters for a mat3)
* `mat(float, ..., float)` (16 parameters for a mat4)
* `mat(vec2, vec2)`
* `mat(vec3, vec3, vec3)`
* `mat(vec4, vec4, vec4, vec4)`

### mat3
* `mat3(vec3, vec3, vec3)` FIXME WHY DO WE HAVE THIS?

### matrixCompMult
* `matrixCompMult(matX, matX)`, X in [2, 3, 4]

### max
* `max(int, int)`
* `max(float, float)`
* `max(vecX, vecX)`, X in [2, 3, 4]
* `max(vecX, float)`, X in [2, 3, 4]

### min
* `min(int, int)`
* `min(float, float)`
* `min(vecX, vecX)`, X in [2, 3, 4]
* `min(vecX, float)`, X in [2, 3, 4]

### mix
* `mix(float, float, float)`
* `mix(vecX, vecX, float)`, X in [2, 3, 4]
* `mix(vecX, vecX, vecX)`, X in [2, 3, 4]

### mod
* `mod(int, int)`
* `mod(float, float)`
* `mod(vecX, vecX)`, X in [2, 3, 4]
* `mod(vecX, float)`, X in [2, 3, 4]

### mul
* `mul(float, float)`
* `mul(int, int)`
* `mul(vecX, vecX)`, X in [2, 3, 4]
* `mul(matX, matX)`, X in [2, 3, 4]
* `mul(matX, vecX)`, X in [2, 3, 4]
* `mul(vecX, matX)`, X in [2, 3, 4]

### ne
* `ne(float, float)`
* `ne(int, int)`
* `ne(bool, bool)`
* `ne(vecX, vecX)`, X in [2, 3, 4]
* `ne(bvecX, bvecX)`, X in [2, 3, 4]
* `ne(ivecX, ivecX)`, X in [2, 3, 4]
* `ne(matX, matX)`, X in [2, 3, 4]

### neg

### normalize
* `normalize(float)`
* `normalize(vecX)`, X in [2, 3, 4]

### not
* `not(bool)`

### notEqual
* `notEqual(vecX, vecX)`
* `notEqual(ivecX, ivecX)`
* `notEqual(bvecX, bvecX)`

### or
* `or(bool, bool)`

### per_vertex
* `per_vertex(ANY)`

### pointCoord
* `pointCoord`

### pow
* `pow(float, float)`
* `pow(vecX, vecX)`, X in [2, 3, 4]

### radians
* `radians(float)`

### reflect
* `reflect(float, float, float)`
* `reflect(vecX, vecX, vecX)`, X in [2, 3, 4]

### refract
* `refract(float, float, float)`
* `refract(vecX, vecX, vecX)`, X in [2, 3, 4]

### rotation

### round_dot
### selection
### sign
### sin
### sinh
### smoothstep
### sqrt
### step
### sub
### swizzle
### tan
### texture2D
### translation
### uniform
### vec
### xor

Internal use only:

### seq
### set
### varying

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
its element correspondent are closely related, and are used to model the fact
that we can construct vectors out of scalars, and that we can examine
particular components out of scalars.

Semantic function application will be denoted with square brackets to
avoid confusion with the constructor notation of Shade values, which
uses regular parentheses.

We give here denotational semantics for the value-expression
portion of the Shade language. This is a *purely-functional* subset,
and expressions of this subset are referentially transparent: they
denote the same value regardless of where they appear in the full
program. This lets us write simple optimizers and analyzers for
this portion of the Shade language. When embedded in a high-level
language such as Javascript, this purely functional subsect is already
sufficient enough to create a rich EDSL.

Even within this restricted subset of GLSL, the actual value denoted
by some Shade expressions cannot be determined entirely statically:
they will depend on the WebGL state machine (for example, the values
of uniform parameters and the results of texture fetches). In that
case, we will use a special value `Unknown` to denote the result. We
assume that the target algebras have been enriched such that, *unless
otherwise specified*, any operation involving `Unknown` returns
`Unknown`. In that way, `Unknown` values are propagated through the
semantics. For cases whose values are only left undefined in the GLSL
spec, we will also use the `Unknown` value.

Values in the Shade language are typeset `in monospace`. Values in the
target set are typeset normally. Some functions on the target set are
left implicitly define (such as sines, cosines, etc).

### Constant semantics

`Const[expression]: S -> {true,false}`


### Value semantics

`Val[expression]: S -> GLSL_value`

* abs
** Val[`abs(float(x))`] = |x|
** Val[`abs(vec2(x, y))`] = vec2(Val[`abs(x)`], Val[`abs(y)`])
** Val[`abs(vec3(x, y, z))`] = vec3(Val[`abs(x)`], Val[`abs(y)`], Val[`abs(z)`])`
** Val[`abs(vec4(x, y, z, w))`] = vec4(Val[`abs(x)`], Val[`abs(y)`], Val[`abs(z)`])

* acos
** Val[`acos(float(x))`] = acos(x)
** Val[`acos(vec2(x, y))`] = vec2(Val[`acos(x)`], Val[`acos(y)`])
** Val[`acos(vec3(x, y, z))`] = vec3(Val[`acos(x)`], Val[`acos(y)`], Val[`acos(z)`])`
** Val[`acos(vec4(x, y, z, w))`] = vec4(Val[`acos(x)`], Val[`acos(y)`], Val[`acos(z)`])

* add
** Val[`add(float(x), float(y))`] = x + y
** Val[`add(vec2(x1, y1), vec2(x2, y2)`] = vec2(Val[`add(x1, x2)`], Val[`add(y1, y2)`])
** Val[`add(vec3(x1, y1, z1), vec2(x2, y2, z2)`] = vec2(Val[`add(x1, x2)`], Val[`add(y1, y2)`], Val[`add(z1, z2)`])
** Val[`add(vec4(x1, y1, z1, w1), vec2(x2, y2, z2, w2)`] = vec2(Val[`add(x1, x2)`], Val[`add(y1, y2)`], Val[`add(z1, z2)`], Val[`add(w1, w2)`])

* all
** 
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



### Relationship between semantic functions

The relationship between the value semantics and the constant
semantics is the following:

    (Value[s] == Unknown) -> Const[s] == false

    (EltValue[s, i] == Unknown) -> EltConst[s, i] == false

