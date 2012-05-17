
Facet.Models.polygon = function(poly,style,vertexColor) {
	var ISCCW = 1,
	ISCW = 2,
	ISON = 3,
	HUGE_VAL = 100000;


function dpd_ccw( p1,p2,p3) {
	var d,ret;
	d = ((p1.y - p2.y) * (p3.x - p2.x)) -
		((p3.y - p2.y) * (p1.x - p2.x));
	ret = (d > 0) ? ISCW : ((d < 0) ? ISCCW : ISON);
	return ret;
}


function Ptriangulate(polygon){
	var i, pointn,minx,minpi,p1,p2,p3;
	pointn = polygon.length;
	pointp = [],pointi = [];

	for (var pi = 0, minx = HUGE_VAL, minpi = -1; pi < polygon.length; pi++) {
		if (minx > polygon[pi].x)
	    minx = polygon[pi].x, minpi = pi;
    }


    p2 = polygon[minpi];
    p1 = polygon[((minpi == 0) ? (polygon.length - 1) : minpi - 1)];
    p3 = polygon[((minpi == polygon.length - 1) ? 0 : minpi + 1)];
    if (((p1.x == p2.x && p2.x == p3.x) && (p3.y > p2.y)) ||
			dpd_ccw(p1, p2, p3) != ISCCW) {
		for (pi = (polygon.length - 1); pi >= 0; pi--) {
	    	if (pi < (polygon.length - 1)
			&& polygon[pi].x == polygon[pi + 1].x
			&& polygon[pi].y == polygon[pi + 1].y)
			continue;
	    	pointp.push(polygon[pi]);
			pointi.push(pi);
		}
    } else {
		for (pi = 0; pi < polygon.length; pi++) {
	    	if (pi > 0 && polygon[pi].x == polygon[pi - 1].x &&
			polygon[pi].y == polygon[pi - 1].y)
			continue;
	    	pointp.push(polygon[pi]);
			pointi.push(pi);
		}
    }
    return triangulate(pointp, pointp.length,pointi);
}

/*
 *	input:	pointp:	array of objects with attributes x and y
 *					that represents a simple, convex and flat polygon
 *					its points can be clockwise or counter clockwise
 *
 *			pointn:	the number of points in pointp to be processed 
 *
 *			pointi:	array of indices into the root pointp array
 *
 *	returns:	array of indices into the root pointp array that
 *				represents a set of trianges 
 */

function triangulate(pointp,pointn,pointi){
	var i, ip1, ip2, j;
	var I = [];
	var element,elements = [];

	if(pointn > 3){
		for (i = 0; i < pointn; i++) {
	    	ip1 = (i + 1) % pointn;
	    	ip2 = (i + 2) % pointn;
	    	if (dpd_isdiagonal(i, ip2, pointp, pointn)) {
				I[0] = pointi[i];
				I[1] = pointi[ip1];
				I[2] = pointi[ip2];
				elements.push(I);
				j = 0;
				for (i = 0; i < pointn; i++)
		    		if (i != ip1){
						pointi[j] = pointi[i];
						pointp[j++] = pointp[i];
					}
				element = triangulate(pointp, pointn - 1, pointi);
				for(var j=0;j<element.length;j++){
					elements.push(element[j]);
				}
			return elements;
	    	}
		}
	} else {
		I[0] = pointi[0];
		I[1] = pointi[1];
		I[2] = pointi[2];
		elements.push(I);
    }
	return elements;
}

function dpd_isdiagonal(i, ip2, pointp, pointn){
    var ip1, im1, j, jp1, res;

    /* neighborhood test */
    ip1 = (i + 1) % pointn;
    im1 = (i + pointn - 1) % pointn;

   
    /* If P[i] is a convex vertex [ i+1 left of (i-1,i) ]. */
    if (dpd_ccw(pointp[im1], pointp[i], pointp[ip1]) === ISCCW){
	res = (dpd_ccw(pointp[i], pointp[ip2], pointp[im1]) === ISCCW) && 
		(dpd_ccw(pointp[ip2], pointp[i], pointp[ip1]) === ISCCW);
	}

    /* Assume (i - 1, i, i + 1) not collinear. */
    else {
	res = (dpd_ccw(pointp[i], pointp[ip2], pointp[ip1]) === ISCW);
	}
    if (!res) {
	return 0;
    }

    /* check against all other edges */
    for (j = 0; j < pointn; j++) {
	jp1 = (j + 1) % pointn;
	if (!((j == i) || (jp1 == i) || (j == ip2) || (jp1 == ip2)))
	    if (dpd_intersects
		(pointp[i], pointp[ip2], pointp[j], pointp[jp1])) {
		return 0;
	    }
    }
    return 1;
}


function dpd_intersects(pa, pb, pc, pd)
{
    var ccw1, ccw2, ccw3, ccw4;

    if (dpd_ccw(pa, pb, pc) === ISON || dpd_ccw(pa, pb, pd) === ISON ||
	dpd_ccw(pc, pd, pa) === ISON || dpd_ccw(pc, pd, pb) === ISON) {
	if (dpd_between(pa, pb, pc) || dpd_between(pa, pb, pd) ||
	    dpd_between(pc, pd, pa) || dpd_between(pc, pd, pb))
	    return 1;
    } else {
	ccw1 = (dpd_ccw(pa, pb, pc) === ISCCW) ? 1 : 0;
	ccw2 = (dpd_ccw(pa, pb, pd) === ISCCW) ? 1 : 0;
	ccw3 = (dpd_ccw(pc, pd, pa) === ISCCW) ? 1 : 0;
	ccw4 = (dpd_ccw(pc, pd, pb) === ISCCW) ? 1 : 0;
	return (ccw1 ^ ccw2) && (ccw3 ^ ccw4);
    }
    return 0;
}


function dpd_between(pa, pb, pc)
{
    var pba = point_2d(), pca = point_2d();

    pba.x = pb.x - pa.x, pba.y = pb.y - pa.y;
    pca.x = pc.x - pa.x, pca.y = pc.y - pa.y;
    if (dpd_ccw(pa, pb, pc) !== ISON)
	return 0;
    return (pca.x * pba.x + pca.y * pba.y >= 0) &&
	((pca.x * pca.x + pca.y * pca.y) <= (pba.x * pba.x + pba.y * pba.y));
}



function to_opengl(x){ return ((2*x) - 1.);}

if (! _.isUndefined(poly)){


    var verts = [];
    var elements = [];
	var polygon = [],pnt;
	for(var i=0;i<poly.length;i++){
		pnt = new point_2d(poly[i].x,poly[i].y);
		polygon.push(pnt);
	}
	if (_.isUndefined(style))
		style = "line_loop";

	var indx = [];

	if(style === "triangles" || style === "triangles_loop" || style === "triangles_strip"){
		// get an array of arrays containing the triangulation of the polygon
		// every element of indx represents an array of three indices of the polygon
		// the points of polygon corresponding to the indices define a triangle
		indx = Ptriangulate(polygon);

		// convert the array of triangle index arrays to a single array of indices
		for(var i=0 ;i<indx.length;i++){
			for(var j=0;j<3;j++){
				elements.push(indx[i][j]);
			}
		}
	}
	else {
		for(var i=0;i<polygon.length;i++){
			elements.push(i);
		}
	}
	// extract the x and y coordinates of the polygon
	for(var i=0;i<polygon.length;i++){
		verts.push(polygon[i].x);
		verts.push(polygon[i].y);
		
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
