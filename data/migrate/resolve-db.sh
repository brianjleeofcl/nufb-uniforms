if [[ ! $1 ]]; then
    echo "Error: no env file supplied";
fi

BASEDIR=$(dirname $0)

if [[ ! $HOST ]]; then
    HOST="localhost";
fi

set -a
source $1
set +a

DB="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${HOST}:5432/${POSTGRES_DB}?sslmode=disable"

echo $DB
