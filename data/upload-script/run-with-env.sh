#! usr/bin/env sh

ENV_FILE=$1
TARGET_SCRIPT=$2

shift 2

env $(cat $ENV_FILE | xargs) node $TARGET_SCRIPT "$@"
