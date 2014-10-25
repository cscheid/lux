Lux.Geometry.PLY = {};

Lux.Geometry.PLY.load = function(url, k) {

    function propertySize(prop) {
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
    function propertyDataviewSetter(prop) {
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
        var currentLine = 0;

        var headerRes = [
                /^element.*/,
                /^comment.*/,
                /^format.*/
        ];

        function parseHeader() {
            var header = { 
                elements: [],
                comments: []
            };
            function fail() {
                throw new Error("parse error on line " + (currentLine+1) + ": '" + lines[currentLine] + "'");
            }
            if (lines[currentLine] !== 'ply') {
                fail();
            }
            ++currentLine;
            function parseElementHeader() {
                var line = lines[currentLine].trim().split(' ');
                ++currentLine;
                var result = { name: line[1], count: Number(line[2]), 
                               properties: [] };
                line = lines[currentLine].trim().split(' ');
                while (line[0] === 'property') {
                    if (line[1] === 'list') {
                        result.properties.push({ type: line[1], 
                                                 name: line[4],
                                                 elementType: line[3] });
                    } else {
                        result.properties.push({ type: line[1], name: line[2] });
                    }
                    ++currentLine;
                    line = lines[currentLine].trim().split(' ');
                }
                return result;
            }
            while (lines[currentLine] !== 'end_header') {
                if (lines[currentLine].match(/^element.*/)) {
                    header.elements.push(parseElementHeader());
                } else if (lines[currentLine].match(/^comment.*/)) {
                    header.comments.push(lines[currentLine].trim().split(' ').slice(1).join(" "));
                    ++currentLine;
                } else if (lines[currentLine].match(/^format.*/)) {
                    header.format = lines[currentLine].trim().split(' ').slice(1);
                    ++currentLine;
                } else
                    fail();
            }
            currentLine++;
            return header;
        };

        // element list parsing is currently very very primitive, and
        // limited to polygonal faces one typically sees in PLY files.

        function parseElementList(elementHeader) {
            if (elementHeader.name !== 'face' ||
                elementHeader.properties.length !== 1 ||
                elementHeader.properties[0].elementType !== 'int') {
                throw new Error("element lists are only currently supported for 'face' element and a single property if type 'int'");
            }
            var result = [];
            var maxV = 0;
            for (var i=0; i<elementHeader.count; ++i) {
                var row = _.map(lines[currentLine].trim().split(' '), Number);
                currentLine++;
                if (row.length < 4)
                    continue;
                var vertex1 = row[1];
                maxV = Math.max(maxV, row[1], row[2]);
                for (var j=2; j<row.length-1; ++j) {
                    result.push(vertex1, row[j], row[j+1]);
                    maxV = Math.max(maxV, row[j+1]);
                }
            }
            if (maxV > 65535)
                return new Uint32Array(result);
            else
                return new Uint16Array(result);
        }

        function parseElement(elementHeader) {
            // are we parsing list properties?
            if (_.any(elementHeader.properties, function(prop) { return prop.type === 'list'; })) {
                if (_.any(elementHeader.properties, function(prop) { return prop.type !== 'list'; })) {
                    throw new Error("this PLY parser does not currently support mixed property types");
                }
                return parseElementList(elementHeader);
            }
            // no, this is a plain property array
            // 
            // we always use a single arraybuffer and stride into it for performance.
            var rowSize = _.reduce(_.map(elementHeader.properties, propertySize),
                                   function(a,b) { return a+b; }, 0);
            var resultBuffer = new ArrayBuffer(elementHeader.count * rowSize);
            var view = new DataView(resultBuffer);
            var rowOffset = 0;
            var rowOffsets = [];
            var propertySetters = _.map(elementHeader.properties, function(prop) {
                return view[propertyDataviewSetter(prop)];
            });
            _.each(elementHeader.properties, function(prop) {
                rowOffsets.push(rowOffset);
                rowOffset += propertySize(prop);
            });
            var nProps = rowOffsets.length;
            var endian = Lux._globals.ctx._luxGlobals.littleEndian;
            for (var i=0; i<elementHeader.count; ++i) {
                var row = _.map(lines[currentLine].trim().split(' '), Number);
                currentLine++;
                for (var j=0; j<rowOffsets.length; ++j) {
                    propertySetters[j].call(view, i * rowSize + rowOffsets[j], row[j], endian);
                };
            }
            return resultBuffer;
        }

        function parseContent() {
            if (header.format[0] !== 'ascii' ||
                header.format[1] !== '1.0')
                throw new Error("format is unsupported: " + header.format.join(' '));
            return _.object(_.map(header.elements, function(element) {
                return [element.name, parseElement(element)];
            }));
        }

        var header = parseHeader();
        var content = parseContent();
        k({ header: header, content: content });
    });
};
