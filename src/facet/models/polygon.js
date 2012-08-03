Facet.Models.polygon = function(poly,style,vertexColor) {

var CW = 1, CCW = 0;

function point_2d(x, y) {
	this.x = (typeof x == "undefined") ? 0 : x;
	this.y = (typeof y == "undefined") ? 0 : y;
}


function getRotation(polyList){
var z = 0, current, next, prev, j, numpts;

numpts = polyList.length;

//check that the linked list contains points
for(var j=0;j<numpts;j++)
	if(polyList[j].next > 0)
		break;
if(j === numpts)
	return -1;

first = j;
for(var i=0;i<polyList.length;i++){
	current = polyList[j];
	next = polyList[current.next];
	prev = polyList[current.prev];
	z += ((current.point.x - prev.point.x) * (next.point.y - current.point.y));
	z -= ((current.point.y - prev.point.y) * (next.point.x - current.point.x));
	j = polyList[j].next;
	if(j === first)
		break;
}
if(z > 0)
	return CCW;
else
	return CW;
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
var i;
		element = new Object();
		if(list.length === 0){
			element.prev = 0;
			element.next = 0;
		}
		else {
			for(i=list.length - 1;i>=0;i--)
				if(list[i].next >= 0)
					break;
			if(i === -1){
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
  pt1 is the first point for comparison
  pt2 is the second point for comparison
  pt3 is a point on the line used for comparison
  m and b are the parameters of the line used for comparison
  
  determine if the two points are on the same side of the line
*/

function isSameSide(pt1,pt2,pt3,m,b){
if(!isFinite(m)){
	if((pt1.x < pt3.x) && (pt2.x < pt3.x))
		return true;
	else if((pt1.x > pt3.x) && (pt2.x > pt3.x))
		return true;
}
else {	
	if((pt1.y < ((m*pt1.x) + b)) && (pt2.y < ((m*pt2.x) + b)))
			return true;
	else if((pt1.y > ((m*pt1.x) + b)) && (pt2.y > ((m*pt2.x) + b)))
			return true;
}
return false;

}




function angleType(polyList,indx,rotation){
var next,prev,current,angle,angleN,angleP,degree;
var count;
var isEar;


current = polyList[indx];
next = polyList[current.next];
prev = polyList[current.prev];


if(rotation === CCW){
	angleN = Math.atan2((next.point.y - current.point.y),(next.point.x - current.point.x));
	angleP = Math.atan2((prev.point.y - current.point.y),(prev.point.x - current.point.x));
	angle = angleP - angleN;
}
else{
	angleN = Math.atan2((next.point.y - current.point.y),(next.point.x - current.point.x));
	angleP = Math.atan2((prev.point.y - current.point.y),(prev.point.x - current.point.x));
	angle = angleN - angleP;
}

degree = angle * (180/Math.PI);
if(degree < 0)
	degree += 360;

if(degree < 180){
	polyList[indx].isReflex = false;
	isEar = true;
	next = polyList[current.next];
	prev = polyList[current.prev];
	//determine if this vertex is an ear tip
	for(var i=0;i<polyList.length;i++){
		if(polyList[i].next < 0)
			continue;
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
var triangles = new Array();
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


rotation = getRotation(polyList);


//assign vertex edges and diagnals
for(var i=0;i<polyList.length;i++)
	getListParams(polyList,i);

for(var i=0;i<polyList.length;i++){
	angleType(polyList,i,rotation);
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
	aType = angleType(polyList,tPrev,rotation);
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
		else{
			if(isElementInList(earTip,tPrev))
				removeElement(earTip,tPrev);
		}
	}
	getListParams(polyList,tNext);
	aType = angleType(polyList,tNext,rotation);
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
		else{
			if(isElementInList(earTip,tNext))
				removeElement(earTip,tNext);
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

