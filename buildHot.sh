#!/bin/sh
VERSION=$1
: ${VERSION:="3.1.0"}
code-push release \
awesomeMobile $PWD/release $VERSION --deploymentName Production