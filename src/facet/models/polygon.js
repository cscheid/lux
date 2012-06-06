Facet.Models.polygon = function(poly,style,vertexColor) {

function point_2d(x, y) {
	this.x = (typeof x == "undefined") ? 0 : x;
	this.y = (typeof y == "undefined") ? 0 : y;
}

function hidePolyListElement(polyList,indx){
	polyList[polyList[indx].prev].next = polyList[indx].next;
	polyList[polyList[indx].next].prev = polyList[indx].prev;
	polyList[indx].next = -1;
	polyList[indx].prev = -1;
}


//adjust linked list pointers and remove element from array
function hideElement(list,val){
for(var i=0;i<list.length;i++){

	if((list[i].val === val) && (list[i].next >= 0)){
		list[list[i].prev].next = list[i].next;
		list[list[i].next].prev = list[i].prev;
		return i;
	}
}
return -1;
}


function removeElement(list,val){
var indx;

indx = hideElement(list,val);
if(indx >= 0){
	list[indx].next = -1;
	list[indx].prev = -1;
}
}

function addElement(list,val){
		element = new Object();
		if(list.length === 0){
			element.prev = 0;
			element.next = 0;
		}
		else {
			for(var i=0;i<list.length;i++)
				if(list[i].next >= 0)
					break;
			if(i === list.length){
				element.prev = i;
				element.next = i;
			}
			else {
				element.prev = i;
				element.next = list[i].next;
				list[list[i].next].prev = list.length;
				list[i].next = list.length;
			}
		}
		element.val = val;
		list.push(element);
}

function isElementInList(list,val){
var i;

if(list.length === 0)
	return false;
	
for(i=0;i<list.length;i++){
	if((list[i].val === val) && list[i].prev >= 0)
		return true;
}

return false;
}

/*
  pt1 is the intersection of a vertext´s test ray and a vertex edge
  pt2 is a point on a vertext´s diagnal
  pt3 is a point on the line defined by m and b
  determine if the point of intersection is on the same side of the 
  reference line as the diagnal
*/

function isSameSide(pt1,pt2,pt3,m,b){
if(m === Number.NEGATIVE_INFINITY || m === Number.POSITIVE_INFINITY){
	if((pt1.x < pt3.x) && (pt2.x < pt3.x))
		return true;
	else if((pt1.x > pt3.x) && (pt2.x > pt3.x))
		return true;
}
else {	
	if(pt1.y < ((m*pt1.x) + b)){
		if(pt2.y < ((m*pt2.x) + b))
			return true;
	}
	else if(pt1.y > ((m*pt1.x) + b)){
		if(pt2.y > ((m*pt2.x) + b))
			return true;
	}
}
return false;

}


function angleType(polyList,indx){
var next,prev,current,item,nextItem;
var cx,cy,be,br,me,mr,minx,maxx,miny,maxy,count,iteration;
var intersection = new point_2d();
var testRay = {point:new point_2d()};
var isEar;

//vertex being processed - Vi
current = polyList[indx];
//line segment connecting midpoint of edge Vi-Vn and midpoint of segment Vp-Vn
count = 0;
//count the number of times testRay intersects a polygon edge
//an even number of intersections means points in the vertex's acute angle 
//region are external to the polygon and the vertex angle is reflex
for(var i=0;i<polyList.length;i++){
	//diagnal length is 0
	if(isNaN(current.diag.edge.m))
		break;
		
	//skip the vertex being processed
	if(i === indx)
		continue;

	//skip the vertex if it has been removed from the linked list
	if(polyList[i].next === -1)
		continue;
	testRay = getLineParams(current.diag.edge,current.edge);
	br = testRay.b;
	mr = testRay.m;

	item = polyList[i];
	nextItem = polyList[item.next];

	//get the coordinates of the edge
	if(item.point.x === nextItem.point.x){
		if(item.point.y === nextItem.point.y){
			alert("Could not determine vertex angle type for singular point");
			continue;
		}
		miny = Math.min(item.point.y,nextItem.point.y);
		if(miny === item.point.y){
			minx = item.point.x;
			maxy = nextItem.point.y;
			maxx = nextItem.point.x;
		}
		else {
			minx = nextItem.point.x;
			maxy = item.point.y;
			maxx = item.point.x;
		}
	}
	else {
		minx = Math.min(item.point.x,nextItem.point.x);
		if(minx === item.point.x){
			miny = item.point.y;
			maxx = nextItem.point.x;
			maxy = nextItem.point.y;
		}
		else {
			miny = nextItem.point.y;
			maxx = item.point.x;
			maxy = item.point.y;
		}
	}

	//get the line parameters for the edge between vertex(i) and vertex(i+1)
	be = item.edge.b;
	me = item.edge.m;

	//get the coordinates of the point where the test ray intersects the edge
	if(me === mr){
		//ray is parallel to the edge so they don´t intersect
		continue;
	}
	if(isNaN(be)){
		intersection.x = minx;
		intersection.y = (mr * minx) + br;
	}
	else if(isNaN(br)){
		intersection.x = current.edge.point.x;
		intersection.y = (me * intersection.x) + be;
	}
	else {
		intersection.x = (be - br)/(mr - me);
		intersection.y = (me * intersection.x) + be;
	}

	iteration = 0;
	//it is not permitted for the intersection point to be on a vertex
	while(
			((intersection.x === minx && intersection.y === miny) || 
			(intersection.x === maxx && intersection.y === miny)) &&
			(iteration < 5)){
		iteration++;
		//change the angle of testRay slightly to get a new intersection with the edge
		testRay = getLineParams(current.diag.edge,current.edge,iteration);
		br = testRay.b;
		mr = testRay.m;
		if(me === mr){
			continue;
		}
		if(isNaN(be)){
			intersection.x = minx;
			intersection.y = (mr * minx) + br;
		}
		else if(isNaN(br)){
			intersection.x = current.edge.point.x;
			intersection.y = (me * intersection.x) + be;
		}
		else {
			intersection.x = (be - br)/(mr - me);
			intersection.y = (me * intersection.x) + be;
		}
	}
	if(iteration === 5){
		alert("Could not determine vertex angle type");
		continue;
	}

	//if the ray intersects the vertex diagnal then increment the counter
	if((intersection.x > minx && intersection.x < maxx) || 
		(intersection.y > miny && intersection.y < maxy)){
		if( isSameSide(intersection,current.diag.edge.point,
			current.edge.point,current.edge.m,current.edge.b))
		count++;
	}
}


//if count is odd then the vertex angle is concave
if(count%2){
	polyList[indx].isReflex = false;
	isEar = true;
	next = polyList[current.next];
	prev = polyList[current.prev];
	//determine if this vertex is an ear tip
	for(var i=0;i<polyList.length;i++){

		//exclude vertices that cannot be in the interior of the acute angle
		if(polyList[i] === current || polyList[i] === next || polyList[i] === prev)
		continue;

		//if any vertex falls within the triangle then it is not an ear
		if(isSameSide(current.point,polyList[i].point,next.point,current.diag.edge.m,current.diag.edge.b) &&
			isSameSide(next.point,polyList[i].point,prev.point,prev.edge.m,prev.edge.b) &&
			isSameSide(prev.point,polyList[i].point,current.point,current.edge.m,current.edge.b)){
				isEar = false;
				break;
			}	
	}
	polyList[indx].isEar = isEar;
}
else {
	polyList[indx].isReflex = true;
	polyList[indx].isEar = false;
}


}


function getLineParams(vertx1,vertx2,shift){
var edge = new Object(),mid = new point_2d();
var deltaY,deltaX,cx,cy,rayStart,rayEnd;
var m,b,displacement = .000001;

rayStart = new point_2d(vertx1.point.x,vertx1.point.y);
if(typeof shift == "undefined")
	shift = 0;

//change position of the point where the ray ends
if(shift > 0){
	m = vertx2.m;
	b = vertx2.b;
	cx = vertx2.point.x - (shift * displacement);
	cy = (m * cx) + b;
	rayEnd = new point_2d(cx,cy);
}
else
	rayEnd = new point_2d(vertx2.point.x,vertx2.point.y);

deltaX = rayEnd.x - rayStart.x;
deltaY = rayEnd.y - rayStart.y;
cx = rayStart.x;
cy = rayStart.y;

if(deltaX === 0.){
	if(deltaY === 0.){ //single point
		edge.m = Number.NaN;
		edge.b = Number.NaN;
	}
	else if(deltaY < 0.){ //verticle line
		edge.m = Number.NEGATIVE_INFINITY;
		edge.b = Number.NaN;
	}
	else { //verticle line
		edge.m = Number.POSITIVE_INFINITY;
		edge.b = Number.NaN;
	}
	mid.x = cx;
	mid.y = cy + (deltaY/2.);
}
else if(deltaY === 0.){ //horizontal line
	edge.m = 0.;
	edge.b = cy;
	mid.x = cx + (deltaX/2.);
	mid.y = cy
}
else { //arbitrary slope
	edge.m = deltaY/deltaX;
	edge.b = cy -(edge.m * cx);
	mid.x = cx + (deltaX/2.);
	mid.y = cy + (deltaY/2.)
}
edge.point = mid;

return edge;
}

/*
 *
 *	get the line parameters (slope m and y intercept b)
 *	for each edge and the line that closes the triange
 *	defined by a vertex and its previous and next vertices
 *
 */
function getListParams(polyList,indx){

var prev,next,current,prevElmt,nextElmt;
var point = {};
var edge = {point:{}};
var diag = {point:{}};
	current = polyList[indx];
	prev = polyList[indx].prev;
	next = polyList[indx].next;
	prevElmt = polyList[prev];
	nextElmt = polyList[next];

	//get edge slope, y-intersect and midpoint coordinates
	edge = getLineParams(current,nextElmt);
	current.edge = {};
	current.edge.m = edge.m;
	current.edge.b = edge.b;
	current.edge.point = new point_2d();
	current.edge.point.x = edge.point.x;
	current.edge.point.y = edge.point.y;

	//get diagnal slope, y-intersect and midpoint coordinates
	current.diag = {};
	current.diag.edge = getLineParams(prevElmt,nextElmt);;
}

function triangulate(poly){
var polyList = new Array();
var reflex = new Array();
var concave = new Array();
var earTip = new Array();
var currentEar,tPrev,tNext,triangle,prev,next,aType,vertxCount;	

	//create linked list
	for(var i=0;i<poly.length;i++){
		var polyListItem = {};
		polyListItem.point = new point_2d(poly[i].x,poly[i].y);
		if(i === 0)
			polyListItem.prev = poly.length - 1;
		else
			polyListItem.prev = i-1;

		if(i === (poly.length -1))
			polyListItem.next = 0;
		else
			polyListItem.next = i + 1;

		polyList.push(polyListItem);
	}


	//assign vertex edges and diagnals
	for(var i=0;i<polyList.length;i++)
		getListParams(polyList,i);

	for(var i=0;i<polyList.length;i++){
		angleType(polyList,i);
		if(polyList[i].isReflex){
			addElement(reflex,i);
		}
		else {
			addElement(concave,i);
			if(polyList[i].isEar){
				element = new Object;
				addElement(earTip,i);
			}
		}
	}
	//the polygon, reflex, concave and ear tip structures are initialize at this point

	vertxCount = polyList.length;
	while(vertxCount >= 3){
		for(var i=0;i<earTip.length;i++)
			if(earTip[i].next >= 0)
				break;
		if(i === earTip.length)
				break;
		currentEar = earTip[i];
		tPrev = polyList[currentEar.val].prev;
		tNext = polyList[currentEar.val].next;
		triangle = [tPrev,currentEar.val,tNext];
		triangles.push(triangle);
		removeElement(earTip,currentEar.val);
		removeElement(concave,currentEar.val);
		hidePolyListElement(polyList,currentEar.val);
		getListParams(polyList,tPrev);
		aType = angleType(polyList,tPrev);
		if(polyList[tPrev].isReflex){
			if(!isElementInList(reflex,tPrev))
				addElement(reflex,tPrev);
			if(isElementInList(concave,tPrev))
				removeElement(concave,tPrev);
			if(isElementInList(earTip,tPrev))
				removeElement(earTip,tPrev);
		}
		else {
			if(!isElementInList(concave,tPrev))
				addElement(concave,tPrev);
			if(isElementInList(reflex,tPrev))
				removeElement(reflex,tPrev);
			if(polyList[tPrev].isEar){
				if(!isElementInList(earTip,tPrev))
					addElement(earTip,tPrev);
			}
		}
		getListParams(polyList,tNext);
		aType = angleType(polyList,tNext);
		if(polyList[tNext].isReflex){
			if(!isElementInList(reflex,tNext))
				addElement(reflex,tNext);
			if(isElementInList(concave,tNext))
				removeElement(concave,tNext);
			if(isElementInList(earTip,tNext))
				removeElement(earTip,tNext);
		}
		else {
			if(!isElementInList(concave,tNext))
				addElement(concave,tNext);
			if(isElementInList(reflex,tNext))
				removeElement(reflex,tNext);
			if(polyList[tNext].isEar){
				if(!isElementInList(earTip,tNext))
					addElement(earTip,tNext);
			}
		}
		vertxCount--;
	}
	return triangles;
}

if (! _.isUndefined(poly)){

	var triangles = [];
    var verts = [];
    var elements = [];

	if (_.isUndefined(style))
		style = "line_loop";

	if(style === "triangles" || style === "triangles_loop" || style === "triangles_strip"){
		// get an array of arrays containing the triangulation of the polygon
		// every element of indx represents an array of three indices of the polygon
		// the points of polygon corresponding to the indices define a triangle
		triangles = triangulate(poly);

		// convert the array of triangle index arrays to a single array of indices
		for(var i=0 ;i<triangles.length;i++){
			for(var j=0;j<3;j++){
				elements.push(triangles[i][j]);
			}
		}
	}
	else {
		for(var i=0;i<poly.length;i++){
			elements.push(i);
		}
	}
	// extract the x and y coordinates of the polygon
	for(var i=0;i<poly.length;i++){
		verts.push(poly[i].x);
		verts.push(poly[i].y);
		
	}
	var uv = Shade(Facet.attribute_buffer({vertex_array:verts, item_size:2}));

	if (! _.isUndefined(vertexColor)){
		// if an array of color values is provided, they will be assigned to the
		// polygon vertices in a round-robin fashion
		
		return Facet.model({
			type: style,
        	elements: Facet.element_buffer(elements),
        	vertex: uv,
			color: vertexColor
    	});
	} else {
    	return Facet.model({
        	type: style,
        	elements: Facet.element_buffer(elements),
        	vertex: uv
		});
	}

} else
throw "poly is a required parameter";
};

