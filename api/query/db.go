package query

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v4/pgxpool"
)

func getDBURL() string {
	if env, exist := os.LookupEnv("DATABASE_ADDRESS"); exist {
		return env
	}

	network := os.Getenv("DB_IMG")
	if _, dev := os.LookupEnv("LOCAL_DB"); dev {
		network = "localhost"
	}
	dbName := os.Getenv("POSTGRES_DB")
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")

	return fmt.Sprintf("postgresql://%s:%s@%s:%s/%s", user, password, network, "5432", dbName)
}

func ConnectDB(ctx context.Context) (*pgxpool.Pool, error) {
	return pgxpool.Connect(ctx, getDBURL())
}
