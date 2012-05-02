var dfltClassNum = 3;
var classColors = [];
var color = colorBuffers();
var schemeType = "";
var classNum;

function getByType(type,cData){
	var aRet = new Array;
	var j=0;
	if(cData === undefined)
		    cData = ColorData.colors().color;

	jQuery.map(cData,function(v,i) { 
		if( v.type === type){
			aRet[j++] = {
				name: cData[i].name, 
				colors: cData[i].colors,
				type: cData[i].type,
				color_num: cData[i].color_num,
				R: cData[i].R,G: cData[i].G,B: cData[i].B
			};
		}
		});
	return aRet;

}

function getByName(name,cData){
	var aRet = new Array;
	var j=0;
	if(cData === undefined)
		    cData = ColorData.colors().color;
	jQuery.map(cData,function(v,i) { 
		if( v.name === name){
			aRet[j++] = {
				name: cData[i].name, 
				colors: cData[i].colors,
				type: cData[i].type,
				color_num: cData[i].color_num,
				R: cData[i].R,G: cData[i].G,B: cData[i].B
			};
		}
		});
	return aRet;
}

function getByClassNum(cNum,cData){
	var aRet = new Array;
	var j=0;
	cNum = cNum - 0;
	if(cData === undefined)
		    cData = ColorData.colors().color;
	jQuery.map(cData,function(v,i) { 
		if( v.colors === cNum){
			aRet[j++] = {
				name: cData[i].name, 
				colors: cData[i].colors,
				type: cData[i].type,
				color_num: cData[i].color_num,
				R: cData[i].R,G: cData[i].G,B: cData[i].B
			};
		}
		});
	return aRet;

}

function getByColorNum(cNum,cData){
	var aRet = new Array;
	var j=0;
	if( cData === undefined)
		showError("colorTable","No color values found");
	jQuery.map(cData,function(v,i) { 
		if( v.color_num === cNum){
			aRet[j++] = {
				name: cData[i].name, 
				colors: cData[i].colors,
				type: cData[i].type,
				color_num: cData[i].color_num,
				R: cData[i].R,G: cData[i].G,B: cData[i].B
			};
		}
		});
	return aRet;

}

function getColors (pAlpha){
	return [S.vec(S.vec(classColors[0]),pAlpha),
         S.vec(S.vec(classColors[1]),pAlpha),
         S.vec(S.vec(classColors[2]),pAlpha)];
 
}

function setClassNum(val){
	classNum = val;
	$('input:text[name=classNum]').val(classNum);
}
 
