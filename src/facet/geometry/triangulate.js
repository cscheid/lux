Facet.Geometry.triangulate = function(opts) {
    opts = _.defaults(opts, {
        keep_array: false
    });
    var poly = opts.contour;
    var keep_array = opts.keep_array;
    if (_.isUndefined(poly)) {
        throw "Facet.Geometry.triangulate requires contour option";
    };

    var CW = 1, CCW = 0;

    function getRotation(polyList) {
        var z = 0, current, next, prev, j, numpts, first;

        numpts = polyList.length;

        //check that the linked list contains points
        for (j=0;j<numpts;j++)
            if (polyList[j].next > 0)
                break;
        if (j === numpts)
            return -1;

        first = j;
        for (var i=0; i<polyList.length; i++){
            current = polyList[j];
            next = polyList[current.next];
            z += vec.cross(current.point, next.point);
            j = polyList[j].next;
            if (j === first)
                break;
        }
        if(z > 0)
            return CCW;
        else
            return CW;
    }

    function hidePolyListElement(polyList,indx) {
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
        var element = {};
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
            if((pt1[0] < pt3[0]) && (pt2[0] < pt3[0]))
                return true;
            else if((pt1[0] > pt3[0]) && (pt2[0] > pt3[0]))
                return true;
        }
        else {  
            if((pt1[1] < ((m*pt1[0]) + b)) && (pt2[1] < ((m*pt2[0]) + b)))
                return true;
            else if((pt1[1] > ((m*pt1[0]) + b)) && (pt2[1] > ((m*pt2[0]) + b)))
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
            angleN = Math.atan2((next.point[1] - current.point[1]),(next.point[0] - current.point[0]));
            angleP = Math.atan2((prev.point[1] - current.point[1]),(prev.point[0] - current.point[0]));
            angle = angleP - angleN;
        }
        else{
            angleN = Math.atan2((next.point[1] - current.point[1]),(next.point[0] - current.point[0]));
            angleP = Math.atan2((prev.point[1] - current.point[1]),(prev.point[0] - current.point[0]));
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
        var edge = {}, mid = vec.make([0,0]);
        var deltaY,deltaX,cx,cy,rayStart,rayEnd;
        var m,b,displacement = .000001;

        rayStart = vec.make([vertx1.point[0],vertx1.point[1]]);
        if(typeof shift == "undefined")
            shift = 0;

        //change position of the point where the ray ends
        if(shift > 0){
            m = vertx2.m;
            b = vertx2.b;
            cx = vertx2.point[0] - (shift * displacement);
            cy = (m * cx) + b;
            rayEnd = vec.make([cx, cy]);
        }
        else
            rayEnd = vec.make([vertx2.point[0], vertx2.point[1]]);

        deltaX = rayEnd[0] - rayStart[0];
        deltaY = rayEnd[1] - rayStart[1];
        cx = rayStart[0];
        cy = rayStart[1];

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
            mid[0] = cx;
            mid[1] = cy + (deltaY/2.);
        }
        else if(deltaY === 0.){ //horizontal line
            edge.m = 0.;
            edge.b = cy;
            mid[0] = cx + (deltaX/2.);
            mid[1] = cy;
        }
        else { //arbitrary slope
            edge.m = deltaY/deltaX;
            edge.b = cy -(edge.m * cx);
            mid[0] = cx + (deltaX/2.);
            mid[1] = cy + (deltaY/2.);
        }
        edge.point = mid;

        return edge;
    }

    /*
     *
     *  get the line parameters (slope m and y intercept b)
     *  for each edge and the line that closes the triange
     *  defined by a vertex and its previous and next vertices
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
        current.edge.point = vec.make([0,0]);
        current.edge.point[0] = edge.point[0];
        current.edge.point[1] = edge.point[1];

        //get diagnal slope, y-intersect and midpoint coordinates
        current.diag = {};
        current.diag.edge = getLineParams(prevElmt,nextElmt);;
    }

    function triangulate(poly){
        var polyList = [];
        var reflex = [];
        var concave = [];
        var earTip = [];
        var triangles = [];
        var currentEar,tPrev,tNext,triangle,prev,next,aType,vertxCount; 
        var rotation, element;
        var i;

        //create linked list
        for(i=0;i<poly.length;i++){
            var polyListItem = {};
            polyListItem.point = vec.make([poly[i][0],poly[i][1]]);
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
        for(i=0;i<polyList.length;i++)
            getListParams(polyList,i);

        for(i=0;i<polyList.length;i++){
            angleType(polyList,i,rotation);
            if(polyList[i].isReflex){
                addElement(reflex,i);
            }
            else {
                addElement(concave,i);
                if(polyList[i].isEar){
                    element = {};
                    addElement(earTip,i);
                }
            }
        }
        //the polygon, reflex, concave and ear tip structures are initialize at this point

        vertxCount = polyList.length;
        while(vertxCount >= 3){
            for(i=0;i<earTip.length;i++)
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

    // get an array of arrays containing the triangulation of the polygon
    // every element of indx represents an array of three indices of the polygon
    // the points of polygon corresponding to the indices define a triangle
    return triangulate(poly);
};
