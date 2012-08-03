# Facet's build system is entirely based on Mike Bostock's excellent
# d3 library.

JS_COMPILER = ./node_modules/uglify-js/bin/uglifyjs

all: facet.js facet.min.js data.js brewcolor.js

brewcolor.js:					\
	src/brewcolor/_begin.js			\
	src/brewcolor/color_data.js		\
	src/brewcolor/color_src.js

data.js:					\
	src/data/_begin.js			\
	src/data/iris.js			\
	src/data/cars.js

facet.js:					\
	src/copyright-notice.js			\
	src/facet/_begin.js			\
	src/facet/_globals.js			\
	lib/underscore-min.js			\
	lib/webgl-debug.js			\
	lib/webgl-utils.js			\
	src/underscore_mixins.js		\
	src/linalg/_begin.js			\
	src/linalg/vec2.js			\
	src/linalg/vec3.js			\
	src/linalg/vec4.js			\
	src/linalg/mat2.js			\
	src/linalg/mat3.js			\
	src/linalg/mat4.js			\
	src/linalg/vec.js			\
	src/linalg/mat.js			\
	src/linalg/_end.js			\
	src/typeinfo.js				\
	src/facet/attribute_buffer.js		\
	src/facet/bake.js			\
	src/facet/draw.js			\
	src/facet/element_buffer.js		\
	src/facet/fresh_pick_id.js		\
	src/facet/id_buffer.js			\
	src/facet/init.js			\
	src/facet/load_image_into_texture.js	\
	src/facet/matrix.js			\
	src/facet/model.js			\
	src/facet/picker.js			\
	src/facet/profile.js			\
	src/facet/program.js			\
	src/facet/render_buffer.js		\
	src/facet/set_context.js		\
	src/facet/on_context.js			\
	src/facet/texture.js			\
	src/facet/unprojector.js		\
	src/facet/net/_begin.js			\
	src/facet/net/ajax.js			\
	src/facet/net/json.js			\
	src/facet/net/binary.js			\
	src/facet/net/_end.js			\
	src/facet/scale/_begin.js		\
	src/facet/scale/geo/_begin.js		\
	src/facet/scale/geo/mercator_to_spherical.js	\
	src/facet/scale/geo/latlong_to_spherical.js	\
	src/facet/drawing_mode/_begin.js	\
	src/facet/drawing_mode/additive.js	\
	src/facet/drawing_mode/over.js		\
	src/facet/drawing_mode/standard.js	\
	src/facet/drawing_mode/pass.js		\
	src/facet/data/_begin.js		\
	src/facet/data/table.js			\
	src/facet/data/texture_table.js		\
	src/facet/data/texture_array.js		\
	src/facet/data/array_1d.js		\
	src/facet/ui/_begin.js			\
	src/facet/ui/parameter_slider.js	\
	src/facet/ui/center_zoom_interactor.js	\
	src/shade/_begin.js			\
	src/shade/make.js			\
	src/shade/memoize_on_field.js		\
	src/shade/unknown.js			\
	src/shade/camera/_begin.js		\
	src/shade/camera/perspective.js		\
	src/shade/camera/ortho.js		\
	src/shade/color.js			\
	src/shade/looping.js			\
	src/shade/unique_name.js		\
	src/shade/create.js			\
	src/shade/types/_begin.js		\
	src/shade/types/base_t.js		\
	src/shade/types/basic.js		\
	src/shade/types/array.js		\
	src/shade/types/function_t.js		\
	src/shade/types/simple_types.js		\
	src/shade/compilation_context.js	\
	src/shade/exp.js			\
	src/shade/value_exp.js			\
	src/shade/swizzle.js			\
	src/shade/constant.js			\
	src/shade/array.js			\
	src/shade/set.js			\
	src/shade/parameter.js			\
	src/shade/sampler2D_from_texture.js	\
	src/shade/attribute.js			\
	src/shade/varying.js			\
	src/shade/fragCoord.js			\
	src/shade/pointCoord.js			\
	src/shade/round_dot.js			\
	src/shade/operators.js			\
	src/shade/neg.js			\
	src/shade/vec.js			\
	src/shade/mat.js			\
	src/shade/per_vertex.js			\
	src/shade/builtins.js			\
	src/shade/seq.js			\
	src/shade/program.js			\
	src/shade/round.js			\
	src/shade/utils/_begin.js		\
	src/shade/utils/lerp.js			\
	src/shade/utils/choose.js		\
	src/shade/utils/linear.js		\
	src/shade/utils/fit.js			\
	src/shade/gl_light.js			\
	src/shade/gl_fog.js			\
	src/shade/cosh.js			\
	src/shade/sinh.js			\
	src/shade/tanh.js			\
	src/shade/logical_operators.js		\
	src/shade/ifelse.js			\
	src/shade/rotation.js			\
	src/shade/translation.js		\
	src/shade/ortho.js			\
	src/shade/look_at.js			\
	src/shade/discard.js			\
	src/shade/id.js				\
	src/shade/frustum.js			\
	src/shade/perspective_matrix.js		\
	src/shade/_end.js			\
	src/shade/colors/_begin.js		\
	src/shade/colors/alpha.js		\
	src/shade/colors/convert.js		\
	src/shade/colors/convert_shade.js	\
	src/shade/bits/_begin.js		\
	src/shade/bits/encode_float.js		\
	src/shade/bits/extract_bits.js		\
	src/shade/bits/mask_last.js		\
	src/shade/bits/shift_left.js		\
	src/shade/bits/shift_right.js		\
	src/shade/scale/_begin.js		\
	src/shade/scale/linear.js		\
	src/facet/marks/_begin.js		\
	src/facet/marks/aligned_rects.js	\
	src/facet/marks/lines.js		\
	src/facet/marks/dots.js			\
	src/facet/marks/scatterplot.js		\
	src/facet/marks/globe.js		\
	src/facet/marks/polygon.js		\
	src/facet/models/_begin.js		\
	src/facet/models/flat_cube.js		\
	src/facet/models/mesh.js		\
	src/facet/models/sphere.js		\
	src/facet/models/square.js		\
	src/facet/models/teapot.js		\
	src/facet/models/polygon.js		\
	src/facet/mesh/_begin.js		\
	src/facet/mesh/indexed.js		\
	src/facet/scene/_begin.js		\
	src/facet/scene/add.js			\
	src/facet/scene/remove.js		\
	src/facet/scene/render.js		\
	src/facet/scene/invalidate.js

# If the chmods below don't make sense to you right now, wait until
# you fix a bug on the compilation output instead of the source :)
facet.min.js: facet.js Makefile
	@rm -f $@
	$(JS_COMPILER) < $< > $@
	chmod -w $@

facet.js: Makefile
	echo $^
	@rm -f $@
	cat $(filter %.js,$^) > $@
ifeq ($(CHECK),1) 
	jshint $(filter %.js,$(filter-out lib/%.js,$(filter-out %/_begin.js,$(filter-out %/_end.js, $^))))
endif
	chmod -w $@ 

data.js: Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@
	chmod -w $@

brewcolor.js: Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@
	chmod -w $@

clean:
	rm -f facet.js facet.min.js
