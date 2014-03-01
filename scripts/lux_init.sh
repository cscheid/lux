#!/bin/bash
#
# lux_init.sh: A script to populate a directory with a bare-bones,
# but running, Lux setup.
#
# The simplest way to run this script is:
#
#     $ LUX_PATH/scripts/lux_init.sh TARGET
#
# This will create the skeleton setup in directory TARGET (which will
# be created for you in case it doesn't exist)
#
# If TARGET is not supplied, `pwd` is used instead
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

mkdir -p $TARGET_DIR/src
mkdir -p $TARGET_DIR/css
mkdir -p $TARGET_DIR/lib

cp $LUX_DIR/lux.min.js $TARGET_DIR/src
cp $LUX_DIR/lux.js $TARGET_DIR/src
cp $LUX_DIR/lib/jquery-2.1.0.min.js $TARGET_DIR/lib
cp $LUX_DIR/lib/jquery.mousewheel.js $TARGET_DIR/lib
cp $LUX_DIR/lib/jquery-ui-1.10.4.custom.min.js $TARGET_DIR/lib
cp -r $LUX_DIR/demos/css $TARGET_DIR
cp -r $LUX_DIR/lib/ui-lightness $TARGET_DIR/css

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
  <script src="src/lux.js"></script> <!-- replace with lux.min.js when you're done debugging -->
  <script src="main.js"></script>
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

cat > $TARGET_DIR/main.js <<EOF
\$().ready(function() {
    var gl = Lux.init();
    Lux.Scene.invalidate();
});
EOF