function colorBuffers()
{
    var d = ColorData.colors();
    return {
       name: jQuery.map(d.color,function(v,i) { return v.name; }),
       colors: jQuery.map(d.color,function(v,i) { return v.colors; }),
       type: jQuery.map(d.color,function(v,i) { return v.type; }),
       color_num: jQuery.map(d.color,function(v,i) { return v.color_num; }),
       R: jQuery.map(d.color,function(v,i) { return v.R; }),
       G: jQuery.map(d.color,function(v,i) { return v.G; }),
       B: jQuery.map(d.color,function(v,i) { return v.B; }),
    };
}

	/*
	* event handler for the scheme type selector
	* creates the color schemes palette table
	*/
    function changeSchemeType() {

	var schemeTypeName = "";
	var name;
	var scheme = new Array();
	var colorSet = new Array();

	$("#scheme option:selected").each(function () {
		schemeType = $(this).val();
		schemeTypeName = $(this).attr("title");
	});

	if( schemeType === ""){  //remove scheme palette if no scheme selected
		$("#cTitle").html("");
		$("#colorTable").html("");
		return;
	}

	//create table to contain the color palette
	initTable("colorTable");

	var txt=$('input:text[name=classNum]').val();

	if( txt === null || txt === ""){
		classNum = dfltClassNum;
		$('input:text[name=classNum]').val(dfltClassNum);
	}
	else if ( isNaN(txt)){
		$("#cTitle").html("");
		showError("colorTable","Class number must be numeric");
		return;
	}
	else if( txt > 12){
		$("#cTitle").html("");
		showError("colorTable","Class number must less than 13");
		return;

	}
	else
		classNum = txt;

	//create array of the colors matching the sheme type, and number of classes
	scheme = jQuery.map(color.type,function(v,i) { 
		if( v === schemeType && color.color_num[i] === 1 && color.colors[i] === (classNum - 0))
			return color.name[i];
		});

	if( scheme.length === 0) {
		$("#cTitle").html("");
		showError("colorTable","No " + schemeTypeName + 
			" palette available with " + classNum + " colors");
		return;
	}


	$("#cTitle").html("Color Schemes");

	for (var i = 0; i < scheme.length; i++) {
		name = scheme[i];

		//load the colorSet array with the rgb values for each class
		jQuery.map(color.name,function(v,i) { 
		if( v === name && color.color_num[i] === 1 &&  color.colors[i] === (classNum - 0)){
			count = 0;
			for( var j=i;j<(i + classNum);j++){
				r = color.R[j];
				g = color.G[j];
				b = color.B[j];
				colorSet[count++] = [r,g,b];
			}
		}
		});

		//add a column to the palette for the current scheme		
		loadTable("colorTable",name, colorSet);

	}
	
	//now that the radio buttons are defined, set event handler
     	$("input[name='rdio']").change(function(){
		$('input:text[name=schemeName]').val("");
		return changeColor(
			$("input[name='rdio']:checked").val());
	});
    }


	/*
	* creates the color schemes table
	*
	*/
    function initTable(ID){
	var tId,bId,rId,divId;
	divId = "#" + ID;
	$(divId).html("");
	$(divId).append("<table id='t" + ID + 
			"' border='1'> <tbody id='b" + ID + 
			"'><tr id='r" + ID + "'></tr></tbody></table>");
    }


	/*
	* displays error message
	*
	*/
    function showError(ID,message){
	var htmlString;
	var rId = "#r" + ID;

	$(rId).append(message);
    }


	/*
	* Loads the rgb values for a color scheme into the rows
	* of a color scheme table
	*/
    function loadTable(ID,name,colorSet){
	var rId, tId,hexcolor;
	var htmlString;
	rId = "#r" + ID;
	tId = "#t" + ID;

	htmlString = createCol(name);

	//add current palette colors to table
	for(var i=0;i<classNum;i++){
		//convert rgb color to hex value
		hexcolor = "#" + 
			decToHex(colorSet[i][0]).toUpperCase() + 
			decToHex(colorSet[i][1]).toUpperCase() + 
			decToHex(colorSet[i][2]).toUpperCase();
 		//set palette color
		htmlString += "<tr><td style='background-color:" + 
				hexcolor + "'> </td></tr>";
	}
	htmlString += "</table></td>";
	//add the current palette to the color scheme table
	$(rId).append(htmlString);
    }

	/*
	* Creates a color scheme palette table that appears as a column
	* in the color schemes table
	*/
    function createCol(name){
	var htmlString;
	htmlString = "<td><table>";
	htmlString += "<tr><td style='background-color:#FFFFFF,color:#000000,text-align:top'>";
	htmlString += "<label><input type='radio' name='rdio' value='" + name + "' />" + name + "</label>";
	htmlString += "</td></tr>";
	return htmlString;
    }


   function decToHex(val){
   	var hexOne,hexFinal;
   
   	hexOne = val.toString(16);
   	if (val<=15)
   		hexFinal = "0"+hexOne;
   	else
   		hexFinal = hexOne;
   	return hexFinal;
   	}

    function changeColorName(){
 
	//get color scheme name and verify it is valid
 	var txt = $('input:text[name=schemeName]').val();
	var sName = null;
	jQuery.map(color.name,function(v,i) { 
		if( v.toLowerCase() === txt.toLowerCase()){
			sName = color.name[i];
			return;
		}
		});

	if( sName === null || sName === ""){
		initTable("colorTable");
		showError("colorTable","Color scheme name not recognized");
		return;
	}

	//refresh display with the selected color scheme
	$("#cTitle").html("");
	$("#colorTable").html("");
	$('input:text[name=classNum]').val("");
	$("#scheme").val("");	
	pickColorScheme(sName,classNum);	
   }




	/*
	* event handler for palette radio button selection
	*
	*/
    function changeColor(sName){
 	var txt = $('input:text[name=schemeName]').val(sName);

	//load classColors array with the rgb values of a color scheme
	pickColorScheme(sName,classNum);	

   }

    function pickColorScheme(name,number){

	//load classColors array with the rgb values of a color scheme
	var c = getByClassNum(number,getByName(name));
	for(var i=0;i<classNum;i++)
		classColors[i] = Shade.vec(c[i].R/255, c[i].G/255, c[i].B/255);
	refresh_webgl();	

   }

