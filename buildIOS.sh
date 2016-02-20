rm -rf $TMPDIR/react-*
react-native bundle \
 --dev false \
 --assets-dest $HOME/Documents/nzaom/nzaom-ios-platform/release \
 --minify --platform ios \
 --entry-file $HOME/Documents/nzaom/nzaom-ios-platform/index.ios.js \
 --bundle-output $HOME/Documents/nzaom/nzaom-ios-platform/release/main.jsbundle