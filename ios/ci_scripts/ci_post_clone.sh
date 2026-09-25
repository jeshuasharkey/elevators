#!/bin/sh
set -eu
# The checked-in project and shared scheme require no package installation.
if [ -n "${CI_BUILD_NUMBER:-}" ]; then
  cd "${CI_PRIMARY_REPOSITORY_PATH}/ios"
  xcrun agvtool new-version -all "${CI_BUILD_NUMBER}"
fi
