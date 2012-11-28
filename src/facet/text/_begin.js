Facet.Text = {};

/*
 * We include here a shim for typeface.js (http://typeface.neocracy.org)
 * 
 * In case typeface.js is already loaded,
 * this is a no-op. Otherwise, we substitute the minimal API we need for loading
 * typeface data as returned by typefaceJS.pm (typefaceJS.pm is *different* from typeface.js.
 * it is a Perl module to convert TTF to the format required by typeface.js)
 * 
 */

if (_.isUndefined(window._typeface_js)) {
    /* we only need one basic function from typeface_js, and we include it from
     * the original file, which is MIT licensed and copyright 2008-2009 David Chester
     * 
     * http://typeface.neocracy.org/typeface-0.15.js
     */
    window._typeface_js = {
        faces: {},
	loadFace: function(typefaceData) {
	    var familyName = typefaceData.familyName.toLowerCase();
	    if (!this.faces[familyName]) {
		this.faces[familyName] = {};
	    }
	    if (!this.faces[familyName][typefaceData.cssFontWeight]) {
		this.faces[familyName][typefaceData.cssFontWeight] = {};
	    }
	    var face = this.faces[familyName][typefaceData.cssFontWeight][typefaceData.cssFontStyle] = typefaceData;
	    face.loaded = true;
	}
    };
}
