#!/bin/sh
rm -rf $TMPDIR/react-*
react-native bundle \
 --dev false \
 --assets-dest $PWD/release \
 --minify --platform ios \
 --entry-file $PWD/index.ios.js \
 --bundle-output $PWD/release/main.jsbundle