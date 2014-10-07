Lux.Geometry.PLY = {};

Lux.Geometry.PLY.load = function(url, k) {

    function property_size(prop) {
        // char       character                 1
        // uchar      unsigned character        1
        // short      short integer             2
        // ushort     unsigned short integer    2
        // int        integer                   4
        // uint       unsigned integer          4
        // float      single-precision float    4
        // double     double-precision float    8
        return {'char': 1,
                'uchar': 1,
                'short': 2,
                'ushort': 2,
                'int': 4,
                'uint': 4,
                'float': 4,
                'double': 8}[prop.type];
    }
    function property_dataview_setter(prop) {
        return {'char': 'setInt8',
                'uchar': 'setUint8',
                'short': 'setInt16',
                'ushort': 'setUint16',
                'int': 'setInt32',
                'uint': 'setUint32',
                'float': 'setFloat32',
                'double': 'setFloat64'}[prop.type];
    }

    Lux.Net.ajax(url, function(result) {
        var lines = result.split('\n');
        var current_line = 0;

        var header_res = [
                /^element.*/,
                /^comment.*/,
                /^format.*/
        ];

        function parse_header() {
            var header = { 
                elements: [],
                comments: []
            };
            function fail() {
                throw new Error("parse error on line " + (current_line+1) + ": '" + lines[current_line] + "'");
            }
            if (lines[current_line] !== 'ply') {
                fail();
            }
            ++current_line;
            function parse_element_header() {
                var line = lines[current_line].trim().split(' ');
                ++current_line;
                var result = { name: line[1], count: Number(line[2]), 
                               properties: [] };
                line = lines[current_line].trim().split(' ');
                while (line[0] === 'property') {
                    if (line[1] === 'list') {
                        result.properties.push({ type: line[1], 
                                                 name: line[4],
                                                 element_type: line[3] });
                    } else {
                        result.properties.push({ type: line[1], name: line[2] });
                    }
                    ++current_line;
                    line = lines[current_line].trim().split(' ');
                }
                return result;
            }
            while (lines[current_line] !== 'end_header') {
                if (lines[current_line].match(/^element.*/)) {
                    header.elements.push(parse_element_header());
                } else if (lines[current_line].match(/^comment.*/)) {
                    header.comments.push(lines[current_line].trim().split(' ').slice(1).join(" "));
                    ++current_line;
                } else if (lines[current_line].match(/^format.*/)) {
                    header.format = lines[current_line].trim().split(' ').slice(1);
                    ++current_line;
                } else
                    fail();
            }
            current_line++;
            return header;
        };

        // element list parsing is currently very very primitive, and
        // limited to polygonal faces one typically sees in PLY files.

        function parse_element_list(element_header) {
            if (element_header.name !== 'face' ||
                element_header.properties.length !== 1 ||
                element_header.properties[0].element_type !== 'int') {
                throw new Error("element lists are only currently supported for 'face' element and a single property if type 'int'");
            }
            var result = [];
            var max_v = 0;
            for (var i=0; i<element_header.count; ++i) {
                var row = _.map(lines[current_line].trim().split(' '), Number);
                current_line++;
                if (row.length < 4)
                    continue;
                var vertex1 = row[1];
                max_v = Math.max(max_v, row[1], row[2]);
                for (var j=2; j<row.length-1; ++j) {
                    result.push(vertex1, row[j], row[j+1]);
                    max_v = Math.max(max_v, row[j+1]);
                }
            }
            if (max_v > 65535)
                return new Uint32Array(result);
            else
                return new Uint16Array(result);
        }

        function parse_element(element_header) {
            // are we parsing list properties?
            if (_.any(element_header.properties, function(prop) { return prop.type === 'list'; })) {
                if (_.any(element_header.properties, function(prop) { return prop.type !== 'list'; })) {
                    throw new Error("this PLY parser does not currently support mixed property types");
                }
                return parse_element_list(element_header);
            }
            // no, this is a plain property array
            // 
            // we always use a single arraybuffer and stride into it for performance.
            var row_size = _.reduce(_.map(element_header.properties, property_size),
                                    function(a,b) { return a+b; }, 0);
            var result_buffer = new ArrayBuffer(element_header.count * row_size);
            var view = new DataView(result_buffer);
            var row_offset = 0;
            var row_offsets = [];
            var property_setters = _.map(element_header.properties, function(prop) {
                return view[property_dataview_setter(prop)];
            });
            _.each(element_header.properties, function(prop) {
                row_offsets.push(row_offset);
                row_offset += property_size(prop);
            });
            var n_props = row_offsets.length;
            var endian = Lux._globals.ctx._luxGlobals.little_endian;
            for (var i=0; i<element_header.count; ++i) {
                var row = _.map(lines[current_line].trim().split(' '), Number);
                current_line++;
                for (var j=0; j<row_offsets.length; ++j) {
                    property_setters[j].call(view, i * row_size + row_offsets[j], row[j], endian);
                };
            }
            return result_buffer;
        }

        function parse_content() {
            if (header.format[0] !== 'ascii' ||
                header.format[1] !== '1.0')
                throw new Error("format is unsupported: " + header.format.join(' '));
            return _.object(_.map(header.elements, function(element) {
                return [element.name, parse_element(element)];
            }));
        }

        var header = parse_header();
        var content = parse_content();
        k({ header: header, content: content });
    });
};
