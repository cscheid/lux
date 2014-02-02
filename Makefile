# Lux's build system is entirely based on Mike Bostock's excellent
# d3 library.

JS_COMPILER = ./node_modules/uglify-js/bin/uglifyjs

all: lux.js lux.min.js data.js

data.js:					\
	src/data/_begin.js			\
	src/data/iris.js			\
	src/data/cars.js

lux.js:								\
	src/copyright-notice.js					\
	src/lux/_begin.js					\
	src/lux/_globals.js					\
	lib/_begin.js						\
	lib/underscore-min.js					\
	lib/webgl-debug.js					\
	lib/webgl-utils.js					\
	lib/pre-tessellate.js					\
	lib/_tessellate.js					\
	lib/post-tessellate-1.js				\
	lib/tessellate.js					\
	lib/post-tessellate-2.js				\
	src/underscore_mixins.js				\
	src/linalg/_begin.js					\
	src/linalg/vec2.js					\
	src/linalg/vec3.js					\
	src/linalg/vec4.js					\
	src/linalg/mat2.js					\
	src/linalg/mat3.js					\
	src/linalg/mat4.js					\
	src/linalg/vec.js					\
	src/linalg/mat.js					\
	src/linalg/_end.js					\
	src/typeinfo.js						\
	src/lux/attribute_buffer_view.js			\
	src/lux/attribute_buffer.js				\
	src/lux/buffer.js					\
	src/lux/bake.js						\
	src/lux/batch_list.js					\
	src/lux/conditional_batch.js				\
	src/lux/bake_many.js					\
	src/lux/element_buffer.js				\
	src/lux/fresh_pick_id.js				\
	src/lux/id_buffer.js					\
	src/lux/init.js						\
	src/lux/matrix.js					\
	src/lux/model.js					\
	src/lux/now.js						\
	src/lux/picker.js					\
	src/lux/profile.js					\
	src/lux/program.js					\
	src/lux/render_buffer.js				\
	src/lux/set_context.js					\
	src/lux/on_context.js					\
	src/lux/texture.js					\
	src/lux/unprojector.js					\
	src/lux/net/_begin.js					\
	src/lux/net/ajax.js					\
	src/lux/net/json.js					\
	src/lux/net/binary.js					\
	src/lux/net/_end.js					\
	src/lux/drawing_mode/_begin.js				\
	src/lux/drawing_mode/additive.js			\
	src/lux/drawing_mode/over.js				\
	src/lux/drawing_mode/standard.js			\
	src/lux/drawing_mode/pass.js				\
	src/lux/data/_begin.js					\
	src/lux/data/table.js					\
	src/lux/data/texture_table.js				\
	src/lux/data/texture_array.js				\
	src/lux/data/array_1d.js				\
	src/lux/ui/_begin.js					\
	src/lux/ui/parameter_slider.js				\
	src/lux/ui/parameter_checkbox.js			\
	src/lux/ui/center_zoom_interactor.js			\
	src/shade/_begin.js					\
	src/shade/debug/_begin.js				\
	src/shade/debug/walk.js					\
	src/shade/debug/from_json.js				\
	src/shade/debug/_json_builder.js			\
	src/shade/make.js					\
	src/shade/memoize_on_field.js				\
	src/shade/memoize_on_guid_dict.js			\
	src/shade/unknown.js					\
	src/shade/camera/_begin.js				\
	src/shade/camera/perspective.js				\
	src/shade/camera/ortho.js				\
	src/shade/color.js					\
	src/shade/looping.js					\
	src/shade/unique_name.js				\
	src/shade/create.js					\
	src/shade/types/_begin.js				\
	src/shade/types/type_of.js				\
	src/shade/types/base_t.js				\
	src/shade/types/basic.js				\
	src/shade/types/array.js				\
	src/shade/types/function_t.js				\
	src/shade/types/simple_types.js				\
	src/shade/types/struct_t.js				\
	src/shade/compilation_context.js			\
	src/shade/exp.js					\
	src/shade/value_exp.js					\
	src/shade/swizzle.js					\
	src/shade/constant.js					\
	src/shade/array.js					\
	src/shade/struct.js					\
	src/shade/set.js					\
	src/shade/parameter.js					\
	src/shade/sampler2D_from_texture.js			\
	src/shade/attribute.js					\
	src/shade/varying.js					\
	src/shade/fragCoord.js					\
	src/shade/pointCoord.js					\
	src/shade/round_dot.js					\
	src/shade/operators.js					\
	src/shade/neg.js					\
	src/shade/vec.js					\
	src/shade/mat.js					\
	src/shade/per_vertex.js					\
	src/shade/builtins.js					\
	src/shade/seq.js					\
	src/shade/program.js					\
	src/shade/round.js					\
	src/shade/utils/_begin.js				\
	src/shade/utils/lerp.js					\
	src/shade/utils/choose.js				\
	src/shade/utils/linear.js				\
	src/shade/utils/fit.js					\
	src/shade/gl_fog.js					\
	src/shade/cosh.js					\
	src/shade/sinh.js					\
	src/shade/tanh.js					\
	src/shade/logical_operators.js				\
	src/shade/ifelse.js					\
	src/shade/rotation.js					\
	src/shade/translation.js				\
	src/shade/scaling.js					\
	src/shade/ortho.js					\
	src/shade/look_at.js					\
	src/shade/discard.js					\
	src/shade/id.js						\
	src/shade/frustum.js					\
	src/shade/perspective_matrix.js				\
	src/shade/_end.js					\
	src/shade/colors/_begin.js				\
	src/shade/colors/alpha.js				\
	src/shade/colors/brewer.js				\
	src/shade/colors/convert.js				\
	src/shade/colors/convert_shade.js			\
	src/shade/bits/_begin.js				\
	src/shade/bits/encode_float.js				\
	src/shade/bits/extract_bits.js				\
	src/shade/bits/mask_last.js				\
	src/shade/bits/shift_left.js				\
	src/shade/bits/shift_right.js				\
	src/shade/scale/_begin.js				\
	src/shade/scale/ordinal.js				\
	src/shade/scale/linear.js				\
	src/shade/scale/transformed.js				\
	src/shade/scale/log.js					\
	src/shade/scale/log10.js				\
	src/shade/scale/log2.js					\
	src/shade/scale/geo/_begin.js				\
	src/shade/scale/geo/latlong_to_hammer.js		\
	src/shade/scale/geo/latlong_to_mercator.js		\
	src/shade/scale/geo/latlong_to_spherical.js		\
	src/shade/scale/geo/mercator_to_latlong.js		\
	src/shade/scale/geo/mercator_to_spherical.js		\
	src/shade/gl_light.js					\
	src/shade/light/_begin.js				\
	src/shade/light/ambient.js				\
	src/shade/light/diffuse.js				\
	src/shade/threed/_begin.js				\
	src/shade/threed/bump.js				\
	src/shade/threed/normal.js				\
	src/shade/threed/cull_backface.js			\
	src/lux/geometry/_begin.js				\
	src/lux/geometry/triangulate.js				\
	src/lux/geometry/ply.js					\
	src/lux/text/_begin.js					\
	src/lux/text/outline.js					\
	src/lux/text/texture.js					\
	src/lux/debug/_begin.js					\
	src/lux/debug/init.js					\
	src/lux/debug/post.js					\
	src/lux/marks/_begin.js					\
	src/lux/marks/aligned_rects.js				\
	src/lux/marks/lines.js					\
	src/lux/marks/dots.js					\
	src/lux/marks/scatterplot.js				\
	src/lux/marks/rectangle_brush.js			\
	src/lux/marks/globe.js					\
	src/lux/marks/globe_2d.js				\
	src/lux/models/_begin.js				\
	src/lux/models/flat_cube.js				\
	src/lux/models/mesh.js					\
	src/lux/models/sphere.js				\
	src/lux/models/square.js				\
	src/lux/models/teapot.js				\
	src/lux/mesh/_begin.js					\
	src/lux/mesh/indexed.js					\
	src/lux/actor.js					\
	src/lux/scene.js					\
	src/lux/scene/_begin.js					\
	src/lux/scene/add.js					\
	src/lux/scene/remove.js					\
	src/lux/scene/render.js					\
	src/lux/scene/animate.js				\
	src/lux/scene/on.js					\
	src/lux/scene/invalidate.js				\
	src/lux/scene/transform/_begin.js			\
	src/lux/scene/transform/geo/_begin.js			\
	src/lux/scene/transform/geo/latlong_to_hammer.js	\
	src/lux/scene/transform/geo/latlong_to_mercator.js	\
	src/lux/scene/transform/geo/latlong_to_spherical.js	\
	src/lux/scene/transform/geo/mercator_to_latlong.js	\
	src/lux/scene/transform/geo/_end.js			\
	src/lux/scene/transform/camera/_begin.js		\
	src/lux/scene/transform/camera/perspective.js

# If the chmods below don't make sense to you right now, wait until
# you fix a bug on the compilation output instead of the source :)
lux.min.js: lux.js Makefile
	@rm -f $@
	$(JS_COMPILER) < $< > $@
	chmod -w $@

lux.js: Makefile
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

clean:
	rm -f lux.js lux.min.js
