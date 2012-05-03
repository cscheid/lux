var alive = false;

function point_2d(x, y) {
	this.x = (typeof x == "undefined") ? 0 : x;
	this.y = (typeof y == "undefined") ? 0 : y;
	}

function init_webgl(){
	return Facet.init(document.getElementById("webgl"), {
        clearColor: [0, 0, 0, 0.2],
        mousedown: function(event) {
		pick(event.offsetX,event.offsetY);	
        }
   })};
   

  function refresh_webgl(){
    gl = Facet.init(document.getElementById("webgl"), {
        clearColor: [0, 0, 0, 0.2],
   })
    radialPoly(numPoints,reduction,cntr);
    f();
  }


function radialPoly(n,sz,cntr){
var angle,px,py,pnt;
var poly = [];
var vertices;

angle = (2*Math.PI)/n;
for(var i=0;i<n;i++){
	px = (sz * (Math.cos(i*angle))) + cntr.x;
	py = (sz * (Math.sin(i*angle))) + cntr.y;
	pnt = new point_2d(px,py);
	poly.push(pnt);
}

display(poly);
}


function randomPoly(num){

var maxCoord = 10;
function data_buffers(num) {
	function genPolygon(numPoints) {
		var coords = new Array();
		var m1, m2, x1, x2, x3, y1, y2, y3, b1, b2, i, px;
    		var xn, yn, count, errCount = 0;
		count = numPoints - 3;
		xn = maxCoord * Math.random();
		yn = maxCoord * Math.random();
		coords.push({x: xn, y: yn});
		xn = maxCoord * Math.random();
		yn = maxCoord * Math.random();
		coords.push({x: xn, y: yn});
		xn = maxCoord * Math.random();
		yn = maxCoord * Math.random();
		coords.push({x: xn, y: yn});

		do{
			xn = maxCoord * Math.random();
			yn = maxCoord * Math.random();
			for(i=1;i<coords.length - 1;i++){
				x1 = coords[i-1].x;
				y1 = coords[i-1].y;
				x2 = coords[i].x;
				y2 = coords[i].y;
				x3 = coords[coords.length - 1].x;
				y3 = coords[coords.length - 1].y;
				m1 = (y2 - y1)/(x2 - x1);

				m2 = (yn - y3)/(xn - x3);
				b1 = y1 - (m1 * x1);
				b2 = yn - (m2 * xn);

				px = (b2 - b1)/(m1 - m2);
				if(px > x1 && px < x2){
					errCount++;
					break;
				}
					
			}
			if(i === (coords.length - 1)){
				coords.push({x: xn, y: yn});
				count--;
			}
		}while(errCount < 10 && count > 0 );
		return coords;
	}


	var buffers = genPolygon(num);
	var xs = buffers.map(function(buffer) {
		return buffer.x;
	});
	var ys = buffers.map(function(buffer){
		return buffer.y;
	});
	var mxx=0,mxy=0;
	for(var i=0;i<xs.length;i++){
		mxx = Math.max(mxx,xs[i]);
		mxy = Math.max(mxy,ys[i]);
	}
	//determine maximum coord values
	return [xs,ys,mxx,mxy]; 
}






   var px,py,pnt,poly = [];
   var vertices;

   var data = data_buffers(num);
   var xcoords = data[0];
   var ycoords = data[1];
   var mxx = data[2];
   var mxy = data[3];


   for(var i=0;i<xcoords.length - 1;i++){
	px = xcoords[i]/mxx;
	py = ycoords[i]/mxy;
	pnt = new point_2d(px,py);
	poly.push(pnt);
   }

display(poly);
}

function to_opengl(x){ return ((2*x) - 1.);}


function display(vertices){
	var vertexColor = [];

	var g = Shade.color('green'),
        r = Shade.color('red'),
        o = Shade.color('orange'),
        y = Shade.color('yellow'),
        b = Shade.color('blue'),
        v = Shade.color('violet')
		blk = Shade.color('black');
    var color;

    if(colorIndx === Math.NaN)
    	color = [getColor(0,1),getColor(0,1),getColor(0,1),getColor(0,1)];
    else if(colorIndx === -1)
    	color = [blk,r,g,b];
    else
    	color = [blk,getColor(colorIndx,1),getColor(colorIndx + 1,1),getColor(colorIndx + 2,1)];
    
    for(var i=0;i < vertices.length;i++){
			vertexColor.push(color[i%4]);
		vertices[i].x = to_opengl(vertices[i].x);
		vertices[i].y = to_opengl(vertices[i].y);
    }

	var polygon_model = Facet.Models.polygon(vertices,vertexColor);
	//var polygon_model = Facet.Models.polygon(vertices);

    var polygon = Facet.bake(polygon_model, {
        position: polygon_model.vertex,
		color: polygon_model.color
    });

    Facet.Scene.add(polygon);

}

function polyIsClosed(poly){
var dist,p1x,p1y,p2x,p2y,delta = .01;
if(poly.length > 3){
	p1x = poly[0].x;
	p1y = poly[0].y;
	p2x = poly[poly.length-1].x;
	p2y = poly[poly.length-1].y;
	dist = Math.sqrt(Math.pow((p2x - p1x),2) + Math.pow((p2y - p1y),2));
	if(dist < delta)
		return 1;
}
return 0;
}


