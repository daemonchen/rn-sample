#!/bin/sh
VERSION=$1
: ${VERSION:="3.0.8"}
code-push release \
awesomeMobile $PWD/release $VERSION --deploymentName Production