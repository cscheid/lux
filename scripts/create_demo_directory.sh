#!/bin/bash
#
# create_demo_directory.sh: A tweaked version of lux_init.sh that points to 
# a global lux.js
#
################################################################################
#
# This script must be located inside the lux distribution, under the
# 'scripts' directory, for it to work. (symlinks are fine, hardlinks aren't)
#
# This script requires the readlink utility, which is not available by
# default on OS X. If you have homebrew, say "brew install coreutils"
# and you'll be set.  (I no longer speak macports or fink, sorry)

case `uname` in
    Darwin )
	READLINKBIN=`which greadlink`
	if [ "$READLINKBIN" == "" ]; then
	    echo Error: I need greadlink, which is available by saying \'brew install coreutils\'
	    exit 1;
	fi
	;;
    Linux )
	READLINKBIN=`which readlink`
	;;
    * )
	echo Sorry, I don\'t speak `uname`;
	exit 1;
	;;
esac

SCRIPTPATH=`$READLINKBIN -fn $0`
LUX_DIR=`dirname $SCRIPTPATH`/..

TARGET_DIR=$1
if [ "$TARGET_DIR" == "" ]; then
    TARGET_DIR=`pwd`
fi

mkdir -p $TARGET_DIR/css
mkdir -p $TARGET_DIR/lib

cp $LUX_DIR/lib/jquery-2.1.0.min.js $TARGET_DIR/lib
cp $LUX_DIR/lib/jquery.mousewheel.js $TARGET_DIR/lib
cp $LUX_DIR/lib/jquery-ui-1.10.4.custom.min.js $TARGET_DIR/lib
cp -r $LUX_DIR/demos/css $TARGET_DIR
cp -r $LUX_DIR/lib/ui-lightness $TARGET_DIR/css

PATH_TO_LUX=$(python -c "import os.path; print os.path.relpath('${LUX_DIR}/lux.js', '${TARGET_DIR}')")

cat > $TARGET_DIR/index.html <<EOF
<html>
<head><title></title>
  <link rel="stylesheet" href="css/bootstrap.css"/>
  <link rel="stylesheet" href="css/style.css"/>
  <link rel="stylesheet" href="css/mchighlight-javascript.css"/>
  <link type="text/css" href="css/ui-lightness/jquery-ui-1.10.4.custom.css" rel="stylesheet" />
  <script src="lib/jquery-2.1.0.min.js"></script>
  <script src="lib/jquery.mousewheel.js"></script>
  <script src="lib/jquery-ui-1.10.4.custom.min.js"></script>
  <script src="${PATH_TO_LUX}"></script> <!-- replace with lux.min.js when you're done debugging -->
  <script src="index.js"></script>
</head>
<body>
<div class="body">
<div class="content">
<h1>Hello, World!</h1>
<div><canvas id="webgl" width="720" height="480"></canvas></div>
</div>
</div>
</body>
</html>
EOF

cat > $TARGET_DIR/index.js <<EOF
\$().ready(function() {
    var gl = Lux.init();
    Lux.Scene.invalidate();
});
EOF