function dispPoint(xcoord,ycoord){
var stroke_width;
var point_diameter;
var point_alpha;
point_diameter = Shade.parameter("float", 10);
stroke_width   = Shade.parameter("float", 2.5);
point_alpha    = Shade.parameter("float", 1.0);

var species_color = Shade.vec(Shade.vec(1, 0, 0), point_alpha);
Facet.Scene.add(Facet.Marks.scatterplot({
        elements: 1,
        x: Shade.parameter("float",xcoord),
        y: Shade.parameter("float",ycoord),
        fill_color: species_color,
        stroke_color: species_color.mul(0.75),
        stroke_width: stroke_width,
        point_diameter: point_diameter,
        mode: Facet.DrawingMode.over
}));

}
var poly = [];

function pick(xcoord,ycoord){

	var px,py,vertices;
	px = (xcoord)/viewportWidth;
	py = (viewportHeight-(ycoord))/viewportHeight;
	var p = new point_2d(px,py);
	poly.push(p);

	dispPoint(px,py);

	if (polyIsClosed(poly)){
		//remove last point which closed polygon
			poly.splice(poly.length-1);
	display(poly);
		poly.splice(0);
	}
}

function changeReduction(){
 
	//get reduction value and refresh
 	reduction = parseFloat($('input:text[name=reduction]').val());
	reduction = (1 - (.01 * reduction));
	reduction = (reduction <= 0. ? .009 : reduction);
	gl = refresh_webgl();
	}

function changenumPoints(){
 
	//get numPoints value and refresh
 	numPoints = parseFloat($('input:text[name=numPoints]').val());
	numPoints = (numPoints < 3. ? 3. : numPoints);
	numPoints = (numPoints > 100. ? 100. : numPoints);
	$('input:text[name=numPoints]').val(numPoints);
	gl = refresh_webgl();
	}

function changeXcoord(){

	//get xcoord value and refresh
 	xcoord = parseFloat($('input:text[name=xcoord]').val());
	xcoord = (xcoord > 100. ? 100. : xcoord);
	$('input:text[name=xcoord]').val(xcoord);
	xcoord /= 100.;
	cntr = new point_2d(xcoord,ycoord);
	gl = refresh_webgl();
	}

function changeYcoord(){
 
	//get ycoord value and refresh
 	ycoord = parseFloat($('input:text[name=ycoord]').val());
	ycoord = (ycoord > 100. ? 100. : ycoord);
	$('input:text[name=ycoord]').val(ycoord);
	ycoord /= 100.;
	cntr = new point_2d(xcoord,ycoord);
	gl = refresh_webgl();
	}

function changeSchemeOffset(){
	//get color number value and refresh
	if(isNaN(parseFloat($('input:text[name=schemeOffset]').val()))){
		colorIndx = Math.NaN;
	}
	else {
 		colorIndx = parseFloat($('input:text[name=schemeOffset]').val());
		colorIndx = (colorIndx < 0 ? 0 : colorIndx - 1);
		if((colorIndx > (classNum - 2)) || ((getColor(colorIndx + 2,1) === undefined)))
			colorIndx = 0;
		$('input:text[name=schemeOffset]').val(colorIndx + 1);
	}
	cntr = new point_2d(xcoord,ycoord);
	gl = refresh_webgl();
	}
	
function changeClassNum(){
	var newClassNum = $('input:text[name=classNum]').val()
 	colorIndx = parseFloat($('input:text[name=schemeOffset]').val());
	colorIndx = (colorIndx < 0 ? 0 : colorIndx - 1);
	if((colorIndx > (newClassNum - 2)) || ((getColor(colorIndx + 2,1) === undefined)))
		colorIndx = 0;
	$('input:text[name=schemeOffset]').val(colorIndx + 1);

}
	
f = function () {
    if (alive) {
	window.requestAnimFrame(f, canvas);
    }
    gl.display();
  };


initApp = function(){
xcoord = .5;
ycoord = .5;
cntr = new point_2d(xcoord,ycoord);

numPoints = 12;
reduction = .4;
colorIndx = -1.;
$('input:text[name=reduction]').val((1 - (reduction))*100);
$('input:text[name=numPoints]').val(numPoints);
$('input:text[name=xcoord]').val(xcoord * 100);
$('input:text[name=ycoord]').val(ycoord * 100);
$('input:text[name=schemeOffset]').val("");
//$('input:text[name=schemeOffset]').val(colorIndx + 1);

gl = init_webgl();
radialPoly(numPoints,reduction,cntr);
//randomPoly(numPoints);
f();
}
$().ready(function() {


   $("#reduction").change(function(){
    	changeReduction();
   	});

    $("#numPoints").change(function(){
    	changenumPoints();
   	});

    $("#xcoord").change(function(){
    	changeXcoord();
   	});

    $("#ycoord").change(function(){
    	changeYcoord();
   	});

    $("#scheme").click(function(){
 	$('input:text[name=schemeName]').val("");
   	changeSchemeType();
	changeSchemeOffset();
  	});

    $("#schemeName").change(function(){
	changeColorName();
	});

    $("#schemeOffset").change(function(){
    	changeSchemeOffset();
   	});

    $("input[name='classNum']").change(function(){
	changeClassNum();
	changeSchemeType();
	});




gl = Facet.init(document.getElementById("webgl"), {
        clearColor: [0, 0, 0, 0.2],
   });
viewportWidth = gl.viewportWidth;
viewportHeight = gl.viewportHeight;
setClassNum(3);

initApp();

});
