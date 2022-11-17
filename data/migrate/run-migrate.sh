#! usr/bin/env sh

ENV_FILE=$1
shift 1

DB=$(sh ./resolve-db.sh $ENV_FILE)

migrate -path ./migrations -database $DB "$@"

